const request = require('request')
const Discord = require("discord.js");
const config = require('../../config.json');
const twitchkey = config.twitch_api_key;

module.exports = (bot) => {

	bot.addTraditionalCommand('twitch', message => {
			message.delete(1000)
			var suffix = message.content.split(" ").slice(1).join(" ");
			if(suffix == "" || suffix == null) return message.channel.sendMessage("Do " +config.prefix+ "twitch <username?> for Online Status!");
			request("https://api.twitch.tv/kraken/streams/"+suffix+"?client_id="+twitchkey, function(error, response, body) { //set info for the streamer in JSON
				if(error) {
					console.log('Error encounterd: '+err);
					message.channel.send("Horrible stuff happend D:. Try again later.");
					return;
        		}
				if (!error && response.statusCode == 200) {
					var stream = JSON.parse(body);
					if(stream.stream){
					let embed = new Discord.RichEmbed();
					embed.setColor(0x9900FF)
					embed.setThumbnail(stream.stream.preview.large)
            		embed.setURL(stream.stream.channel.url)
            		embed.addField("Online", stream.stream.stream_type, true)
		    		embed.addField("Title", stream.stream.channel.status, true)
            		embed.addField("Followers", stream.stream.channel.followers, true)
            		embed.addField("Game", stream.stream.channel.game, true)
		    		embed.addField("Watching", stream.stream.viewers, true)
            		embed.addField("Total Views", stream.stream.channel.views, true)
            		embed.addField("Joined Twitch", stream.stream.channel.created_at, true)
            		embed.addField("Partnered", stream.stream.channel.partner, true)

					message.channel.send({embed})
			
				} else {
                	message.reply("if error finding that streamer, be Offline or are you sure that was the correct name?")
                }
            }
		})
	});
}
