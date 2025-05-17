import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    eventType: {
        type: String,
        enum: ['exhibition', 'workshop', 'keynote'],
        required: true
    },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    venue: { type: String, required: true },
    maxCapacity: { type: Number, required: true },
    organizer: { type: mongoose.Schema.Types.ObjectId, ref: 'User ' },
    isActive: { type: Boolean, default: true }
});

export default mongoose.model('Event', eventSchema);
