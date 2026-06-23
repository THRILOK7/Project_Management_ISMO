# ProManage Project Management System

> An enterprise-ready, low-latency workspace management platform designed to streamline project tracking, task execution, and team productivity.

## Tech Stack Matrix

| Layer | Technologies Used |
| :--- | :--- |
| **Frontend** | Next.js (App Router), Tailwind CSS v4, Axios, Lucide Icons |
| **Backend** | Node.js, Express, TypeScript, Zod, JWT, Bcrypt.js |
| **Database** | PostgreSQL via Supabase, Prisma ORM |
| **Containerization** | Docker, Docker Compose |

---

## API Documentation

Base URL for all endpoints is `/api`. All endpoints except Auth (`/register` & `/login`) require a valid JWT Bearer token in the `Authorization` header.

### Authentication (`/api/auth`)
| Method | Endpoint | Description | Request Body | Response |
| :--- | :--- | :--- | :--- | :--- |
| **POST** | `/register` | Register a new user | `{ fullName, email, password }` | `201 Created` with JWT token and user info |
| **POST** | `/login` | Authenticate a user | `{ email, password }` | `200 OK` with JWT token and user info |
| **POST** | `/logout` | Logout a user | None | `200 OK` |

### Dashboard (`/api/projects/dashboard`)
| Method | Endpoint | Description | Query Parameters | Response |
| :--- | :--- | :--- | :--- | :--- |
| **GET** | `/` | Get dashboard statistics | None | `200 OK` with counts for total/active projects and pending/completed tasks |

### Projects (`/api/projects`)
| Method | Endpoint | Description | Payload / Query | Response |
| :--- | :--- | :--- | :--- | :--- |
| **POST** | `/` | Create a new project | Body: `{ name, description?, status?, startDate?, endDate? }` | `201 Created` with project data |
| **GET** | `/` | List user's projects | Query: `page`, `limit`, `sortBy`, `order` | `200 OK` with paginated `{ data: [...], meta }` |
| **GET** | `/:id` | Get project details | None | `200 OK` with project data and associated tasks |
| **PUT** | `/:id` | Update a project | Body: Partial project fields | `200 OK` with updated project data |
| **DELETE** | `/:id` | Delete a project | None | `200 OK` |

> [!WARNING]  
> Deleting a project will permanently delete all associated tasks due to the Cascade delete relation.

### Tasks (`/api/tasks`)
| Method | Endpoint | Description | Payload / Query | Response |
| :--- | :--- | :--- | :--- | :--- |
| **POST** | `/` | Create a new task | Body: `{ name, description?, priority?, status?, dueDate?, projectId }` | `201 Created` with task data |
| **GET** | `/` | List user's tasks | Query: `page`, `limit`, `sortBy`, `order` | `200 OK` with paginated `{ data: [...], meta }` |
| **GET** | `/:id` | Get task details | None | `200 OK` with task data |
| **PUT** | `/:id` | Update a task | Body: Partial task fields | `200 OK` with updated task data |
| **DELETE** | `/:id` | Delete a task | None | `200 OK` |

---

# 📊 Database Schema & ER Diagram

> This section provides the core relational mapping between the User, Project, and Task entities, as well as the technical Prisma migrations configuration state.

### 1. Unified Relationship Map (ER Diagram)

This primary Entity-Relationship Diagram visualizes the one-to-many relationships and foreign key `Cascade Delete` constraints between the User, Project, and Task entities.

![ProManage Entity-Relationship Diagram](assets/er_diagram.jpg)

***

### 2. Technical Prisma Model Configuration (migrations Table)

This technical schema block details the physical database table definitions and schema states mapped inside the Supabase PostgreSQL engine:

![Prisma Database Tables Configuration](assets/database_tables.jpg)

---

## Local Quickstart Guide

Follow these steps to get ProManage running locally on your machine.

**1. Clone the repository**
```bash
git clone <repository-url>
cd Project_Management_System
```

**2. Configure Environment Variables**
Create `.env` files in both the `frontend` and `backend` directories. Ensure you set up your Supabase connection strings in the backend:
```env
DATABASE_URL="postgresql://postgres.[YOUR-PROJECT]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.[YOUR-PROJECT]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:5432/postgres"
```

**3. Install Dependencies**
```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

**4. Install & Migrate Database**
Navigate to the `backend` directory and push the core schema to Supabase:
```bash
cd backend
npx prisma migrate deploy
npx prisma generate
```
*Note: This maps the core schema tables (User, Project, Task, AuditLog) directly to your Supabase PostgreSQL instance.*

**5. Start the Development Servers**
```bash
# Start backend server (runs on port 5000)
npm run dev

# In a new terminal, start frontend server (runs on port 3000)
cd frontend
npm run dev
```

---

## Advanced Features Extension Cheat Sheet

We have integrated several advanced, production-ready features. Use this cheat sheet for evaluation visibility:

| Feature | Description | Endpoints / Implementation |
| :--- | :--- | :--- |
| **Server-side Pagination** | Controlled data slicing to minimize payload size and improve latency. | `GET /api/projects?page=1&limit=10`<br>`GET /api/tasks?page=1&limit=10` |
| **Dynamic Sorting** | Native DB-level sorting for flexible data views. | `GET /api/projects?sortBy=createdAt&order=desc`<br>`GET /api/tasks?sortBy=priority&order=asc` |
| **Audit Logging System** | Database-driven activity tracking that silently logs Create, Update, and Delete actions. | The `AuditLog` table automatically tracks mutations on `Project` and `Task` resources with user attribution. |
| **Dashboard Metrics** | Optimized single-query aggregations for dashboard statistical rendering. | `GET /api/projects/dashboard` |

---

## 🐳 🐳 Running With Docker (The Refactor)

ProManage is fully containerized with multi-stage builds for a minimal production footprint.

**1. Build and Spin Up the Containers**
From the root of the project, run:
```bash
docker compose up --build
```
*This will spin up both the Next.js frontend (port 3000) and the Express backend (port 5000).*

**2. Run Migrations Inside the Container**
Once the containers are running, execute the database migrations against the running backend container to ensure your Supabase instance is up to date:
```bash
docker exec -it promanage_backend npx prisma migrate deploy
```

---

## Project Directory Tree

```text
Project_Management_System/
├── backend/
│   ├── prisma/
│   │   └── schema.prisma        # Prisma schema defining User, Project, Task, and the AuditLog model for activity tracking
│   ├── src/
│   │   ├── controllers/         # Express route controllers
│   │   ├── middleware/          # JWT auth and Zod validation middleware
│   │   ├── routes/              # API route definitions
│   │   └── utils/               # Prisma client instantiation
│   ├── Dockerfile               # Multi-stage Dockerfile for Node.js backend
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── dashboard/       # Dashboard route containing metrics and the "Recent Activity" timeline stream widget
│   │   │   ├── projects/        # Project management views and dynamic routes
│   │   │   └── tasks/           # Global tasks view with advanced filtering
│   │   ├── components/          # Reusable React components (Navbar, etc.)
│   │   └── lib/                 # Axios API configuration
│   ├── Dockerfile               # Multi-stage Dockerfile leveraging Next.js standalone output
│   └── package.json
├── docker-compose.yml           # Orchestrates the frontend and backend services
└── README.md                    # Project documentation (You are here)
```
