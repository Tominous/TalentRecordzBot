const Discord = require("discord.js");
const config = require('../../config.json');
const prefix = config.prefix;

module.exports = (bot) => {
	bot.addTraditionalCommand("hey talent whats my name", message => {
		message.delete(1000)
        var user = message.author.username;
        message.channel.send("Your name is: " + user)
    })
}