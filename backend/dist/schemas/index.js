"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.taskUpdateSchema = exports.taskSchema = exports.projectSchema = exports.loginSchema = exports.registerSchema = void 0;
const zod_1 = require("zod");
exports.registerSchema = zod_1.z.object({
    body: zod_1.z.object({
        fullName: zod_1.z.string().min(1, 'Full name is required'),
        email: zod_1.z.string().email('Invalid email address'),
        password: zod_1.z.string().min(6, 'Password must be at least 6 characters'),
    }),
});
exports.loginSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z.string().email('Invalid email address'),
        password: zod_1.z.string().min(1, 'Password is required'),
    }),
});
exports.projectSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().min(1, 'Project name is required'),
        description: zod_1.z.string().optional(),
        status: zod_1.z.enum(['NOT_STARTED', 'IN_PROGRESS', 'COMPLETED']).optional(),
        startDate: zod_1.z.string().datetime().optional().nullable(),
        endDate: zod_1.z.string().datetime().optional().nullable(),
    }).refine((data) => {
        if (data.startDate && data.endDate) {
            return new Date(data.endDate) >= new Date(data.startDate);
        }
        return true;
    }, {
        message: "End date cannot be before start date",
        path: ["endDate"]
    }),
});
exports.taskSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().min(1, 'Task name is required'),
        description: zod_1.z.string().optional(),
        priority: zod_1.z.enum(['LOW', 'MEDIUM', 'HIGH']).optional(),
        status: zod_1.z.enum(['PENDING', 'IN_PROGRESS', 'COMPLETED']).optional(),
        dueDate: zod_1.z.string().datetime().optional().nullable(),
        projectId: zod_1.z.string().uuid('Invalid project ID'),
    })
});
exports.taskUpdateSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().min(1, 'Task name is required').optional(),
        description: zod_1.z.string().optional(),
        priority: zod_1.z.enum(['LOW', 'MEDIUM', 'HIGH']).optional(),
        status: zod_1.z.enum(['PENDING', 'IN_PROGRESS', 'COMPLETED']).optional(),
        dueDate: zod_1.z.string().datetime().optional().nullable(),
    })
});
