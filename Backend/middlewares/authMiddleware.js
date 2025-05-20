import jwt from 'jsonwebtoken';
import ErrorResponse from '../utils/Error.js';
import User from '../models/userModel';

// Protect routes
export const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies.token) {
        token = req.cookies.token;
    }

    if (!token) {
        return next(new ErrorResponse('Not authorized to access this route', 401));
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id);
        next();
    } catch (err) {
        return next(new ErrorResponse('Not authorized to access this route', 401));
    }
};

// Grant access to specific roles
export const authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(new ErrorResponse(`User  role ${req.user.role} is not authorized to access this route`, 403));
        }
        next();
    };
};

// admin status
export const checkOwnership = (model) => {
    return async (req, res, next) => {
        const resource = await model.findById(req.params.id);

        if (!resource) {
            return next(new ErrorResponse(`Resource not found with id of ${req.params.id}`, 404));
        }

        if (resource.user.toString() !== req.user.id && req.user.role !== 'admin') {
            return next(new ErrorResponse(`User  ${req.user.id} is not authorized to update this resource`, 401));
        }

        next();
    };
};
