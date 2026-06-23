"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTask = exports.updateTask = exports.createTask = exports.getTaskById = exports.getTasks = void 0;
const prisma_1 = __importDefault(require("../utils/prisma"));
const getTasks = async (req, res) => {
    try {
        const tasks = await prisma_1.default.task.findMany({
            where: {
                project: {
                    userId: req.user.id,
                },
            },
            orderBy: { createdAt: 'desc' },
            include: { project: { select: { name: true } } },
        });
        res.setHeader('Cache-Control', 'private, max-age=10');
        res.json(tasks);
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
        res.json({ message: 'Task removed' });
    }
    catch (error) {
        console.error('Error in deleteTask:', error);
        res.status(500).json({ error: 'Failed to delete task' });
    }
};
exports.deleteTask = deleteTask;
