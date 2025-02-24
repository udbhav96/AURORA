import path from "path";
import fs from "fs";

const logFilePath = path.join(__dirname, "../../logs.txt");

module.exports = {
    name: "!log",
    aliases: ["!l"],
    execute: async (message, args) => {
        if (!args.length) {
            return message.channel.send("❌ Please provide a message to log.");
        }

        const logMessage = `[${new Date().toLocaleString()}] ${message.author.username}: ${args.join(" ")}\n`;

        try {
            await fs.appendFile(logFilePath, logMessage);
            message.channel.send("✅ Your message has been logged.");
        } catch (error) {
            console.error("Error writing to log file:", error);
            message.channel.send("⚠️ Failed to log your message.");
        }
    },
};
