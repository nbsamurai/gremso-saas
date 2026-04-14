const mongoose = require('mongoose');

const MeetingSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, 'Meeting title is required'],
            trim: true
        },
        description: {
            type: String,
            trim: true,
            default: ''
        },
        date: {
            type: Date,
            required: [true, 'Meeting date is required']
        },
        time: {
            type: String,
            required: [true, 'Meeting time is required'],
            trim: true
        },
        meetingLink: {
            type: String,
            required: [true, 'Meeting link is required'],
            trim: true
        },
        teamMembers: {
            type: [String],
            default: []
        },
        createdBy: {
            type: String,
            default: ''
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('Meeting', MeetingSchema);
