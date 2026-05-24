# TaskFlow — Task Management System

> A full-stack task management web application built for the **System Integration and Architecture (SIA) Final Project**. TaskFlow allows teams to create, assign, track, and manage tasks and subtasks in real time, backed by a RESTful API and a cloud database.

---

## 🌐 Live Demo

| Service | URL |
|---|---|
| Frontend (Landing Page) | `index.html` via Live Server or static host |
| Backend API | https://task-manager-sia-0gnt.onrender.com |
| Dashboard | `dashboard.html` |

---

## 📁 Project Structure

```
taskflow/
│
├── frontend/
│   ├── index.html          # Landing page
│   ├── dashboard.html      # Dashboard with stats & activity
│   ├── index2.html         # Main task manager app
│   ├── style.css           # Global neon/cyberpunk styles
│   └── script.js           # Task manager logic
│
└── backend/
    ├── server.js           # Express app & all API routes
    ├── supabase.js         # Supabase client setup
    ├── .env                # Environment variables (not committed)
    ├── package.json
    └── README.md
```

---

## ⚙️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | HTML, CSS, Vanilla JavaScript |
| Backend | Node.js, Express.js |
| Database | Supabase (PostgreSQL) |
| Deployment | Render |
| Version Control | GitHub |

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- A Supabase account and project
- A Render account (for deployment)

### 1. Clone the repository
```bash
git clone https://github.com/your-username/taskflow.git
cd taskflow/backend
```

### 2. Install dependencies
```bash
npm install
```

### 3. Set up environment variables
Create a `.env` file in the `backend/` folder:
```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-anon-or-service-key
PORT=3000
```

### 4. Set up Supabase table
Run this SQL in your Supabase SQL editor:
```sql
create table tasks (
  id bigint generated always as identity primary key,
  title text not null,
  category text default 'General',
  "assignedTo" text default 'Unassigned',
  deadline date,
  status text default 'Pending',
  remarks text default '',
  subtasks jsonb default '[]',
  created_at timestamptz default now()
);
```

### 5. Run locally
```bash
node server.js
# Server running on port 3000
```

### 6. Open frontend
Open `frontend/index.html` with **Live Server** in VS Code.

---

## 📡 API Endpoints

**Base URL:** `https://task-manager-sia-0gnt.onrender.com/api`

### Dashboard
| Method | Endpoint | Description |
|---|---|---|
| GET | `/dashboard` | Get task stats, counts, upcoming deadlines |
| GET | `/activity` | Get recent task activity feed |

### Tasks
| Method | Endpoint | Description |
|---|---|---|
| GET | `/tasks` | Get all tasks |
| GET | `/tasks/:id` | Get a single task |
| POST | `/tasks` | Create a new task |
| PUT | `/tasks/:id` | Update a task |
| PATCH | `/tasks/:id/status` | Update task status only |
| DELETE | `/tasks/:id` | Delete a task |

### Subtasks
| Method | Endpoint | Description |
|---|---|---|
| POST | `/tasks/:id/subtasks` | Add a subtask to a task |
| PUT | `/tasks/:taskId/subtasks/:subId` | Update a subtask |
| DELETE | `/tasks/:taskId/subtasks/:subId` | Delete a subtask |

---

## 📋 Sample API Requests

### Create a Task
```http
POST /api/tasks
Content-Type: application/json

{
  "title": "Design landing page",
  "category": "Work",
  "assignedTo": "Juan dela Cruz",
  "deadline": "2025-06-30",
  "remarks": "Must match the neon theme"
}
```

### Add a Subtask
```http
POST /api/tasks/1/subtasks
Content-Type: application/json

{
  "title": "Create wireframes",
  "assignedTo": "Maria Santos",
  "deadline": "2025-06-25",
  "remarks": "Use Figma"
}
```

### Update Task Status
```http
PATCH /api/tasks/1/status
Content-Type: application/json

{
  "status": "In Progress"
}
```

---

## ✨ Features

- ✅ Create, edit, and delete tasks
- ✅ Assign tasks to team members
- ✅ Set deadlines with overdue detection
- ✅ Add subtasks under each main task
- ✅ Filter tasks by status or category
- ✅ Search tasks by title or assignee
- ✅ Dashboard with live stats and progress bar
- ✅ Upcoming deadlines panel
- ✅ Recent activity feed
- ✅ Full CRUD for tasks and subtasks
- ✅ Deployed REST API on Render

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────┐
│                   FRONTEND                      │
│  index.html  │  dashboard.html  │  index2.html  │
└──────────────────────┬──────────────────────────┘
                       │ HTTP / REST API
                       ▼
┌─────────────────────────────────────────────────┐
│              BACKEND (Render)                    │
│              Node.js + Express.js                │
│                                                  │
│  GET /api/dashboard    POST /api/tasks           │
│  GET /api/tasks        PUT  /api/tasks/:id       │
│  PATCH /api/tasks/:id/status                     │
│  POST /api/tasks/:id/subtasks                    │
└──────────────────────┬──────────────────────────┘
                       │ Supabase Client
                       ▼
┌─────────────────────────────────────────────────┐
│              DATABASE (Supabase)                 │
│              PostgreSQL                          │
│              tasks table (with subtasks JSONB)   │
└─────────────────────────────────────────────────┘
```

---

## 👥 Group Members

| Name | Role |
|---|---|
| Ronie Nidea | Backend Developer, Deployment & Testing & Documentation  |
| Jessa Mae Nara | Frontend Developer, Deployment & Testing & Documentation |

---

## 📄 Documentation

Full PDF documentation is available in the `/docs` folder, covering:
- System Overview
- Integration Objectives
- Integration Plan
- Step-by-Step Process
- Challenges and Solutions
- Testing and Validation

---

## 🧪 Testing

API endpoints were tested using **Postman**.
Postman collection is available in `[/docs/TaskFlow.postman_collection.json](https://www.postman.com/ronienidea-202301639-8023423/sia-task-management/collection/2lesvgq/taskflow-api?action=share&source=copy-link&creator=52009805)`.

---

## 📝 License

This project was developed as an academic requirement for **System Integration and Architecture (SIA)**.

---

*TaskFlow © 2025*
