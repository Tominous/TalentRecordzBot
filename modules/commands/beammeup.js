const Discord = require("discord.js");
const config = require('../../config.json');
const prefix = config.prefix;

module.exports = (bot) => {
	bot.addCommand("hey talent beam me up", (payload) => {
	var message = payload.message
        var mes = ["Aye, aye, Captain.", "Sorry, captain. i need more power!", "Right away, captain."];
        message.channel.send(mes[Math.floor(Math.random() * mes.length)])
    })
}
