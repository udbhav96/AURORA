const taskManager = require("../../../utils/taskManager");

module.exports = {
    name: "!removetask",
    aliases: ["!rt"],
    execute: (message, args) => {
        const { id } = message.author;
        const task = args.join(" ") || null; // If no task is provided, pass null

        const result = taskManager.removeTask(id, task);
        message.channel.send(result); // taskManager now returns the success/error message
    }
};
