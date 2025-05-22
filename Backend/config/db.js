// Backend/config/db.js
/*import dotenv from 'dotenv';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env vars
dotenv.config({ path: path.resolve(__dirname, '../..', '.env') });

const mongoUri = process.env.MONGO_URI; 
console.log('MONGO_URI:', mongoUri);  

const connectDB = async () => {
    try {
        await mongoose.connect(mongoUri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Successfully connected to MongoDB');
    } catch (error) {
        console.log(`Error: ${error.message}`);
        process.exit(1);
    }
};

export default connectDB;*/

// Backend/config/db.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables from .env file for local development
dotenv.config();

const mongoUri = process.env.MONGO_URI; 
console.log('MONGO_URI:', mongoUri);  

const connectDB = async () => {
    try {
        await mongoose.connect(mongoUri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Successfully connected to MongoDB');
    } catch (error) {
        console.log(`Error: ${error.message}`);
        process.exit(1);
    }
};

export default connectDB;


