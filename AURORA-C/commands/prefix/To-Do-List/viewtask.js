import { EmbedBuilder } from "discord.js";
import taskManager from "../../../utils/taskManager.js";

export default {
    name: "!viewtasks",
    aliases: ["!vt"],
    execute: (message) => {
        const { id } = message.author;
        const tasks = taskManager.getTasks(id);

        if (!tasks.length) {
            return message.channel.send("📭 No tasks found.");
        }

        // ✅ Create an embed message
        const embed = new EmbedBuilder()
            .setColor("#0099ff")
            .setTitle("📝 Your To-Do List")
            .setDescription(tasks.map((t, i) => `**${i + 1}.** ${t}`).join("\n"))
            .setFooter({ text: `Requested by ${message.author.username}` });

        message.channel.send({ embeds: [embed] });
    }
};
