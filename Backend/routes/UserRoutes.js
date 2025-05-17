import express from 'express';
import { protect, restrictTo } from '../controllers/authController';
import * as userController from '../controllers/userController';

const router = express.Router();

router.use(protect);

router.get('/', restrictTo('admin'), userController.getUsers);
router.post('/', restrictTo('admin'), userController.createUser );
router.get('/:id', restrictTo('admin'), userController.getUser );
router.put('/:id', restrictTo('admin'), userController.updateUser );
router.delete('/:id', restrictTo('admin'), userController.deleteUser );

export default router;
