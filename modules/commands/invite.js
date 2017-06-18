const Discord = require("discord.js");
const config = require('../../config.json');
const prefix = config.prefix;

module.exports = (bot) => {
	bot.addTraditionalCommand("invite", message => {
		message.delete(1000)
        message.channel.send("My OAuth URL: " + `https://discordapp.com/oauth2/authorize?permissions=1341643849&scope=bot&client_id=${config.client_id}`)
    })
}