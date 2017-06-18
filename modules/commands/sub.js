const Discord = require("discord.js");
const config = require('../../config.json');
const prefix = config.prefix;
const request = require('request')
const ytkey = config.youtube_api_key;

module.exports = (bot) => {
	bot.addTraditionalCommand("sub ", message => {
		message.delete(1000)
        var id = message.content.split(" ").slice(1).join(" ");
        request("https://www.googleapis.com/youtube/v3/search?part=snippet&q="+id+"&key="+ytkey, function(err, resp, body) {
            try{
                var parsed = JSON.parse(body);
                if(parsed.pageInfo.resultsPerPage != 0){
                    for(var i = 0; i < parsed.items.length; i++){
                        if(parsed.items[i].id.channelId) {
                            request("https://www.googleapis.com/youtube/v3/channels?part=statistics&id="+parsed.items[i].id.channelId+"&key="+ytkey, function(err, resp, body) {
                                var sub = JSON.parse(body);
                                if(sub.pageInfo.resultsPerPage != 0){
                                    let embed = new Discord.RichEmbed();
                                    embed.setColor(0x9900FF)
                                    embed.setTitle( id + " Youtube Channel!")
                                    embed.setURL("http://youtube.com/" + id)
                                    embed.setThumbnail("https://www.youtube.com/yt/brand/media/image/YouTube-icon-full_color.png")
                                    embed.addField("Name: ", parsed.items[i].snippet.channelTitle, true)
                                    embed.addField("Subscribers: ", sub.items[0].statistics.subscriberCount, true)
                                    embed.addField("Videos on YouTube!: ", sub.items[0].statistics.videoCount, true)
                                    embed.addField("Active Viewer: ", sub.items[0].statistics.viewCount, true)
                                    message.channel.send({embed});
                                }else message.channel.send("Nothing found");
                            })
                        break;
                        }
                    }
                }else message.channel.send("Nothing found");
            }catch(e){
                message.channel.send(e);
            }
        })
    })
}