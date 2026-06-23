"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTask = exports.updateTask = exports.createTask = exports.getTaskById = exports.getTasks = exports.getTasksByProject = void 0;
const prisma_1 = __importDefault(require("../utils/prisma"));
// Get tasks for a specific project (OPTIMIZED)
const getTasksByProject = async (req, res) => {
    try {
        const projectId = req.params.projectId;
        // Verify project belongs to user
        const project = await prisma_1.default.project.findFirst({
            where: { id: projectId, userId: req.user.id },
            select: { id: true }, // Only select ID for verification
        });
        if (!project) {
            res.status(404).json({ error: 'Project not found' });
            return;
        }
        // Get only tasks for this specific project
        const tasks = await prisma_1.default.task.findMany({
            where: { projectId },
            orderBy: { createdAt: 'desc' },
        });
        res.setHeader('Cache-Control', 'private, max-age=5');
        res.json(tasks);
    }
    catch (error) {
        console.error('Error in getTasksByProject:', error);
        res.status(500).json({ error: 'Failed to fetch tasks' });
    }
};
exports.getTasksByProject = getTasksByProject;
const getTasks = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const sortBy = req.query.sortBy || 'createdAt';
        const order = req.query.order === 'asc' ? 'asc' : 'desc';
        const tasks = await prisma_1.default.task.findMany({
            where: {
                project: {
                    userId: req.user.id,
                },
            },
            orderBy: { [sortBy]: order },
            skip,
            take: limit,
            include: { project: { select: { name: true } } },
        });
        const totalCount = await prisma_1.default.task.count({
            where: {
                project: {
                    userId: req.user.id,
                },
            },
        });
        res.setHeader('Cache-Control', 'private, max-age=5');
        res.json({
            data: tasks,
            meta: {
                total: totalCount,
                page,
                limit,
                totalPages: Math.ceil(totalCount / limit)
            }
        });
    }
    catch (error) {
        console.error('Error in getTasks:', error);
        res.status(500).json({ error: 'Failed to fetch tasks' });
    }
};
exports.getTasks = getTasks;
const getTaskById = async (req, res) => {
    try {
        const task = await prisma_1.default.task.findFirst({
            where: {
                id: req.params.id,
                project: {
                    userId: req.user.id,
                },
            },
        });
        if (!task) {
            res.status(404).json({ error: 'Task not found' });
            return;
        }
        res.setHeader('Cache-Control', 'private, max-age=5');
        res.json(task);
    }
    catch (error) {
        console.error('Error in getTaskById:', error);
        res.status(500).json({ error: 'Failed to fetch task' });
    }
};
exports.getTaskById = getTaskById;
const createTask = async (req, res) => {
    try {
        const { name, description, priority, status, dueDate, projectId } = req.body;
        // Verify project belongs to user
        const project = await prisma_1.default.project.findFirst({
            where: { id: projectId, userId: req.user.id },
        });
        if (!project) {
            res.status(404).json({ error: 'Project not found' });
            return;
        }
        const task = await prisma_1.default.task.create({
            data: {
                name,
                description,
                priority,
                status,
                dueDate: dueDate ? new Date(dueDate) : null,
                projectId,
            },
        });
        await prisma_1.default.auditLog.create({
            data: {
                userId: req.user.id,
                action: 'TASK_CREATED',
                details: `Task "${task.name}" was created in project "${project.name}".`,
            }
        });
        res.status(201).json(task);
    }
    catch (error) {
        console.error('Error in createTask:', error);
        res.status(500).json({ error: 'Failed to create task' });
    }
};
exports.createTask = createTask;
const updateTask = async (req, res) => {
    try {
        const { name, description, priority, status, dueDate } = req.body;
        const existingTask = await prisma_1.default.task.findFirst({
            where: {
                id: req.params.id,
                project: {
                    userId: req.user.id,
                },
            },
        });
        if (!existingTask) {
            res.status(404).json({ error: 'Task not found' });
            return;
        }
        const task = await prisma_1.default.task.update({
            where: { id: req.params.id },
            data: {
                name,
                description,
                priority,
                status,
                dueDate: dueDate ? new Date(dueDate) : null,
            },
        });
        await prisma_1.default.auditLog.create({
            data: {
                userId: req.user.id,
                action: 'TASK_UPDATED',
                details: `Task "${task.name}" was updated.`,
            }
        });
        res.json(task);
    }
    catch (error) {
        console.error('Error in updateTask:', error);
        res.status(500).json({ error: 'Failed to update task' });
    }
};
exports.updateTask = updateTask;
const deleteTask = async (req, res) => {
    try {
        const existingTask = await prisma_1.default.task.findFirst({
            where: {
                id: req.params.id,
                project: {
                    userId: req.user.id,
                },
            },
        });
        if (!existingTask) {
            res.status(404).json({ error: 'Task not found' });
            return;
        }
        await prisma_1.default.task.delete({
            where: { id: req.params.id },
        });
        await prisma_1.default.auditLog.create({
            data: {
                userId: req.user.id,
                action: 'TASK_DELETED',
                details: `Task "${existingTask.name}" was deleted.`,
            }
        });
        res.json({ message: 'Task removed' });
    }
    catch (error) {
        console.error('Error in deleteTask:', error);
        res.status(500).json({ error: 'Failed to delete task' });
    }
};
exports.deleteTask = deleteTask;
