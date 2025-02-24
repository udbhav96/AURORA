import dotenv from "dotenv";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { Client, GatewayIntentBits, Collection } from "discord.js";
import express from "express"; // ✅ Added Express to keep Render happy

// ✅ Fix __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Load environment variables
dotenv.config();

// ✅ Define file paths
const logsPath = path.join(process.cwd(), "logs.txt");
const tasksPath = path.join(process.cwd(), "tasks.json");

// ✅ Ensure logs.txt exists
if (!fs.existsSync(logsPath)) {
    fs.writeFileSync(logsPath, "", "utf8");
    console.log("📝 Created logs.txt");
}

// ✅ Ensure tasks.json exists
if (!fs.existsSync(tasksPath)) {
    fs.writeFileSync(tasksPath, "{}", "utf8"); // Empty JSON object
    console.log("📂 Created tasks.json");
}

// ✅ Create the bot instance with required permissions
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

// ✅ Store commands and aliases
client.prefixCommands = new Collection();
client.commandAliases = new Collection(); // Stores aliases

// ✅ Function to load commands
function loadCommands(commandsPath, commandsCollection, aliasCollection, type) {
    const commandFiles = fs.readdirSync(commandsPath, { withFileTypes: true });

    for (const file of commandFiles) {
        const fullPath = path.join(commandsPath, file.name);

        if (file.isDirectory()) {
            // If it's a folder, load commands inside it
            loadCommands(fullPath, commandsCollection, aliasCollection, type);
        } else if (file.name.endsWith(".js")) {
            import(fullPath).then((command) => {
                if (command.default?.name && typeof command.default.execute === "function") {
                    commandsCollection.set(command.default.name, command.default);
                    console.log(`✅ Loaded ${type} command: ${command.default.name}`);

                    // ✅ Register aliases if available
                    if (Array.isArray(command.default.aliases)) {
                        for (const alias of command.default.aliases) {
                            aliasCollection.set(alias, command.default.name);
                            console.log(`🔹 Registered alias: ${alias} -> ${command.default.name}`);
                        }
                    }
                } else {
                    console.log(`⚠️ Skipping invalid ${type} command file: ${file.name}`);
                }
            }).catch((err) => console.error(`❌ Error loading command ${file.name}:`, err));
        }
    }
}

// ✅ Load prefix commands dynamically
const prefixCommandsPath = path.join(__dirname, "commands", "prefix");
if (fs.existsSync(prefixCommandsPath)) {
    loadCommands(prefixCommandsPath, client.prefixCommands, client.commandAliases, "prefix");
} else {
    console.log(`[WARNING] The directory ${prefixCommandsPath} does not exist.`);
}

// ✅ Bot Ready Event
client.once("ready", () => {
    console.log(`✅ Logged in as ${client.user.tag}!`);
});

// ✅ Handle Messages
client.on("messageCreate", (message) => {
    if (message.author.bot) return; // Ignore bot messages

    const args = message.content.trim().split(/\s+/);
    const commandName = args.shift().toLowerCase();

    // ✅ Check for command or alias
    const actualCommand = client.prefixCommands.get(commandName) || client.prefixCommands.get(client.commandAliases.get(commandName));

    if (actualCommand) {
        actualCommand.execute(message, args);
    }
});

// ✅ Login the bot
client.login(process.env.TOKEN);

// ✅ Keep Render alive with Express (Prevents timeout issues)
const app = express();
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
    res.send("Bot is running!");
});

app.listen(PORT, () => console.log(`🌐 Web server running on port ${PORT}`));


// ✅ Load environment variables from the .env file (contains the bot token)

// ✅ Import necessary modules:
// - fs (File System) → Reads files from the commands folder
// - path → Helps handle file paths
// - discord.js → Provides core bot functionality (Client, Intents, Collection)

// ✅ Create the bot instance with required permissions:
// - GatewayIntentBits.Guilds → Allows bot to work in servers
// - GatewayIntentBits.GuildMessages → Allows bot to read messages
// - GatewayIntentBits.MessageContent → Allows bot to see message content

// ✅ Create a Collection to store prefix commands efficiently
// - This works like a dictionary (Map) for easy retrieval of commands

// ✅ Function to dynamically load commands from a folder:
// 1. Reads all `.js` files inside the commands folder
// 2. Ensures each file has a `name` and `execute` function
// 3. Stores valid commands in the Collection for later use

// ✅ Check if the "commands/prefix" folder exists before loading commands
// - Prevents errors if the folder is missing

// ✅ Run when the bot is ready, logging a success message

// ✅ Handle messages from users:
// 1. Ignore messages from other bots
// 2. Extract the command name and arguments from the message
// 3. Check if the command exists in the Collection
// 4. If the command exists, execute its function

// ✅ Log in the bot using the token from the .env file
