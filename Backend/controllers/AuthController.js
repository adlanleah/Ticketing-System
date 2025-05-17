import User from '../models/User';
import jwt from 'jsonwebtoken';
import { promisify } from 'util';

const signToken = id => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });
};

export const register = async (req, res, next) => {
    try {
        const { name, email, password, phone, affiliation, role } = req.body;

        const newUser  = await User.create({
            name,
            email,
            password,
            phone,
            affiliation,
            role: role || 'guest'
        });

        const token = signToken(newUser ._id);

        res.status(201).json({
            status: 'success',
            token,
            data: { user: newUser  }
        });
    } catch (err) {
        next(err);
    }
};

export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return next(new Error('Please provide email and password'));
        }

        const user = await User.findOne({ email }).select('+password');

        if (!user || !(await user.comparePassword(password))) {
            return next(new Error('Incorrect email or password'));
        }

        const token = signToken(user._id);

        res.status(200).json({
            status: 'success',
            token,
            data: { user }
        });
    } catch (err) {
        next(err);
    }
};

export const protect = async (req, res, next) => {
    try {
        let token;
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        } else if (req.cookies.jwt) {
            token = req.cookies.jwt;
        }

        if (!token) {
            return next(new Error('You are not logged in! Please log in to get access.'));
        }

        const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
        const currentUser  = await User.findById(decoded.id);
        if (!currentUser ) {
            return next(new Error('The user belonging to this token does no longer exist.'));
        }

        req.user = currentUser ;
        next();
    } catch (err) {
        next(err);
    }
};

export const restrictTo = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(new Error('You do not have permission to perform this action'));
        }
        next();
    };
};
