import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User ', required: true },
    event: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
    session: { type: mongoose.Schema.Types.ObjectId, ref: 'Session', required: true },
    seatNumber: { type: String, required: true },
    price: { type: Number, required: true },
    paymentMethod: {
        type: String,
        enum: ['mobile_money', 'credit_card', 'bank_transfer'],
        required: true
    },
    isPaid: { type: Boolean, default: false },
    paymentDate: { type: Date },
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Booking', bookingSchema);
