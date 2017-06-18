const Discord = require("discord.js");
const config = require('../../config.json');
const prefix = config.prefix;

module.exports = (bot) => {
	bot.addTraditionalCommand("google ", message => {
		message.delete(1000)
        var searchQuery = encodeURI(message.content.substring(8))
        var url = "https://www.google.com/search?q=" + searchQuery;
        message.channel.sendMessage(url + "\n Here Is Your Search!");
    })
}