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

	bot.addTraditionalCommand('shutdown', message => {
		message.delete(1000)
	if (message.author.id === config.owner_id || config.admins.indexOf(message.author.id) != -1) {
                message.channel.sendMessage("**Shutdown has been initiated**.\nShutting down...")
                setTimeout(function() {
                    bot.client.destroy()
                }, 1000)
                setTimeout(function() {
                    process.exit()
                }, 2000)
            }
	});
}