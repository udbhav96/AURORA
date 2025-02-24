import fetch from "node-fetch";

export default {
    name: "!facts",
    aliases: ["!f"],
    execute(message) {
        fetch("https://dummyjson.com/quotes/random")
            .then(response => response.json())
            .then(data => {
                message.channel.send(`**"${data.quote}"**\n- *${data.author}*`);
            })
            .catch(error => {
                console.error("Error fetching the quote:", error);
                message.channel.send("❌ Failed to fetch a fact. Try again later!");
            });
    }
};
