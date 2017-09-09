const request = require('request')
const Discord = require("discord.js");
const config = require('../../config.json');
const admins = config.admins;

module.exports = (bot) => {

function isCommander(id) {
	if(id === config.owner_id) {
		return true;
	}
	for(var i = 0; i < admins.length; i++){
		if(admins[i] == id) {
			return true;
		}
	}
	return false;
}

	bot.addTraditionalCommand('broadcast', message => {
	message.delete(1000)
	if (isCommander(message.author.id)) {
            var mes = message.content.split(" ").slice(1).join(" ");
            for(var i=0; i<bot.client.guild.length; i++) {
            message.channel.send(bot.client.guild[i].defaultChannel, mes);
            console.log(mes)
        }
		}else {
			message.channel.send("You are not a Owner of this bot! Access DENIED!")
		}
	}

	});
}