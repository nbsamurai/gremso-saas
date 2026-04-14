const mongoose = require('mongoose');

const connectDB = () => {
    if (!process.env.MONGODB_URI) {
        console.error('MongoDB URI is not defined in environment variables.');
        process.exit(1);
    }

    return mongoose
        .connect(process.env.MONGODB_URI)
        .then(() => {
            console.log('MongoDB connected successfully');
            console.log('------------------------------');
        })
        .catch((error) => {
            console.error('MongoDB connection error:', error);
            process.exit(1);
        });
};

module.exports = connectDB;
