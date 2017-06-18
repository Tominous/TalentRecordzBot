const Discord = require("discord.js");
const config = require('../../config.json');
const prefix = config.prefix;
const invite = `https://discordapp.com/oauth2/authorize?permissions=1341643849&scope=bot&client_id=${config.client_id}`;

module.exports = (bot) => {
	bot.addTraditionalCommand("server", message => {
		message.delete(1000)
        if (message.guild.available = true) {
            console.log("Server has been SCANNED at " + message.guild.name)
            if (message.guild.iconURL = null) {
                var iconURL = "https://newagesoldier.com/wp-content/uploads/2016/12/masbot.png";
            } else {
                var iconURL = message.guild.iconURL;
            }
            let embed = new Discord.RichEmbed();
            embed.setTitle(message.guild.name)
            embed.setFooter("Sent via TalentRecordz", "https://cdn.discordapp.com/attachments/263639645647142912/264362236913516545/vaavassvasv_copy.png")
            embed.setColor(0x9900FF)
            embed.setThumbnail(iconURL)
            embed.setTimestamp()
            embed.addField("Server ID", message.guild.id, true)
            embed.addField("Region", message.guild.region, true)
            embed.addField("Owner", message.guild.owner, true)
            embed.addField("Members", message.guild.memberCount, true)
            embed.addField("Roles", message.guild.roles.size, true)
            embed.addField("Channels", message.guild.channels.size, true)
            embed.addField("Created At", message.guild.createdAt)
            embed.addField("Joined Server At", message.guild.joinedAt)

            message.channel.send({embed})
        }
        
    })
}
