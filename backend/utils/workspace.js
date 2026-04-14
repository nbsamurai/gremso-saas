const User = require('../models/User');
const Workspace = require('../models/Workspace');
const Project = require('../models/Project');
const Task = require('../models/Task');
const Document = require('../models/Document');
const TeamMember = require('../models/TeamMember');
const Activity = require('../models/Activity');

const isWorkspaceOwnerRole = (role) => ['Admin', 'Manager', 'manager'].includes(role);

const buildWorkspaceName = (name) => `${name}'s Workspace`;

const ensureUserDocument = async (userOrId) => {
    if (!userOrId) {
        return null;
    }

    if (typeof userOrId === 'string') {
        return User.findById(userOrId);
    }

    if (typeof userOrId.save === 'function') {
        return userOrId;
    }

    if (userOrId._id) {
        const hydratedUser = await User.findById(userOrId._id);
        if (hydratedUser) {
            console.log('[workspace] Rehydrated plain user object into Mongoose document', {
                userId: userOrId._id.toString()
            });
        }
        return hydratedUser;
    }

    return null;
};

const createWorkspaceForUser = async (user) => {
    const userDocument = await ensureUserDocument(user);
    if (!userDocument) {
        throw new Error('User not found while creating workspace');
    }

    const workspace = await Workspace.create({
        name: buildWorkspaceName(userDocument.name),
        owner: userDocument._id,
        members: [userDocument._id]
    });

    userDocument.workspaceId = workspace._id;
    userDocument.teamId = workspace._id;
    await userDocument.save();

    return workspace;
};

const syncWorkspaceData = async (ownerId, workspaceId) => {
    const missingWorkspaceFilter = [
        {
            $or: [
                { workspaceId: { $exists: false } },
                { workspaceId: null }
            ]
        }
    ];

    await Promise.all([
        User.updateMany(
            {
                $and: [
                    ...missingWorkspaceFilter,
                    {
                        $or: [
                            { _id: ownerId },
                            { managerId: ownerId }
                        ]
                    }
                ]
            },
            { $set: { workspaceId, teamId: workspaceId } }
        ),
        TeamMember.updateMany(
            {
                $and: [
                    ...missingWorkspaceFilter,
                    { managerId: ownerId }
                ]
            },
            { $set: { workspaceId, teamId: workspaceId } }
        ),
        Project.updateMany(
            {
                $and: [
                    ...missingWorkspaceFilter,
                    { managerId: ownerId }
                ]
            },
            { $set: { workspaceId } }
        ),
        Task.updateMany(
            {
                $and: [
                    ...missingWorkspaceFilter,
                    { managerId: ownerId }
                ]
            },
            { $set: { workspaceId } }
        ),
        Document.updateMany(
            {
                $and: [
                    ...missingWorkspaceFilter,
                    { managerId: ownerId }
                ]
            },
            { $set: { workspaceId } }
        ),
        Activity.updateMany(
            {
                $and: [
                    ...missingWorkspaceFilter,
                    { managerId: ownerId }
                ]
            },
            { $set: { workspaceId } }
        )
    ]);
};

const ensureWorkspaceForOwner = async (user) => {
    user = await ensureUserDocument(user);
    if (!user) {
        const error = new Error('User not found');
        error.statusCode = 404;
        throw error;
    }

    let workspace = user.workspaceId ? await Workspace.findById(user.workspaceId) : null;

    if (!workspace) {
        workspace = await Workspace.findOne({ owner: user._id });
    }

    if (!workspace) {
        workspace = await createWorkspaceForUser(user);
    } else if (!user.workspaceId || user.workspaceId.toString() !== workspace._id.toString()) {
        user.workspaceId = workspace._id;
        user.teamId = workspace._id;
        await user.save();
    } else if (!user.teamId || user.teamId.toString() !== workspace._id.toString()) {
        user.teamId = workspace._id;
        await user.save();
    }

    await Workspace.findByIdAndUpdate(workspace._id, { $addToSet: { members: user._id } });
    await syncWorkspaceData(user._id, workspace._id);

    return user;
};

const ensureWorkspaceForUser = async (user) => {
    user = await ensureUserDocument(user);
    if (!user) {
        return null;
    }

    if (user.workspaceId) {
        return user;
    }

    if (isWorkspaceOwnerRole(user.role) || !user.managerId) {
        return ensureWorkspaceForOwner(user);
    }

    const manager = await User.findById(user.managerId);
    if (!manager) {
        return user;
    }

    const ensuredManager = await ensureWorkspaceForOwner(manager);
    if (ensuredManager.workspaceId) {
        user.workspaceId = ensuredManager.workspaceId;
        user.teamId = ensuredManager.workspaceId;
        await user.save();
        await Workspace.findByIdAndUpdate(ensuredManager.workspaceId, { $addToSet: { members: user._id } });
    }

    return user;
};

module.exports = {
    buildWorkspaceName,
    createWorkspaceForUser,
    ensureWorkspaceForUser,
    isWorkspaceOwnerRole
};
