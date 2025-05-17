import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../components/AuthContext';
import axios from 'axios';

const Booking = () => {
  const { currentUser  } = useAuth();
  const [formData, setFormData] = useState({
    name: currentUser ?.name || '',
    email: currentUser ?.email || '',
    phone: currentUser ?.phone || '',
    event: '',
    session: '',
    date: '',
    seatType: 'standard',
    paymentMethod: 'mobile_money',
    selectedSeat: null
  });

  const [events, setEvents] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [seats, setSeats] = useState([]);
  const [availableSeats, setAvailableSeats] = useState([]);
  const [loading, setLoading] = useState({
    events: false,
    sessions: false,
    seats: false,
    booking: false
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Fetching all active events
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(prev => ({ ...prev, events: true }));
        const res = await axios.get('/api/events/active');
        setEvents(res.data.data);
        if (res.data.data.length > 0) {
          setFormData(prev => ({ ...prev, event: res.data.data[0]._id }));
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch events');
      } finally {
        setLoading(prev => ({ ...prev, events: false }));
      }
    };
    fetchEvents();
  }, []);

  // Fetching sessions when event or date changes
  useEffect(() => {
    if (formData.event && formData.date) {
      const fetchSessions = async () => {
        try {
          setLoading(prev => ({ ...prev, sessions: true }));
          const res = await axios.get(`/api/events/${formData.event}/sessions?date=${formData.date}`);
          setSessions(res.data.data);
          if (res.data.data.length > 0) {
            setFormData(prev => ({ ...prev, session: res.data.data[0]._id }));
          }
        } catch (err) {
          setError(err.response?.data?.message || 'Failed to fetch sessions');
        } finally {
          setLoading(prev => ({ ...prev, sessions: false }));
        }
      };
      fetchSessions();
    }
  }, [formData.event, formData.date]);

  // Fetching available seats when session changes
  useEffect(() => {
    if (formData.session && formData.date) {
      const fetchAvailableSeats = async () => {
        try {
          setLoading(prev => ({ ...prev, seats: true }));
          const res = await axios.get(`/api/bookings/availability?event=${formData.event}&session=${formData.session}&date=${formData.date}`);
          setAvailableSeats(res.data.data.availableSeats);
          setSeats(res.data.data.seatMap);
        } catch (err) {
          setError(err.response?.data?.message || 'Failed to fetch seat availability');
        } finally {
          setLoading(prev => ({ ...prev, seats: false }));
        }
      };
      fetchAvailableSeats();
    }
  }, [formData.session, formData.date, formData.event]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
      ...(name === 'event' && { session: '', selectedSeat: null }),
      ...(name === 'date' && { session: '', selectedSeat: null }),
      ...(name === 'session' && { selectedSeat: null })
    }));
  };

  const handleSeatSelect = (seatId) => {
    const selectedSeat = seats.find(seat => seat.id === seatId);
    
    setFormData(prev => ({
      ...prev,
      selectedSeat: seatId,
      seatType: getSeatType(selectedSeat.section)
    }));
  };

  const getSeatType = (section) => {
    switch(section) {
      case 'vip': return 'vip';
      case 'front': return 'premium';
      default: return 'standard';
    }
  };

  const getSeatPrice = (seatId) => {
    const seat = seats.find(s => s.id === seatId);
    return seat ? seat.price : 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.selectedSeat) {
      setError('Please select a seat');
      return;
    }

    setLoading(prev => ({ ...prev, booking: true }));
    setError('');

    try {
      const bookingData = {
        event: formData.event,
        session: formData.session,
        seatNumber: formData.selectedSeat,
        paymentMethod: formData.paymentMethod,
        price: getSeatPrice(formData.selectedSeat)
      };

      const res = await axios.post('/api/bookings', bookingData);
      navigate(`/ticket/${res.data.data._id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Booking failed. Please try again.');
    } finally {
      setLoading(prev => ({ ...prev, booking: false }));
    }
  };

  const renderSeatMap = () => {
    if (loading.seats) return <div className="text-center py-8">Loading seat map...</div>;
    if (!seats.length) return <div className="text-center py-8">No seats available for this session</div>;

    const sections = {};
    seats.forEach(seat => {
      if (!sections[seat.section]) {
        sections[seat.section] = [];
      }
      sections[seat.section].push(seat);
    });

    return (
      <div className="mt-6">
        <h3 className="text-xl font-bold text-primary mb-4">Select Your Seat</h3>
        <div className="bg-gray-200 text-center py-2 mb-6 rounded">
          <h4 className="font-bold">STAGE</h4>
        </div>
        {Object.entries(sections).map(([sectionName, sectionSeats]) => (
          <div key={sectionName} className="mb-8">
            <h4 className="font-bold text-secondary mb-2">
              {sectionName.toUpperCase()} Section (UGX {sectionSeats[0]?.price?.toLocaleString() || '0'})
            </h4>
            <div className="grid grid-cols-10 gap-2">
              {sectionSeats.map(seat => (
                <Seat 
                  key={seat.id}
                  seat={seat}
                  isAvailable={availableSeats.includes(seat.id)}
                  isSelected={formData.selectedSeat === seat.id}
                  onSelect={handleSeatSelect}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold text-primary mb-6">Book Your Exhibition Seat</h1>
      {error && (
        <div className="bg-red-100 text-red-800 p-4 rounded-lg mb-6">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-lg">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-gray-700 mb-1">Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                required
                disabled
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                required
                disabled
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-1">Phone Number</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                required
              />
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-gray-700 mb-1">Event</label>
              <select
                name="event"
                value={formData.event}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                required
                disabled={loading.events}
              >
                {loading.events ? (
                  <option>Loading events...</option>
                ) : (
                  events.map(event => (
                    <option key={event._id} value={event._id}>{event.title}</option>
                  ))
                )}
              </select>
            </div>
            <div>
              <label className="block text-gray-700 mb-1">Date</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                required
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-1">Session</label>
              <select
                name="session"
                value={formData.session}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                required
                disabled={loading.sessions || !formData.date}
              >
                {loading.sessions ? (
                  <option>Loading sessions...</option>
                ) : sessions.length > 0 ? (
                  sessions.map(session => (
                    <option key={session._id} value={session._id}>
                      {session.name} ({session.timeSlot})
                    </option>
                  ))
                ) : (
                  <option>No sessions available</option>
                )}
              </select>
            </div>
            <div>
              <label className="block text-gray-700 mb-1">Payment Method</label>
              <select
                name="paymentMethod"
                value={formData.paymentMethod}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                required
              >
                <option value="mobile_money">Mobile Money</option>
                <option value="credit_card">Credit Card</option>
                <option value="bank_transfer">Bank Transfer</option>
              </select>
            </div>
            {formData.selectedSeat && (
              <div className="bg-gray-100 p-4 rounded-lg">
                <h4 className="font-bold text-primary">Selected Seat</h4>
                <p>Seat: {formData.selectedSeat}</p>
                <p>Price: UGX {getSeatPrice(formData.selectedSeat).toLocaleString()}</p>
              </div>
            )}
          </div>
        </div>
        {formData.date && formData.session && renderSeatMap()}
        <div className="mt-8">
          <button
            type="submit"
            className="w-full bg-secondary text-white py-3 px-6 rounded-lg font-bold hover:bg-red-700 transition disabled:opacity-50"
            disabled={!formData.selectedSeat || loading.booking}
          >
            {loading.booking ? (
              'Processing...'
            ) : formData.selectedSeat ? (
              `Confirm Booking (Pay UGX ${getSeatPrice(formData.selectedSeat).toLocaleString()})`
            ) : (
              'Please select a seat'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

// Seat component 
const Seat = ({ seat, isAvailable, isSelected, onSelect }) => {
  const handleClick = () => {
    if (isAvailable) {
      onSelect(seat.id);
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={!isAvailable}
      className={`w-8 h-8 flex items-center justify-center rounded text-xs font-bold
        ${isSelected 
          ? 'bg-accent text-primary' 
          : isAvailable 
            ? 'bg-green-500 text-white hover:bg-green-600' 
            : 'bg-gray-300 text-gray-500 cursor-not-allowed'}
      `}
      title={isAvailable ? `Seat ${seat.id} - Available` : `Seat ${seat.id} - Booked`}
    >
      {seat.id}
    </button>
  );
};

export default Booking;
