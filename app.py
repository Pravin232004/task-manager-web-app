
from flask import Flask, render_template, request, jsonify
import sqlite3

app = Flask(__name__)

DATABASE = "tasks.db"


# Connect to the SQLite database
def get_db_connection():
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row
    return conn


# Create the tasks table if it doesn't exist
def init_db():
    conn = get_db_connection()

    conn.execute("""
        CREATE TABLE IF NOT EXISTS tasks (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            completed INTEGER NOT NULL DEFAULT 0
        )
    """)

    conn.commit()
    conn.close()


# Display the main page
@app.route("/")
def home():
    return render_template("index.html")


# Get all tasks
@app.route("/api/tasks", methods=["GET"])
def get_tasks():
    conn = get_db_connection()

    rows = conn.execute(
        "SELECT * FROM tasks ORDER BY id DESC"
    ).fetchall()

    conn.close()

    tasks = [
        {
            "id": row["id"],
            "title": row["title"],
            "completed": bool(row["completed"])
        }
        for row in rows
    ]

    return jsonify(tasks)


# Add a new task
@app.route("/api/tasks", methods=["POST"])
def add_task():
    data = request.get_json(silent=True) or {}
    title = data.get("title", "").strip()

    if not title:
        return jsonify({
            "error": "Task title is required"
        }), 400

    conn = get_db_connection()

    cursor = conn.execute(
        "INSERT INTO tasks (title) VALUES (?)",
        (title,)
    )

    conn.commit()

    task_id = cursor.lastrowid
    conn.close()

    return jsonify({
        "id": task_id,
        "title": title,
        "completed": False
    }), 201


# Mark a task as completed or incomplete
@app.route("/api/tasks/<int:task_id>", methods=["PATCH"])
def update_task(task_id):
    data = request.get_json(silent=True) or {}

    conn = get_db_connection()

    row = conn.execute(
        "SELECT * FROM tasks WHERE id = ?",
        (task_id,)
    ).fetchone()

    if row is None:
        conn.close()
        return jsonify({
            "error": "Task not found"
        }), 404

    completed = bool(
        data.get("completed", row["completed"])
    )

    conn.execute(
        "UPDATE tasks SET completed = ? WHERE id = ?",
        (int(completed), task_id)
    )

    conn.commit()
    conn.close()

    return jsonify({
        "id": task_id,
        "title": row["title"],
        "completed": completed
    })


# Delete a task
@app.route("/api/tasks/<int:task_id>", methods=["DELETE"])
def delete_task(task_id):
    conn = get_db_connection()

    cursor = conn.execute(
        "DELETE FROM tasks WHERE id = ?",
        (task_id,)
    )

    conn.commit()
    deleted = cursor.rowcount > 0
    conn.close()

    if not deleted:
        return jsonify({
            "error": "Task not found"
        }), 404

    return jsonify({
        "message": "Task deleted successfully"
    })


# Start the application
if __name__ == "__main__":
    init_db()
    app.run(debug=True)
