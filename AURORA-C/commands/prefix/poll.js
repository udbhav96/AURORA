const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: "!poll",
    aliases: ["!p"],
    execute: async (message) => {
        // Extract all quoted parts using regex
        const optionMatches = message.content.match(/"([^"]+)"/g);
        if (!optionMatches || optionMatches.length < 3) {
            return message.channel.send(
                "❌ Please provide a question and at least two options.\nExample: `!poll \"Best Anime?\" \"Attack on Titan\" \"One Piece\" \"Jujutsu Kaisen\"`"
            );
        }

        // Extract and clean question
        const question = optionMatches.shift().replace(/"/g, "");
        // Extract and clean options
        const options = optionMatches.map(opt => opt.replace(/"/g, ""));

        // Validate number of options (min: 2, max: 9)
        if (options.length < 2 || options.length > 9) {
            return message.channel.send("❌ Please provide between 2 to 9 options.");
        }

        // Emoji reactions for poll
        const emojis = ["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣", "7️⃣", "8️⃣", "9️⃣"];

        // Create embed message
        const pollEmbed = new EmbedBuilder()
            .setColor("#FFA500")
            .setTitle("📊 Poll Time!")
            .setDescription(`📌 **${question}**\n\n${options.map((opt, i) => `${emojis[i]} **${opt}**`).join("\n")}`)
            .setTimestamp()
            .setFooter({ text: `React below to vote! • Created by ${message.author.username}`, iconURL: message.author.displayAvatarURL() });

        // Send the embed message
        const pollMessage = await message.channel.send({ embeds: [pollEmbed] });

        // React with emojis for voting
        for (let i = 0; i < options.length; i++) {
            await pollMessage.react(emojis[i]);
        }

        // **🕒 Step 4: Wait for 30 seconds before calculating results**
        setTimeout(async () => {
            // Fetch the updated message to get reaction counts
            const fetchedMessage = await message.channel.messages.fetch(pollMessage.id);

            // Count reactions for each emoji
            const voteCounts = options.map((option, i) => ({
                option,
                votes: fetchedMessage.reactions.cache.get(emojis[i])?.count - 1 || 0, // Subtract bot's initial reaction
            }));

            // Sort options by highest votes
            voteCounts.sort((a, b) => b.votes - a.votes);

            // Format the results
            const results = voteCounts.map(vote => `**${vote.option}**: ${vote.votes} votes`).join("\n");

            // **Edit the poll message to display results**
            const resultEmbed = new EmbedBuilder()
                .setColor("#00FF00")
                .setTitle("📊 Poll Results!")
                .setDescription(`📌 **${question}**\n\n${results}`)
                .setTimestamp()
                .setFooter({ text: `Poll ended • Created by ${message.author.username}`, iconURL: message.author.displayAvatarURL() });

            await pollMessage.edit({ embeds: [resultEmbed] });
            message.channel.send("✅ **Poll ended!** Results updated above.");
        }, 30000); // 30 seconds delay
    }
};
