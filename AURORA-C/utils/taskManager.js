import { readFileSync, writeFileSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const filePath = join(__dirname, "../data/tasks.json");

// ✅ Helper function to load tasks from file
const loadTasks = () => {
    if (!existsSync(filePath)) return {};
    return JSON.parse(readFileSync(filePath, "utf8"));
};

// ✅ Helper function to save tasks
const saveTasks = (tasks) => writeFileSync(filePath, JSON.stringify(tasks, null, 2));

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

const taskManager = {
    addTask,
    getTasks,
    removeTask
};

export default taskManager;  // ✅ Now it's correctly exported
