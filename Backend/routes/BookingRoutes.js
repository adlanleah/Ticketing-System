import express from 'express';
import * as bookingController from '../controllers/BookingController.js';
import * as authController from '../controllers/AuthController.js';

const router = express.Router();

router.use(authController.protect);

router.get('/user/:userId', bookingController.getUserBookings);
router.get('/event/:eventId', bookingController.getEventBookings);
router.get('/', bookingController.getAllBookings);
router.post('/', bookingController.createBooking);
router.get('/:id', bookingController.getBooking);

export default router;
