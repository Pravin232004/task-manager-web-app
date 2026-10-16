
const taskForm = document.getElementById("task-form");
const taskInput = document.getElementById("task-input");
const taskList = document.getElementById("task-list");
const emptyMessage = document.getElementById("empty-message");

const totalCount = document.getElementById("total-count");
const pendingCount = document.getElementById("pending-count");
const completedCount = document.getElementById("completed-count");

const filterButtons = document.querySelectorAll(".filter-button");

let allTasks = [];
let currentFilter = "all";

// Load tasks from Flask
async function loadTasks() {
    try {
        const response = await fetch("/api/tasks");

        if (!response.ok) {
            throw new Error("Could not load tasks");
        }

        allTasks = await response.json();

        updateCounters();
        renderTasks();
    } catch (error) {
        console.error("Error loading tasks:", error);
        emptyMessage.hidden = false;
        emptyMessage.textContent =
            "Unable to load tasks. Please refresh the page.";
    }
}

// Update total, pending, and completed counters
function updateCounters() {
    const total = allTasks.length;
    const completed = allTasks.filter(
        task => task.completed
    ).length;
    const pending = total - completed;

    totalCount.textContent = total;
    pendingCount.textContent = pending;
    completedCount.textContent = completed;
}

// Display tasks according to the selected filter
function renderTasks() {
    taskList.replaceChildren();

    const filteredTasks = allTasks.filter(task => {
        if (currentFilter === "pending") {
            return !task.completed;
        }

        if (currentFilter === "completed") {
            return task.completed;
        }

        return true;
    });

    filteredTasks.forEach(renderTask);

    emptyMessage.hidden = filteredTasks.length > 0;

    if (filteredTasks.length === 0) {
        const messages = {
            all: "No tasks yet. Add a task to get started!",
            pending: "Great! You have no pending tasks.",
            completed: "No completed tasks yet."
        };

        emptyMessage.textContent = messages[currentFilter];
    }
}

// Create and display a single task
function renderTask(task) {
    const item = document.createElement("li");
    item.className = "task-item";

    const title = document.createElement("span");
    title.className = "task-title";
    title.textContent = task.title;
    title.tabIndex = 0;
    title.setAttribute(
        "role",
        "button"
    );
    title.setAttribute(
        "aria-label",
        `${task.completed ? "Mark incomplete" : "Mark complete"}: ${task.title}`
    );

    if (task.completed) {
        title.classList.add("completed");
    }

    // Toggle completion with a click or keyboard
    async function toggleTask() {
        try {
            const response = await fetch(
                `/api/tasks/${task.id}`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        completed: !task.completed
                    })
                }
            );

            if (!response.ok) {
                throw new Error("Could not update task");
            }

            await loadTasks();
        } catch (error) {
            console.error(error);
            alert("Could not update task. Please try again.");
        }
    }

    title.addEventListener("click", toggleTask);

    title.addEventListener("keydown", event => {
        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            toggleTask();
        }
    });

    // Delete button
    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.textContent = "Delete";
    deleteButton.className = "delete-button";
    deleteButton.setAttribute(
        "aria-label",
        `Delete task: ${task.title}`
    );

    deleteButton.addEventListener("click", async () => {
        if (!confirm(`Delete "${task.title}"?`)) {
            return;
        }

        try {
            const response = await fetch(
                `/api/tasks/${task.id}`,
                { method: "DELETE" }
            );

            if (!response.ok) {
                throw new Error("Could not delete task");
            }

            await loadTasks();
        } catch (error) {
            console.error(error);
            alert("Could not delete task. Please try again.");
        }
    });

    item.appendChild(title);
    item.appendChild(deleteButton);
    taskList.appendChild(item);
}

// Add a new task
taskForm.addEventListener("submit", async event => {
    event.preventDefault();

    const title = taskInput.value.trim();

    if (!title) {
        taskInput.focus();
        return;
    }

    try {
        const response = await fetch("/api/tasks", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ title })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(
                error.error || "Could not add task"
            );
        }

        taskInput.value = "";
        await loadTasks();
        taskInput.focus();
    } catch (error) {
        console.error(error);
        alert(error.message || "Could not add task.");
    }
});

// Filter button events
filterButtons.forEach(button => {
    button.addEventListener("click", () => {
        currentFilter = button.dataset.filter;

        filterButtons.forEach(filterButton => {
            const isActive =
                filterButton.dataset.filter === currentFilter;

            filterButton.classList.toggle("active", isActive);
            filterButton.setAttribute(
                "aria-pressed",
                String(isActive)
            );
        });

        renderTasks();
    });
});

// Initial page load
loadTasks();
