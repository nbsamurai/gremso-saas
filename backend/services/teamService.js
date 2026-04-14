const User = require('../models/User');
const Workspace = require('../models/Workspace');
const { ensureWorkspaceForUser, isWorkspaceOwnerRole } = require('../utils/workspace');

const getNormalizedRole = (role = '') => role.toString().trim().toLowerCase();

const isManagerRole = (role = '') => ['manager', 'admin'].includes(getNormalizedRole(role));

const getTeamForUser = async (userOrId) => {
    let user = userOrId;

    if (typeof userOrId === 'string') {
        user = await User.findById(userOrId);
    }

    if (!user) {
        const error = new Error('User not found');
        error.statusCode = 404;
        throw error;
    }

    user = await ensureWorkspaceForUser(user);
    const teamId = user.teamId || user.workspaceId;
    const team = teamId ? await Workspace.findById(teamId) : null;

    if (!team) {
        const error = new Error('Team not found');
        error.statusCode = 404;
        throw error;
    }

    const isTeamManager = isManagerRole(user.role) && team.owner.toString() === user._id.toString();

    return {
        user,
        team,
        isTeamManager
    };
};

const addUserToTeam = async (teamId, userId) => {
    await Workspace.findByIdAndUpdate(teamId, { $addToSet: { members: userId } });
};

module.exports = {
    getNormalizedRole,
    isManagerRole,
    getTeamForUser,
    addUserToTeam
};
