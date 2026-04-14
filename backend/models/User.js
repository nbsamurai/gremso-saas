const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide a name'],
        trim: true,
        match: [/^[a-zA-Z\s]+$/, 'Name should only contain letters and spaces']
    },
    email: {
        type: String,
        required: [true, 'Please provide an email'],
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, 'Please provide a valid email']
    },
    password: {
        type: String, // Temporarily stored for legacy purposes or Manager invites
        required: false
    },
    firebaseUid: {
        type: String,
        required: false
    },
    role: {
        type: String,
        enum: ['Admin', 'Manager', 'Supervisor', 'Worker', 'manager', 'member'],
        default: 'manager'
    },
    managerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    workspaceId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Workspace',
        required: false
    },
    teamId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Workspace',
        required: false
    },
    phone: {
        type: String,
        trim: true
    },
    requiresApproval: {
        type: Boolean,
        default: false
    },
    approvalStatus: {
        type: String,
        enum: ['not_submitted', 'pending', 'approved', 'rejected'],
        default: 'approved'
    },
    approvalRequestedAt: {
        type: Date,
        default: null
    },
    approvalReviewedAt: {
        type: Date,
        default: null
    },
    approvalReviewedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
    requestedPlanName: {
        type: String,
        enum: ['starter', 'professional', 'premium_plus'],
        default: null
    },
    requestedBillingCycle: {
        type: String,
        enum: ['monthly', 'yearly'],
        default: 'monthly'
    },
    requestedComment: {
        type: String,
        trim: true,
        default: ''
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    verificationToken: {
        type: String,
        required: false
    },
    status: {
        type: String,
        enum: ['invited', 'active'],
        default: 'active'
    },
    planName: {
        type: String,
        enum: ['starter', 'professional', 'premium_plus'],
        default: null
    },
    billingCycle: {
        type: String,
        enum: ['monthly', 'yearly'],
        default: 'monthly'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('User', UserSchema);
