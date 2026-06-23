"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProject = exports.updateProject = exports.createProject = exports.getProjectById = exports.getProjects = exports.getDashboardMetrics = void 0;
const prisma_1 = __importDefault(require("../utils/prisma"));
// Get dashboard metrics (optimized single query)
const getDashboardMetrics = async (req, res) => {
    try {
        const userId = req.user.id;
        // Run queries in parallel for speed
        const [projectStats, taskStats] = await Promise.all([
            prisma_1.default.project.groupBy({
                by: ['status'],
                where: { userId },
                _count: true,
            }),
            prisma_1.default.task.groupBy({
                by: ['status'],
                where: { project: { userId } },
                _count: true,
            }),
        ]);
        // Calculate metrics
        const totalProjects = projectStats.reduce((sum, stat) => sum + stat._count, 0);
        const projectsInProgress = projectStats.find(s => s.status === 'IN_PROGRESS')?._count || 0;
        const totalTasks = taskStats.reduce((sum, stat) => sum + stat._count, 0);
        const completedTasks = taskStats.find(s => s.status === 'COMPLETED')?._count || 0;
        const pendingTasks = taskStats.find(s => s.status === 'PENDING')?._count || 0;
        res.setHeader('Cache-Control', 'private, max-age=5');
        res.json({
            totalProjects,
            projectsInProgress,
            totalTasks,
            completedTasks,
            pendingTasks,
        });
    }
    catch (error) {
        console.error('Error in getDashboardMetrics:', error);
        res.status(500).json({ error: 'Failed to fetch dashboard metrics' });
    }
};
exports.getDashboardMetrics = getDashboardMetrics;
const getProjects = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const sortBy = req.query.sortBy || 'createdAt';
        const order = req.query.order === 'asc' ? 'asc' : 'desc';
        const projects = await prisma_1.default.project.findMany({
            where: { userId: req.user.id },
            orderBy: { [sortBy]: order },
            skip,
            take: limit,
        });
        const totalCount = await prisma_1.default.project.count({
            where: { userId: req.user.id },
        });
        res.setHeader('Cache-Control', 'private, max-age=5');
        res.json({
            data: projects,
            meta: {
                total: totalCount,
                page,
                limit,
                totalPages: Math.ceil(totalCount / limit)
            }
        });
    }
    catch (error) {
        console.error('Error in getProjects:', error);
        res.status(500).json({ error: 'Failed to fetch projects' });
    }
};
exports.getProjects = getProjects;
const getProjectById = async (req, res) => {
    try {
        const project = await prisma_1.default.project.findFirst({
            where: { id: req.params.id, userId: req.user.id },
            include: { tasks: true },
        });
        if (!project) {
            res.status(404).json({ error: 'Project not found' });
            return;
        }
        res.setHeader('Cache-Control', 'private, max-age=5');
        res.json(project);
    }
    catch (error) {
        console.error('Error in getProjectById:', error);
        res.status(500).json({ error: 'Failed to fetch project' });
    }
};
exports.getProjectById = getProjectById;
const createProject = async (req, res) => {
    try {
        const { name, description, status, startDate, endDate } = req.body;
        const project = await prisma_1.default.project.create({
            data: {
                name,
                description,
                status,
                startDate: startDate ? new Date(startDate) : null,
                endDate: endDate ? new Date(endDate) : null,
                userId: req.user.id,
            },
        });
        await prisma_1.default.auditLog.create({
            data: {
                userId: req.user.id,
                action: 'PROJECT_CREATED',
                details: `Project "${project.name}" was created.`,
            }
        });
        res.status(201).json(project);
    }
    catch (error) {
        console.error('Error in createProject:', error);
        res.status(500).json({ error: 'Failed to create project' });
    }
};
exports.createProject = createProject;
const updateProject = async (req, res) => {
    try {
        const { name, description, status, startDate, endDate } = req.body;
        const existingProject = await prisma_1.default.project.findFirst({
            where: { id: req.params.id, userId: req.user.id },
        });
        if (!existingProject) {
            res.status(404).json({ error: 'Project not found' });
            return;
        }
        const project = await prisma_1.default.project.update({
            where: { id: req.params.id },
            data: {
                name,
                description,
                status,
                startDate: startDate ? new Date(startDate) : null,
                endDate: endDate ? new Date(endDate) : null,
            },
        });
        await prisma_1.default.auditLog.create({
            data: {
                userId: req.user.id,
                action: 'PROJECT_UPDATED',
                details: `Project "${project.name}" was updated.`,
            }
        });
        res.json(project);
    }
    catch (error) {
        console.error('Error in updateProject:', error);
        res.status(500).json({ error: 'Failed to update project' });
    }
};
exports.updateProject = updateProject;
const deleteProject = async (req, res) => {
    try {
        const existingProject = await prisma_1.default.project.findFirst({
            where: { id: req.params.id, userId: req.user.id },
        });
        if (!existingProject) {
            res.status(404).json({ error: 'Project not found' });
            return;
        }
        await prisma_1.default.project.delete({
            where: { id: req.params.id },
        });
        await prisma_1.default.auditLog.create({
            data: {
                userId: req.user.id,
                action: 'PROJECT_DELETED',
                details: `Project "${existingProject.name}" was deleted.`,
            }
        });
        res.json({ message: 'Project removed' });
    }
    catch (error) {
        console.error('Error in deleteProject:', error);
        res.status(500).json({ error: 'Failed to delete project' });
    }
};
exports.deleteProject = deleteProject;
