const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    read: {
        type: Boolean,
        default: false
    },
    type: {
        type: String, // 'task_assigned', 'record_added', etc.
        required: true
    },
    link: {
        type: String, // route to send user when clicked
        required: false
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: '30d' // auto-delete after 30 days
    }
});

module.exports = mongoose.model('Notification', NotificationSchema);
