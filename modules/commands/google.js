const Discord = require("discord.js");
const config = require('../../config.json');
const prefix = config.prefix;

module.exports = (bot) => {
	bot.addCommand("google ", (payload) => {
	var message = payload.message
        var searchQuery = encodeURI(message.content.substring(8))
        var url = "https://www.google.com/search?q=" + searchQuery;
        message.channel.sendMessage(url + "\n Here Is Your Search!");
    })
}
