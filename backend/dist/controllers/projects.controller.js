"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProject = exports.updateProject = exports.createProject = exports.getProjectById = exports.getProjects = void 0;
const prisma_1 = __importDefault(require("../utils/prisma"));
const getProjects = async (req, res) => {
    try {
        const projects = await prisma_1.default.project.findMany({
            where: { userId: req.user.id },
            orderBy: { createdAt: 'desc' },
        });
        res.setHeader('Cache-Control', 'private, max-age=10');
        res.json(projects);
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
        res.json({ message: 'Project removed' });
    }
    catch (error) {
        console.error('Error in deleteProject:', error);
        res.status(500).json({ error: 'Failed to delete project' });
    }
};
exports.deleteProject = deleteProject;
