import Event from '../models/EventModel.js';
import Session from '../models/SessionModel.js';
import asyncHandler from '../middlewares/async.js';
import ErrorResponse from '../utils/ErrorResponse.js';

export const getActiveEvents = asyncHandler(async (req, res, next) => {
    const events = await Event.find({ isActive: true });
    res.status(200).json({ success: true, data: events });
});


export const getEventSessions = asyncHandler(async (req, res, next) => {
    const { date } = req.query;
    if (!date) {
        return next(new ErrorResponse('Please provide a date', 400));
    }

    const sessions = await Session.find({
        event: req.params.eventId,
        date: new Date(date),
        isActive: true
    });

    res.status(200).json({ success: true, data: sessions });
});


export const createEvent = asyncHandler(async (req, res, next) => {
    const event = await Event.create(req.body);
    res.status(201).json({ success: true, data: event });
});


export const addSession = asyncHandler(async (req, res, next) => {
    req.body.event = req.params.eventId;
    const session = await Session.create(req.body);
    res.status(201).json({ success: true, data: session });
});
