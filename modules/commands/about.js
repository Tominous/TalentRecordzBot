const Discord = require("discord.js");
const config = require('../../config.json');
const prefix = config.prefix;

module.exports = (bot) => {
	bot.addTraditionalCommand("about", message => {
		message.delete(1000)
        message.channel.send("This bot Created in BETA! made by ChisdealHD https://github.com/ChisdealHD/TalentRecordzBot and and Pre-Configured as Modules by Duck https://github.com/TortleWortle/TortleBot-Core")
    })
}