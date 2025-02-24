const reminderCommand = {
    name: "!reminder",
    aliases: ["!r"],
    execute: (message, args) => {
        const match = message.content.match(/"([^"]+)"\s+"([^"]+)"/);

        if (!match) {
            return message.channel.send("❌ Please provide a valid format.\nExample: `!reminder \"Take a break\" \"10m\"`");
        }

        const reminderMessage = match[1]; // Extract message
        const timeInput = match[2]; // Extract time (e.g., "10m")

        // Convert time to milliseconds
        const timeInMs = convertTimeToMs(timeInput);
        if (!timeInMs) {
            return message.channel.send("❌ Invalid time format! Use `s` (seconds), `m` (minutes), or `h` (hours).");
        }

        message.channel.send(`✅ Reminder set for **${timeInput}**: "${reminderMessage}"`);

        // Set timeout to send a reminder after the given time
        setTimeout(() => {
            message.channel.send(`⏰ <@${message.author.id}>, Reminder: **${reminderMessage}**`);
        }, timeInMs);
    }
};

// Function to convert time format to milliseconds
const convertTimeToMs = (timeStr) => {
    const match = timeStr.match(/^(\d+)(s|m|h)$/);
    if (!match) return null;

    const value = parseInt(match[1]);
    const unit = match[2];

    switch (unit) {
        case "s": return value * 1000;
        case "m": return value * 60000;
        case "h": return value * 3600000;
        default: return null;
    }
};

// ✅ Export as ES module
export default reminderCommand;
