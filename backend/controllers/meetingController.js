const Meeting = require('../models/Meeting');
const { sendMail } = require('../utils/sendMail');

const normalizeEmail = (email = '') => email.trim().toLowerCase();
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const sortMeetings = (query) => query.sort({ date: 1, time: 1, createdAt: -1 });

const parseTeamMembers = (teamMembers) => {
    if (Array.isArray(teamMembers)) {
        return teamMembers;
    }

    if (typeof teamMembers === 'string') {
        return teamMembers.split(',');
    }

    return [];
};

const buildMeetingEmail = (meeting) => {
    const dateText = new Date(meeting.date).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    return {
        subject: `Meeting Scheduled: ${meeting.title}`,
        text: [
            `Title: ${meeting.title}`,
            `Date: ${dateText}`,
            `Time: ${meeting.time}`,
            `Meeting Link: ${meeting.meetingLink}`,
            meeting.description ? `Description: ${meeting.description}` : ''
        ]
            .filter(Boolean)
            .join('\n'),
        html: `
            <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #1f2937;">
                <h2 style="margin-bottom: 12px;">${meeting.title}</h2>
                <p><strong>Date:</strong> ${dateText}</p>
                <p><strong>Time:</strong> ${meeting.time}</p>
                ${meeting.description ? `<p><strong>Description:</strong> ${meeting.description}</p>` : ''}
                <p style="margin-top: 20px;">
                    <a href="${meeting.meetingLink}" target="_blank" rel="noopener noreferrer" style="display: inline-block; padding: 10px 16px; background: #2563eb; color: #ffffff; text-decoration: none; border-radius: 8px;">
                        Join Meeting
                    </a>
                </p>
                <p style="margin-top: 12px;">If the button does not work, use this link:</p>
                <p><a href="${meeting.meetingLink}" target="_blank" rel="noopener noreferrer">${meeting.meetingLink}</a></p>
            </div>
        `
    };
};

exports.createMeeting = async (req, res) => {
    try {
        const { title, description, date, time, meetingLink, teamMembers } = req.body;

        if (!title || !date || !time || !meetingLink) {
            return res.status(400).json({ success: false, message: 'Title, date, time, and meeting link are required' });
        }

        const creatorEmail = normalizeEmail(req.user.email);
        const recipientList = parseTeamMembers(teamMembers);
        const normalizedTeamMembers = [...new Set(recipientList.map(normalizeEmail).filter(Boolean))];
        const invalidEmails = normalizedTeamMembers.filter((email) => !EMAIL_REGEX.test(email));

        if (invalidEmails.length > 0) {
            return res.status(400).json({
                success: false,
                message: `Invalid team member email(s): ${invalidEmails.join(', ')}`
            });
        }

        const meeting = await Meeting.create({
            title: title.trim(),
            description: description?.trim() || '',
            date,
            time: time.trim(),
            meetingLink: meetingLink.trim(),
            teamMembers: normalizedTeamMembers,
            createdBy: creatorEmail
        });

        const mailRecipients = [...new Set([...normalizedTeamMembers, creatorEmail])];
        const emailContent = buildMeetingEmail(meeting);

        let mailResult = { sent: false, skipped: false, reason: '' };
        try {
            mailResult = await sendMail({
                to: mailRecipients,
                subject: emailContent.subject,
                text: emailContent.text,
                html: emailContent.html
            });
        } catch (mailError) {
            console.error('Meeting email error:', mailError);
            mailResult = {
                sent: false,
                skipped: false,
                reason: mailError.message || 'Failed to send emails'
            };
        }

        res.status(201).json({
            success: true,
            meeting,
            emailStatus: mailResult,
            message: mailResult.sent
                ? 'Meeting created and email invitations sent'
                : 'Meeting created, but email invitations could not be sent'
        });
    } catch (error) {
        console.error('Create meeting error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

exports.getMeetings = async (req, res) => {
    try {
        const email = normalizeEmail(req.user.email);
        const meetings = await sortMeetings(Meeting.find({
            $or: [
                { createdBy: email },
                { teamMembers: email }
            ]
        }));

        res.json({ success: true, meetings });
    } catch (error) {
        console.error('Fetch meetings error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

exports.getMeetingsForUser = async (req, res) => {
    try {
        const requestedEmail = normalizeEmail(req.params.email);
        const currentUserEmail = normalizeEmail(req.user.email);
        const isWorkspaceOwner = req.user.role === 'Admin' || req.user.role === 'Manager' || req.user.role === 'manager';

        if (!requestedEmail) {
            return res.status(400).json({ success: false, message: 'Email is required' });
        }

        if (!isWorkspaceOwner && requestedEmail !== currentUserEmail) {
            return res.status(403).json({ success: false, message: 'Not authorized to view these meetings' });
        }

        const meetings = await sortMeetings(Meeting.find({
            $or: [
                { createdBy: requestedEmail },
                { teamMembers: requestedEmail }
            ]
        }));

        res.json({ success: true, meetings });
    } catch (error) {
        console.error('Fetch user meetings error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

exports.deleteMeeting = async (req, res) => {
    try {
        const meeting = await Meeting.findByIdAndDelete(req.params.id);

        if (!meeting) {
            return res.status(404).json({ message: 'Meeting not found' });
        }

        res.json({ message: 'Meeting deleted successfully' });
    } catch (error) {
        console.error('Delete meeting error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
