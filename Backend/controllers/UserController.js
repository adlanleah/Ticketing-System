import User from '../models/User';
import asyncHandler from '../middleware/async';
import ErrorResponse from '../utils/Error';

export const getUsers = asyncHandler(async (req, res, next) => {
    const users = await User.find();
    res.status(200).json({ success: true, data: users });
});

export const getUser  = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.params.id);
    if (!user) {
        return next(new ErrorResponse(`User  not found with id of ${req.params.id}`, 404));
    }
    res.status(200).json({ success: true, data: user });
});

export const createUser  = asyncHandler(async (req, res, next) => {
    const user = await User.create(req.body);
    res.status(201).json({ success: true, data: user });
});


export const updateUser  = asyncHandler(async (req, res, next) => {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });
    if (!user) {
        return next(new ErrorResponse(`User  not found with id of ${req.params.id}`, 404));
    }
    res.status(200).json({ success: true, data: user });
});


export const deleteUser  = asyncHandler(async (req, res, next) => {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
        return next(new ErrorResponse(`User  not found with id of ${req.params.id}`, 404));
    }
    res.status(200).json({ success: true, data: {} });
});
