# Task Manager Web Application

A full-stack Task Manager web application built using Python, Flask, JavaScript, HTML, CSS, and SQLite. The application allows users to create tasks, mark them as completed, filter tasks by status, and delete tasks. Task data is stored persistently in an SQLite database.

## Features

- **Add Tasks:** Create new tasks using a simple form.
- **View Tasks:** Display tasks retrieved from the database.
- **Complete Tasks:** Mark tasks as completed or pending.
- **Delete Tasks:** Remove tasks with a confirmation prompt.
- **Task Counters:** View total, pending, and completed task counts.
- **Task Filters:** Filter tasks by All, Pending, and Completed.
- **Persistent Storage:** Save task information in SQLite.
- **Responsive UI:** Clean interface designed for desktop and mobile screens.

## Tech Stack

| Technology | Purpose |
|---|---|
| HTML5 | Webpage structure |
| CSS3 | Styling and responsive layout |
| JavaScript | Frontend interactions and API requests |
| Python | Backend programming |
| Flask | Web framework and REST API |
| SQLite | Persistent database storage |

## Project Structure

```text
fullstack-preparation/
├── app.py
├── tasks.db
├── templates/
│   └── index.html
└── static/
    ├── style.css
    └── script.js
```

**Note:** `tasks.db` is generated automatically when the application initializes the database.

## Getting Started

### Prerequisites

- Python 3.10 or later
- pip
- A modern web browser

### Installation

1. Clone the repository or download the project files.

2. Open a terminal in the project directory.

3. Install Flask:

   ```bash
   python -m pip install Flask
   ```

4. Start the application:

   ```bash
   python app.py
   ```

   On Windows, you can also use:

   ```powershell
   py app.py
   ```

5. Open the following address in your browser:

   http://127.0.0.1:5000/

SQLite is included with standard Python installations, so a separate database installation is not required.

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/tasks` | Retrieve all tasks |
| POST | `/api/tasks` | Create a new task |
| PATCH | `/api/tasks/<task_id>` | Update task completion status |
| DELETE | `/api/tasks/<task_id>` | Delete a task |

## How It Works

1. The user interacts with the frontend built using HTML, CSS, and JavaScript.
2. JavaScript sends HTTP requests to the Flask REST API using the Fetch API.
3. Flask processes the requests and performs database operations using Python's SQLite module.
4. SQLite stores task titles and completion status.
5. The frontend retrieves the updated task list and refreshes the counters and visible tasks.

## Learning Outcomes

- Building a full-stack web application.
- Developing REST API endpoints using Flask.
- Connecting a JavaScript frontend to a Python backend.
- Performing CRUD operations with SQLite.
- Handling asynchronous API requests with JavaScript.
- Updating the user interface dynamically.
- Organizing a project into frontend, backend, and database components.

## Future Improvements

- Add user authentication and individual task lists.
- Add task due dates, priorities, and search.
- Add automated tests for API endpoints.
- Deploy the application to a cloud hosting platform.

## Author

Developed as a hands-on project to practise full-stack web development using Python and modern web technologies.
