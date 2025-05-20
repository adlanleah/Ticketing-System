import express from 'express';
import { protect, restrictTo } from '../controllers/AuthController.js';
import * as eventController from '../controllers/EventController.js';

const router = express.Router();

router.get('/active', eventController.getActiveEvents);
router.get('/:eventId/sessions', eventController.getEventSessions);

// Protected routes
router.use(protect, restrictTo('admin', 'organizer'));

router.post('/', eventController.createEvent);
router.post('/:eventId/sessions', eventController.addSession);

export default router;
