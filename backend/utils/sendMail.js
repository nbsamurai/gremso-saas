const { Resend } = require('resend');

let resendClient;

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const DEFAULT_FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'no-reply@gremso.com';
const DEFAULT_FROM = `Gremso <${DEFAULT_FROM_EMAIL}>`;

const getApiKey = () => process.env.RESEND_API_KEY;

const normalizeRecipients = (to) => {
    const rawRecipients = Array.isArray(to)
        ? to
        : typeof to === 'string'
            ? to.split(',')
            : [];

    const recipients = [...new Set(rawRecipients.map((email) => email?.trim().toLowerCase()).filter(Boolean))];
    const invalidRecipients = recipients.filter((email) => !EMAIL_REGEX.test(email));

    if (invalidRecipients.length > 0) {
        throw new Error(`Invalid email recipient(s): ${invalidRecipients.join(', ')}`);
    }

    return recipients;
};

const isMailConfigured = () => Boolean(getApiKey());

const getResendClient = () => {
    if (!resendClient) {
        const apiKey = getApiKey();
        if (!apiKey) {
            throw new Error('RESEND_API_KEY must be configured for Resend email delivery');
        }

        resendClient = new Resend(apiKey);
    }

    return resendClient;
};

const sendMail = async ({ to, subject, html, text, from = DEFAULT_FROM }) => {
    const recipients = normalizeRecipients(to);

    if (recipients.length === 0) {
        throw new Error('No email recipients supplied');
    }

    if (!isMailConfigured()) {
        throw new Error('RESEND_API_KEY is not configured');
    }

    try {
        console.log('[Mail] Sending email with Resend:', {
            from,
            to: recipients,
            subject
        });
        const { data, error } = await getResendClient().emails.send({
            from,
            to: recipients,
            subject,
            text,
            html
        });

        if (error) {
            throw new Error(error.message || 'Resend failed to send email');
        }

        console.log('[Mail] Email sent successfully with Resend:', data?.id);
        return { sent: true, messageId: data?.id };
    } catch (error) {
        console.error('[Mail] Failed to send email:', error?.message || error);
        throw error;
    }
};

module.exports = {
    DEFAULT_FROM,
    DEFAULT_FROM_EMAIL,
    sendMail,
    isMailConfigured
};
