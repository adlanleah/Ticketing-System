import express from 'express';
import * as bookingController from '../controllers/BookingController';
import * as authController from '../controllers/AuthController';

const router = express.Router();

router.use(authController.protect);

router.get('/', bookingController.getAllBookings);
router.post('/', bookingController.createBooking);
router.get('/:id', bookingController.getBooking);
router.get('/user/:userId', bookingController.getUserBookings);
router.get('/event/:eventId', bookingController.getEventBookings);

export default router;
