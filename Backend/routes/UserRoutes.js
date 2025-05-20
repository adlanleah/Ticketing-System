import express from 'express';
import { protect, restrictTo } from '../controllers/AuthController.js';
import * as userController from '../controllers/UserController.js';

const router = express.Router();

router.use(protect);

router.get('/', restrictTo('admin'), userController.getUsers);
router.post('/', restrictTo('admin'), userController.createUser );
router.get('/:id', restrictTo('admin'), userController.getUser );
router.put('/:id', restrictTo('admin'), userController.updateUser );
router.delete('/:id', restrictTo('admin'), userController.deleteUser );

export default router;
