# ProManage Database Schema & ER Diagram

Below is the Entity-Relationship (ER) diagram representing the core data models and their relational flows within the ProManage platform.

## ER Diagram

```mermaid
erDiagram
    User ||--o{ Project : owns
    User {
        string id PK "uuid"
        string email "unique"
        string password
        string name
        DateTime createdAt
        DateTime updatedAt
    }

    Project ||--o{ Task : contains
    Project {
        string id PK "uuid"
        string name
        string description "nullable"
        ProjectStatus status "NOT_STARTED, IN_PROGRESS, COMPLETED"
        DateTime startDate "nullable"
        DateTime endDate "nullable"
        string userId FK "Cascade Delete"
        DateTime createdAt
        DateTime updatedAt
    }

    Task {
        string id PK "uuid"
        string name
        string description "nullable"
        TaskPriority priority "LOW, MEDIUM, HIGH"
        TaskStatus status "PENDING, IN_PROGRESS, COMPLETED"
        DateTime dueDate "nullable"
        string projectId FK "Cascade Delete"
        DateTime createdAt
        DateTime updatedAt
    }
    
    AuditLog {
        string id PK "uuid"
        string userId "Indexed"
        string action "e.g., PROJECT_CREATED"
        string details
        DateTime createdAt
    }
```

## Schema Details

### 1. User
- **Description:** Represents an authenticated user in the workspace.
- **Relationships:** A user can own multiple projects (`1:N` relationship).

### 2. Project
- **Description:** Represents a workspace project containing multiple tasks.
- **Relationships:** 
  - Belongs to a single `User`.
  - Can contain multiple `Tasks` (`1:N` relationship).
  - Deleting a project cascades and deletes all associated tasks.

### 3. Task
- **Description:** Represents an actionable item within a project.
- **Relationships:**
  - Belongs to a single `Project`.
  - Contains tracked priorities (`LOW`, `MEDIUM`, `HIGH`) and statuses (`PENDING`, `IN_PROGRESS`, `COMPLETED`).

### 4. AuditLog
- **Description:** Tracks all significant mutation events across the platform (e.g., task completions, project creation).
- **Indexing:** Highly optimized with an index on `userId` to allow for rapid chronological timeline rendering on the user dashboard.
