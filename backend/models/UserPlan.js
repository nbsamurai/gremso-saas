const mongoose = require('mongoose');

const UserPlanSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            unique: true
        },
        planName: {
            type: String,
            enum: ['starter', 'professional', 'premium_plus'],
            required: true
        },
        planStatus: {
            type: String,
            enum: ['active'],
            default: 'active'
        },
        billingCycle: {
            type: String,
            enum: ['monthly', 'yearly'],
            default: 'monthly'
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model('UserPlan', UserPlanSchema);
