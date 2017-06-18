const Discord = require("discord.js");
const config = require('../../config.json');
const prefix = config.prefix;

module.exports = (bot) => {
	bot.addTraditionalCommand("dmowner ", message => {
		message.delete(1000)
        var suffix = message.content.split(" ").slice(1).join(" ");
        if(suffix == "" || suffix == null) return message.channel.sendMessage("Do " +config.prefix+ "dmowner <Message?> to Message ChisdealHD Privately!");
        let embed = new Discord.RichEmbed();
        embed.setColor(0x9900FF)
        embed.setThumbnail(message.author.displayAvatarURL)
        embed.addField("Message: ", suffix, true)
        embed.addField("Discord Channel: ", message.guild.name, true)
        embed.addField("By: ", message.author.username, true)

        bot.client.users.get(config.owner_id).send({embed})
    })
}