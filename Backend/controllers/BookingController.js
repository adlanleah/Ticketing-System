import Booking from '../models/BookingModel.js';
import Session from '../models/SessionModel.js';
import Ticket from '../models/TicketModel.js';
import asyncHandler from '../middlewares/async.js';
import ErrorResponse from '../utils/ErrorResponse.js';
import generateQR from '../utils/GenerateTicket.js';


export const getSeatAvailability = asyncHandler(async (req, res, next) => {
    const { event, session, date } = req.query;

    
    if (!event || !session || !date) {
        return next(new ErrorResponse('Please provide event, session and date', 400));
    }

    const sessionData = await Session.findById(session);
    if (!sessionData) {
        return next(new ErrorResponse('Session not found', 404));
    }

    const bookings = await Booking.find({ session });
    const bookedSeats = bookings.map(booking => booking.seatNumber);

    res.status(200).json({
        success: true,
        data: {
            availableSeats: sessionData.seatMap
                .filter(seat => !bookedSeats.includes(seat.id))
                .map(seat => seat.id),
            seatMap: sessionData.seatMap
        }
    });
});



export const createBooking = asyncHandler(async (req, res, next) => {
    const { event, session, seatNumber, paymentMethod, price } = req.body;
    const userId = req.user.id;

    const sessionData = await Session.findById(session);
    const seat = sessionData.seatMap.find(s => s.id === seatNumber);
    if (!seat) {
        return next(new ErrorResponse('Invalid seat number', 400));
    }

    const existingBooking = await Booking.findOne({ session, seatNumber });
    if (existingBooking) {
        return next(new ErrorResponse('Seat already booked', 400));
    }

    const booking = await Booking.create({
        user: userId,
        event,
        session,
        seatNumber,
        price,
        paymentMethod,
        isPaid: true 
    });

    const qrCode = await generateQR(booking._id.toString());
    await Ticket.create({ booking: booking._id, qrCode });

    await sessionData.updateAvailability();

    res.status(201).json({
        success: true,
        data: booking
    });
});

export const getUserBookings = asyncHandler(async (req, res, next) => {
    const bookings = await Booking.find({ user: req.params.userId }).populate('event session');
    res.status(200).json({ success: true, data: bookings });
});

// Add these functions to your BookingController.js file

export const getEventBookings = asyncHandler(async (req, res, next) => {
    const bookings = await Booking.find({ event: req.params.eventId })
        .populate('user', 'name email')
        .populate('session');

    res.status(200).json({
        success: true,
        count: bookings.length,
        data: bookings
    });
});

export const getAllBookings = asyncHandler(async (req, res, next) => {
    const bookings = await Booking.find()
        .populate('user', 'name email')
        .populate('event', 'name')
        .populate('session');

    res.status(200).json({
        success: true,
        count: bookings.length,
        data: bookings
    });
});

export const getBooking = asyncHandler(async (req, res, next) => {
    const booking = await Booking.findById(req.params.id)
        .populate('user', 'name email')
        .populate('event')
        .populate('session');

    if (!booking) {
        return next(new ErrorResponse(`Booking not found with id of ${req.params.id}`, 404));
    }

    res.status(200).json({
        success: true,
        data: booking
    });
});