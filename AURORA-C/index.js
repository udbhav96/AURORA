import dotenv from "dotenv";
dotenv.config();
import path from "path";
import fs from "fs";

const { Client, GatewayIntentBits, Collection } = require("discord.js");

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
            const command = require(fullPath);
            if (command.name && typeof command.execute === "function") {
                commandsCollection.set(command.name, command);
                console.log(`✅ Loaded ${type} command: ${command.name}`);

                // ✅ Register aliases if available
                if (Array.isArray(command.aliases)) {
                    for (const alias of command.aliases) {
                        aliasCollection.set(alias, command.name);
                        console.log(`🔹 Registered alias: ${alias} -> ${command.name}`)
                    }
                }
            } else {
                console.log(`⚠️ Skipping invalid ${type} command file: ${file.name}`);
            }
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

client.once("ready", () => {
    console.log(`✅ Logged in as ${client.user.tag}!`);
});

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

client.login(process.env.TOKEN);

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
