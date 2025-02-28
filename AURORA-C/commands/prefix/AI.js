import dotenv from "dotenv";
dotenv.config();
import axios from "axios";

export default {
    name: "!ask",
    description: "Ask the AI a question!",
    async execute(message, args) {
        if (!args.length) {
            return message.reply("Please provide a question! Example: `!ask How does JavaScript work?`");
        }

        const userQuestion = args.join(" ");

        try {
            const response = await axios.post(
                "https://api-inference.huggingface.co/models/facebook/blenderbot-400M-distill",
                { inputs: userQuestion },
                { headers: { Authorization: `Bearer ${process.env.HUGGINGFACE_TOKEN}` } }
            );


            // ✅ Fix: Correctly access `generated_text`
            if (Array.isArray(response.data) && response.data.length > 0 && response.data[0].generated_text) {
                message.reply(response.data[0].generated_text);
            } else {
                message.reply("⚠️ AI didn't return a valid response. Try again.");
            }
        } catch (error) {
            console.error("Error fetching AI response:", error.response?.data || error.message);
            message.reply("⚠️ AI service is currently unavailable.");
        }
    }
};
