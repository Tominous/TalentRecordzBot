const Discord = require("discord.js");
const config = require('../../config.json');
const prefix = config.prefix;

module.exports = (bot) => {
	bot.addCommand("git", (payload) => {
	var message = payload.message
        message.channel.send("This bot Created by ChisdealHD at https://github.com/ChisdealHD/TalentRecordzBot/")
    })
}
