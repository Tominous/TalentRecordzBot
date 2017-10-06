const Discord = require("discord.js");
const config = require('../../config.json');
const prefix = config.prefix;

module.exports = (bot) => {
	bot.addCommand("hey talent whats my name", (payload) => {
	var message = payload.message
        var user = message.author.username;
        message.channel.send("Your name is: " + user)
    })
}
