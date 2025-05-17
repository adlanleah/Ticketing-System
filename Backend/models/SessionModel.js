import mongoose from 'mongoose';

const sessionSchema = new mongoose.Schema({
    name: { type: String, required: true },
    timeSlot: { type: String, required: true }, 
    type: { type: String, enum: ['morning', 'afternoon', 'evening'], required: true },
    event: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
    date: { type: Date, required: true },
    maxCapacity: { type: Number, required: true },
    availableSeats: { type: Number, required: true },
    seatMap: [{
        id: { type: String, required: true },
        section: { type: String, required: true },
        row: { type: String, required: true },
        number: { type: Number, required: true },
        price: { type: Number, required: true }
    }],
    isActive: { type: Boolean, default: true }
});

// Update available seats when bookings are made
sessionSchema.methods.updateAvailability = async function() {
    const bookingCount = await mongoose.model('Booking').countDocuments({ session: this._id });
    this.availableSeats = this.maxCapacity - bookingCount;
    await this.save();
};

export default mongoose.model('Session', sessionSchema);
