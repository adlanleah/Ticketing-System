import mongoose from 'mongoose';

const ticketSchema = new mongoose.Schema({
    booking: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', required: true },
    ticketNumber: { type: String, required: true, unique: true },
    qrCode: { type: String, required: true },
    isCheckedIn: { type: Boolean, default: false },
    checkedInAt: { type: Date },
    checkedInBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User ' }
}, { timestamps: true });

// Generate ticket number before saving
ticketSchema.pre('save', async function(next) {
    if (!this.ticketNumber) {
        const count = await mongoose.model('Ticket').countDocuments();
        this.ticketNumber = `VU-${(count + 1).toString().padStart(6, '0')}`;
    }
    next();
});

export default mongoose.model('Ticket', ticketSchema);
