module.exports = {
    name: "!echo",
    aliases :[ "!e"],
    execute(message, args) {
        if (args.length === 0) {
            message.channel.send("Please provide a message to echo!");
        } else {
            message.channel.send(args.join(" "));
        }
    }
};
// ✅ Export an object containing command details
// - name: The command trigger ("!echo")
// - execute: The function that runs when the command is used

// ✅ execute(message, args) function:
// 1. Checks if any arguments are provided
// 2. If no arguments, sends a warning message
// 3. If arguments exist, joins them into a string and sends the message back







