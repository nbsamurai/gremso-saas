const mongoose = require('mongoose');

const TeamInviteSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            trim: true,
            lowercase: true
        },
        token: {
            type: String,
            required: true,
            unique: true
        },
        teamId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Workspace',
            required: true
        },
        managerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        status: {
            type: String,
            enum: ['pending', 'accepted', 'expired', 'revoked'],
            default: 'pending'
        },
        expiresAt: {
            type: Date,
            required: true
        },
        acceptedAt: {
            type: Date,
            default: null
        },
        acceptedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            default: null
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model('TeamInvite', TeamInviteSchema);
