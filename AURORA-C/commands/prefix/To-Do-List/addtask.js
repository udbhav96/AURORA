import taskManager from "../../../utils/taskManager.js";

export default {
    name: "!addtask",
    aliases: ["!at"],
    execute: (message, args) => {
        if (!args.length) {
            return message.channel.send("❌ Please provide a task.");
        }

        const { id } = message.author; // Destructuring user ID
        const task = args.join(" ");
        taskManager.addTask(id, task);
        
        message.channel.send(`✅ Task added: **${task}**`);
    }
};
