const express = require('express');
const router = express.Router();
const { DEFAULT_FROM, sendMail } = require('../utils/sendMail');

router.post('/send-mail', async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ message: 'Email is required' });
    }

    try {
        console.log('[Mail API] Sending test email to:', email);
        const result = await sendMail({
            to: email,
            from: DEFAULT_FROM,
            subject: 'Test Mail \u{1F680}',
            html: '<h2>Email working from Render + Vercel \u{1F525}</h2>'
        });

        console.log('[Mail API] Test email sent successfully:', result.messageId);
        res.json({
            message: 'Email sent successfully',
            messageId: result.messageId
        });
    } catch (error) {
        console.error('[Mail API] Failed to send test email:', error?.message || error);
        res.status(500).json({
            message: 'Failed to send email',
            error: error?.message || 'Unknown mail error'
        });
    }
});

module.exports = router;
