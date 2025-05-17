import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../components/AuthContext';
import axios from 'axios';
import { QRCodeCanvas } from "qrcode.react";
import { FaTicketAlt, FaCalendarAlt, FaClock, FaChair, FaPrint } from 'react-icons/fa';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const Ticket = () => {
  const { id } = useParams();
  const { currentUser } = useAuth();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        const res = await axios.get(`/api/tickets/${id}`);
        setTicket(res.data.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch ticket');
      } finally {
        setLoading(false);
      }
    };

    fetchTicket();
  }, [id]);

  const handlePrint = () => {
    const input = document.getElementById('ticket-to-print');
    html2canvas(input, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a6');
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`ticket-${id}.pdf`);
    });
  };

  if (loading) {
    return <div className="text-center py-8">Loading ticket...</div>;
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <div className="bg-red-100 text-red-800 p-4 rounded-lg max-w-md mx-auto">
          {error}
        </div>
        <button 
          onClick={() => navigate(-1)}
          className="mt-4 bg-primary text-white px-4 py-2 rounded hover:bg-blue-800"
        >
          Go Back
        </button>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold text-gray-800">Ticket Not Found</h1>
        <button 
          onClick={() => navigate('/dashboard')}
          className="mt-4 bg-primary text-white px-4 py-2 rounded hover:bg-blue-800"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-md">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-primary">Your Exhibition Ticket</h1>
        <button
          onClick={handlePrint}
          className="flex items-center bg-primary text-white px-4 py-2 rounded hover:bg-blue-800"
        >
          <FaPrint className="mr-2" /> Print Ticket
        </button>
      </div>

      <div id="ticket-to-print" className="bg-white rounded-xl shadow-xl overflow-hidden border-2 border-primary">
        {/* Ticket Header */}
        <div className="bg-primary text-white p-4 text-center">
          <h2 className="text-2xl font-bold">Victoria University Exhibition</h2>
          <p className="text-accent">Official Admission Ticket</p>
        </div>
        
        {/* Ticket Body */}
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-2">
              <FaTicketAlt className="text-secondary text-2xl" />
              <span className="font-bold">Ticket #{ticket.ticketNumber}</span>
            </div>
            <div className="bg-gray-100 px-3 py-1 rounded-full text-sm capitalize">
              {ticket.booking.seatType}
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <FaCalendarAlt className="text-primary" />
              <span>{new Date(ticket.booking.session.date).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center space-x-3">
              <FaClock className="text-primary" />
              <span>{ticket.booking.session.name} ({ticket.booking.session.timeSlot})</span>
            </div>
            <div className="flex items-center space-x-3">
              <FaChair className="text-primary" />
              <span>Seat: {ticket.booking.seatNumber}</span>
            </div>
          </div>
          
          <div className="mt-8 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-bold text-primary mb-2">Ticket Holder</h3>
            <p className="font-medium">{ticket.booking.user.name}</p>
            <p className="text-sm text-gray-600">{ticket.booking.user.email}</p>
            <p className="text-sm text-gray-600">{ticket.booking.user.phone}</p>
            {ticket.booking.user.affiliation && (
              <p className="text-sm text-gray-600 mt-1">Affiliation: {ticket.booking.user.affiliation}</p>
            )}
          </div>
          
          <div className="mt-6 flex flex-col items-center">
            <div className="p-3 bg-white border-2 border-dashed border-gray-300 rounded-lg mb-2">
              <QRCode 
                value={ticket._id} 
                size={128}
                level="H"
                includeMargin={true}
              />
            </div>
            <p className="text-xs text-gray-500">Scan this QR code at the entrance</p>
          </div>
          
          <div className="mt-6 text-center text-sm text-gray-500">
            <p>Present this ticket at the entrance for scanning.</p>
            <p>Please arrive 30 minutes before your session.</p>
          </div>
        </div>
        
        {/* Ticket Footer */}
        <div className="bg-gray-100 p-4 text-center text-xs text-gray-600">
          <p>© {new Date().getFullYear()} Victoria University Uganda. All rights reserved.</p>
        </div>
      </div>

      {currentUser?.role === 'admin' && (
        <div className="mt-6 bg-white p-4 rounded-lg shadow">
          <h3 className="font-bold text-primary mb-2">Admin Actions</h3>
          <div className="flex space-x-3">
            <button
              onClick={() => navigate(`/admin/checkin/${ticket._id}`)}
              className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
            >
              Check In
            </button>
            <button
              onClick={() => navigate(`/admin/bookings/${ticket.booking._id}`)}
              className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
            >
              View Booking
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Ticket;
