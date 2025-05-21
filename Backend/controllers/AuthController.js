import User from '../models/userModel.js';
import jwt from 'jsonwebtoken';
import ErrorResponse from '../utils/ErrorResponse.js';
import { promisify } from 'util';

const signToken = id => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '1h' 
    });
};

export const register = async (req, res, next) => {
    try {
        const { name, email, password, phone, affiliation, role } = req.body;
        
    const existingUser  = await User.findOne({ name });
           if (existingUser ) {
               return next(new ErrorResponse('A user with this name already exists', 400));
           }

        const newUser  = await User.create({
            name,
            email,
            password,
            phone,
            affiliation,
            role: role || 'guest'
        });

        // Generate special token for organizers and admins
        if (newUser .role === 'organizer' || newUser .role === 'admin') {
            newUser .generateSpecialToken();
            await newUser .save();
        }

        const token = signToken(newUser ._id);

        res.status(201).json({
            status: 'success',
            token,
            specialToken: newUser .specialToken,
            data: { user: newUser  }
        });
    } catch (err) {
        return next(new ErrorResponse(err.message, 400));
    }
};

   export const login = async (req, res, next) => {
       try {
           const { email, password } = req.body; // Only extract email and password

           // Check if email and password are provided
           if (!email || !password) {
               return next(new ErrorResponse('Please provide email and password', 400));
           }

           // Find user by email
           const user = await User.findOne({ email }).select('+password');

           if (!user || !(await user.matchPassword(password))) {
               return next(new ErrorResponse('Incorrect email or password', 400));
           }

           const token = signToken(user._id);

           res.status(200).json({
               status: 'success',
               token,
               specialToken: user.specialToken,
               data: { user }
           });
       } catch (err) {
           return next(new ErrorResponse(err.message, 400));
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
            return next(new ErrorResponse('You are not logged in! Please log in to get access.'));
        }

        const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
        const currentUser  = await User.findById(decoded.id);
        if (!currentUser ) {
            return next(new ErrorResponse('The user belonging to this token does no longer exist.'));
        }

        req.user = currentUser ;
        next();
    } catch (err) {
        return next(new ErrorResponse('Invalid token. Please log in again.', 401)); 
    }
};

export const restrictTo = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(new ErrorResponse('You do not have permission to perform this action', 403));
        }
        next();
    };
};
