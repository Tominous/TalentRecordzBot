const request = require('request')
const Discord = require("discord.js");
const config = require('../../config.json');
const admins = config.admins;
const started = Date()
const os = require('os');

module.exports = (bot) => {

function secondsToString(seconds) {
    try {
        var numyears = Math.floor(seconds / 31536000);
        var numdays = Math.floor((seconds % 31536000) / 86400);
        var numhours = Math.floor(((seconds % 31536000) % 86400) / 3600);
        var numminutes = Math.floor((((seconds % 31536000) % 86400) % 3600) / 60);
        var numseconds = Math.round((((seconds % 31536000) % 86400) % 3600) % 60);

        var str = "";
        if (numyears > 0) {
            str += numyears + " year" + (numyears == 1 ? "" : "s") + " ";
        }
        if (numdays > 0) {
            str += numdays + " day" + (numdays == 1 ? "" : "s") + " ";
        }
        if (numhours > 0) {
            str += numhours + " hour" + (numhours == 1 ? "" : "s") + " ";
        }
        if (numminutes > 0) {
            str += numminutes + " minute" + (numminutes == 1 ? "" : "s") + " ";
        }
        if (numseconds > 0) {
            str += numseconds + " second" + (numseconds == 1 ? "" : "s") + " ";
        }
        return str;
    } catch (err) {
        console.log("Could not get time")
        return 'Could not get time';
    }
}

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

	bot.addTraditionalCommand('eval', message => {
		message.delete(1000)
		var user = message.author.username;
		let embed = new Discord.RichEmbed();
	if (isCommander(message.author.id)) {
                try {
                    let code = message.content.split(" ").splice(1).join(" ")
                    let result = eval(code)
					embed.setTitle("Execute Command")
					embed.setColor(0x008000)
					embed.addField("Run command: ", "```"+user+"```", true)
					embed.addField("Input: ", "```" + code + "```", true)
					embed.addField("Output: ", "```diff\n+ " + result + "```", true)
					embed.setFooter("Sent via "+bot.client.user.username, bot.client.user.avatarURL)
					embed.setTimestamp()
					message.channel.send({embed})
                } catch (err) {
                    message.channel.send("```diff\n- " + err + "```")
                }
            } else {
			message.channel.send("Sorry, you do not have permissisons to use this command, **" + message.author.username + "**.")
		}
	});
}