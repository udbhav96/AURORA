const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "../data/tasks.json");

// ✅ Helper function to load tasks from file
const loadTasks = () => {
    if (!fs.existsSync(filePath)) return {};
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
};

// ✅ Helper function to save tasks
const saveTasks = (tasks) => fs.writeFileSync(filePath, JSON.stringify(tasks, null, 2));

// ✅ Add a task for a specific user
const addTask = (userId, task) => {
    const tasks = loadTasks();
    tasks[userId] = [...(tasks[userId] || []), task]; // Using spread operator
    saveTasks(tasks);
};

// ✅ Get tasks for a specific user
const getTasks = (userId) => loadTasks()[userId] || [];

// ✅ Remove a task for a user
const removeTask = (userId, task = null) => {
    const tasks = loadTasks(); // Load tasks first

    if (!tasks[userId] || tasks[userId].length === 0) {
        return "❌ No tasks found for you!";
    }

    if (task) {
        // Remove a specific task
        const initialLength = tasks[userId].length;
        tasks[userId] = tasks[userId].filter(t => t !== task);

        if (tasks[userId].length === initialLength) {
            return `❌ Task not found: **${task}**`;
        }
        
    } else {
        // Remove the last task if no task is specified
        const removedTask = tasks[userId].pop();
        if (!removedTask) return "❌ No tasks found!";
    }

    // Cleanup: Delete the user entry if no tasks remain
    if (tasks[userId].length === 0) {
        delete tasks[userId];
    }

    saveTasks(tasks); // Save updated tasks
    return `✅ Task removed!`;
};

// ✅ Export functions
module.exports = { addTask, getTasks, removeTask };
