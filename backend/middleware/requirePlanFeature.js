const { validatePlanFeatureAccess } = require('../services/planValidationService');

module.exports = (featureKey) => async (req, res, next) => {
    try {
        await validatePlanFeatureAccess(req.user.id, featureKey);
        next();
    } catch (err) {
        res.status(err.statusCode || 403).json({
            success: false,
            message: err.message,
            code: err.code,
            plan: err.snapshot || null
        });
    }
};
