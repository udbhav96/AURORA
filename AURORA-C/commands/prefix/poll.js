import { EmbedBuilder } from "discord.js";

export default {
    name: "!poll",
    aliases: ["!p"],
    execute: async (message) => {
        // Extract quoted parts using regex
        const optionMatches = message.content.match(/"([^"]+)"/g);
        if (!optionMatches || optionMatches.length < 3) {
            return message.channel.send(
                "❌ Please provide a question and at least two options.\nExample: `!poll \"Best Anime?\" \"Attack on Titan\" \"One Piece\" \"Jujutsu Kaisen\"`"
            );
        }

        // Extract and clean question
        const question = optionMatches.shift().replace(/"/g, "");
        const options = optionMatches.map(opt => opt.replace(/"/g, ""));

        // Validate number of options (min: 2, max: 9)
        if (options.length < 2 || options.length > 9) {
            return message.channel.send("❌ Please provide between 2 to 9 options.");
        }

        const emojis = ["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣", "7️⃣", "8️⃣", "9️⃣"];

        // Create embed
        const pollEmbed = new EmbedBuilder()
            .setColor("#FFA500")
            .setTitle("📊 Poll Time!")
            .setDescription(`📌 **${question}**\n\n${options.map((opt, i) => `${emojis[i]} **${opt}**`).join("\n")}`)
            .setTimestamp()
            .setFooter({ text: `React below to vote! • Created by ${message.author.username}`, iconURL: message.author.displayAvatarURL() });

        // Send the poll message
        const pollMessage = await message.channel.send({ embeds: [pollEmbed] });

        // React with emoji options
        for (let i = 0; i < options.length; i++) {
            await pollMessage.react(emojis[i]);
        }

        // Wait 30 seconds before showing results
        setTimeout(async () => {
            const fetchedMessage = await message.channel.messages.fetch(pollMessage.id);

            const voteCounts = options.map((option, i) => ({
                option,
                votes: fetchedMessage.reactions.cache.get(emojis[i])?.count - 1 || 0, // Exclude bot's own reaction
            }));

            // Sort by highest votes
            voteCounts.sort((a, b) => b.votes - a.votes);

            const results = voteCounts.map(vote => `**${vote.option}**: ${vote.votes} votes`).join("\n");

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
