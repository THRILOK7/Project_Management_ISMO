import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import prisma from '../utils/prisma';

// Get dashboard metrics (optimized single query)
export const getDashboardMetrics = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;

    // Run queries in parallel for speed
    const [projectStats, taskStats] = await Promise.all([
      prisma.project.groupBy({
        by: ['status'],
        where: { userId },
        _count: true,
      }),
      prisma.task.groupBy({
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
  } catch (error: any) {
    console.error('Error in getDashboardMetrics:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard metrics' });
  }
};

export const getProjects = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;
    
    const sortBy = (req.query.sortBy as string) || 'createdAt';
    const order = (req.query.order as string) === 'asc' ? 'asc' : 'desc';

    const projects = await prisma.project.findMany({
      where: { userId: req.user!.id },
      orderBy: { [sortBy]: order },
      skip,
      take: limit,
    });
    
    const totalCount = await prisma.project.count({
      where: { userId: req.user!.id },
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
  } catch (error: any) {
    console.error('Error in getProjects:', error);
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
};

export const getProjectById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const project = await prisma.project.findFirst({
      where: { id: req.params.id as string, userId: req.user!.id },
      include: { tasks: true },
    });

    if (!project) {
      res.status(404).json({ error: 'Project not found' });
      return;
    }

    res.setHeader('Cache-Control', 'private, max-age=5');
    res.json(project);
  } catch (error: any) {
    console.error('Error in getProjectById:', error);
    res.status(500).json({ error: 'Failed to fetch project' });
  }
};

export const createProject = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { name, description, status, startDate, endDate } = req.body;

    const project = await prisma.project.create({
      data: {
        name,
        description,
        status,
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
        userId: req.user!.id,
      },
    });

    await prisma.auditLog.create({
      data: {
        userId: req.user!.id,
        action: 'PROJECT_CREATED',
        details: `Project "${project.name}" was created.`,
      }
    });

    res.status(201).json(project);
  } catch (error: any) {
    console.error('Error in createProject:', error);
    res.status(500).json({ error: 'Failed to create project' });
  }
};

export const updateProject = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { name, description, status, startDate, endDate } = req.body;

    const existingProject = await prisma.project.findFirst({
      where: { id: req.params.id as string, userId: req.user!.id },
    });

    if (!existingProject) {
      res.status(404).json({ error: 'Project not found' });
      return;
    }

    const project = await prisma.project.update({
      where: { id: req.params.id as string },
      data: {
        name,
        description,
        status,
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
      },
    });

    await prisma.auditLog.create({
      data: {
        userId: req.user!.id,
        action: 'PROJECT_UPDATED',
        details: `Project "${project.name}" was updated.`,
      }
    });

    res.json(project);
  } catch (error: any) {
    console.error('Error in updateProject:', error);
    res.status(500).json({ error: 'Failed to update project' });
  }
};

export const deleteProject = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const existingProject = await prisma.project.findFirst({
      where: { id: req.params.id as string, userId: req.user!.id },
    });

    if (!existingProject) {
      res.status(404).json({ error: 'Project not found' });
      return;
    }

    await prisma.project.delete({
      where: { id: req.params.id as string },
    });

    await prisma.auditLog.create({
      data: {
        userId: req.user!.id,
        action: 'PROJECT_DELETED',
        details: `Project "${existingProject.name}" was deleted.`,
      }
    });

    res.json({ message: 'Project removed' });
  } catch (error: any) {
    console.error('Error in deleteProject:', error);
    res.status(500).json({ error: 'Failed to delete project' });
  }
};
