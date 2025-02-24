module.exports = {
    name: "!calc",
    execute(message, args) {
        if (args.length === 0) {
            message.channel.send("Please provide an expression to calculate!");
            return;
        }


        for (let i = 0; i < args.length; i++) {
            if (["+","-","*","/"].includes(args[i])) { 
                continue; // Skip operators
            }

            args[i] = Number(args[i]);

            if (isNaN(args[i])) {
                message.channel.send("Invalid number input!");
                return;
            }
        }

        const expression = args.join(""); 

        try {
            const result = new Function(`return ${expression}`)();
            message.channel.send(` ${result}`);
        } catch (error) {
            message.channel.send("Error in calculation!");
            console.error("Calculation error:", error);
        }
    }
};
