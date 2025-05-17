import Booking from '../models/Booking';
import Session from '../models/Session';
import Ticket from '../models/Ticket';
import asyncHandler from '../middleware/async';
import ErrorResponse from '../utils/Error';
import generateQR from '../utils/generateTicket';


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
