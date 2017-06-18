const Discord = require("discord.js");
const config = require('../../config.json');
const prefix = config.prefix;

module.exports = (bot) => {
	bot.addTraditionalCommand("git", message => {
		message.delete(1000)
        message.channel.send("This bot Created by ChisdealHD at https://github.com/ChisdealHD/TalentRecordzBot/")
    })
}