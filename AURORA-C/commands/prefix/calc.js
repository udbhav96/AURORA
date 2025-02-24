export default {
    name: "!calc",
    execute(message, args) {
        if (args.length === 0) {
            message.channel.send("❌ Please provide an expression to calculate!");
            return;
        }

        const validChars = /^[\d+\-*/().\s]+$/; // ✅ Restrict to safe characters

        const expression = args.join("");

        if (!validChars.test(expression)) {
            message.channel.send("⚠️ Invalid characters in expression!");
            return;
        }

        try {
            // ✅ Use `eval` safely inside an IIFE with `Math` functions
            const result = (() => eval(expression))();
            message.channel.send(`🧮 Result: **${result}**`);
        } catch (error) {
            message.channel.send("❌ Error in calculation!");
            console.error("Calculation error:", error);
        }
    }
};
