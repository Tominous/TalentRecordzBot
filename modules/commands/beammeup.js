const Discord = require("discord.js");
const config = require('../../config.json');
const prefix = config.prefix;

module.exports = (bot) => {
	bot.addTraditionalCommand("hey talent beam me up", message => {
		message.delete(1000)
        var mes = ["Aye, aye, Captain.", "Sorry, captain. i need more power!", "Right away, captain."];
        message.channel.send(mes[Math.floor(Math.random() * mes.length)])
    })
}