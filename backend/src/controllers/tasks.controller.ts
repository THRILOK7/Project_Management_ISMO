import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import prisma from '../utils/prisma';

// Get tasks for a specific project (OPTIMIZED)
export const getTasksByProject = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const projectId = req.params.projectId as string;
    
    // Verify project belongs to user
    const project = await prisma.project.findFirst({
      where: { id: projectId, userId: req.user!.id },
      select: { id: true }, // Only select ID for verification
    });

    if (!project) {
      res.status(404).json({ error: 'Project not found' });
      return;
    }

    // Get only tasks for this specific project
    const tasks = await prisma.task.findMany({
      where: { projectId },
      orderBy: { createdAt: 'desc' },
    });

    res.setHeader('Cache-Control', 'private, max-age=5');
    res.json(tasks);
  } catch (error: any) {
    console.error('Error in getTasksByProject:', error);
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
};

export const getTasks = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;
    
    const sortBy = (req.query.sortBy as string) || 'createdAt';
    const order = (req.query.order as string) === 'asc' ? 'asc' : 'desc';

    const tasks = await prisma.task.findMany({
      where: {
        project: {
          userId: req.user!.id,
        },
      },
      orderBy: { [sortBy]: order },
      skip,
      take: limit,
      include: { project: { select: { name: true } } },
    });
    
    const totalCount = await prisma.task.count({
      where: {
        project: {
          userId: req.user!.id,
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
  } catch (error: any) {
    console.error('Error in getTasks:', error);
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
};

export const getTaskById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const task = await prisma.task.findFirst({
      where: {
        id: req.params.id as string,
        project: {
          userId: req.user!.id,
        },
      },
    });

    if (!task) {
      res.status(404).json({ error: 'Task not found' });
      return;
    }

    res.setHeader('Cache-Control', 'private, max-age=5');
    res.json(task);
  } catch (error: any) {
    console.error('Error in getTaskById:', error);
    res.status(500).json({ error: 'Failed to fetch task' });
  }
};

export const createTask = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { name, description, priority, status, dueDate, projectId } = req.body;

    // Verify project belongs to user
    const project = await prisma.project.findFirst({
      where: { id: projectId, userId: req.user!.id },
    });

    if (!project) {
      res.status(404).json({ error: 'Project not found' });
      return;
    }

    const task = await prisma.task.create({
      data: {
        name,
        description,
        priority,
        status,
        dueDate: dueDate ? new Date(dueDate) : null,
        projectId,
      },
    });

    await prisma.auditLog.create({
      data: {
        userId: req.user!.id,
        action: 'TASK_CREATED',
        details: `Task "${task.name}" was created in project "${project.name}".`,
      }
    });

    res.status(201).json(task);
  } catch (error: any) {
    console.error('Error in createTask:', error);
    res.status(500).json({ error: 'Failed to create task' });
  }
};

export const updateTask = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { name, description, priority, status, dueDate } = req.body;

    const existingTask = await prisma.task.findFirst({
      where: {
        id: req.params.id as string,
        project: {
          userId: req.user!.id,
        },
      },
    });

    if (!existingTask) {
      res.status(404).json({ error: 'Task not found' });
      return;
    }

    const task = await prisma.task.update({
      where: { id: req.params.id as string },
      data: {
        name,
        description,
        priority,
        status,
        dueDate: dueDate ? new Date(dueDate) : null,
      },
    });

    await prisma.auditLog.create({
      data: {
        userId: req.user!.id,
        action: 'TASK_UPDATED',
        details: `Task "${task.name}" was updated.`,
      }
    });

    res.json(task);
  } catch (error: any) {
    console.error('Error in updateTask:', error);
    res.status(500).json({ error: 'Failed to update task' });
  }
};

export const deleteTask = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const existingTask = await prisma.task.findFirst({
      where: {
        id: req.params.id as string,
        project: {
          userId: req.user!.id,
        },
      },
    });

    if (!existingTask) {
      res.status(404).json({ error: 'Task not found' });
      return;
    }

    await prisma.task.delete({
      where: { id: req.params.id as string },
    });

    await prisma.auditLog.create({
      data: {
        userId: req.user!.id,
        action: 'TASK_DELETED',
        details: `Task "${existingTask.name}" was deleted.`,
      }
    });

    res.json({ message: 'Task removed' });
  } catch (error: any) {
    console.error('Error in deleteTask:', error);
    res.status(500).json({ error: 'Failed to delete task' });
  }
};
