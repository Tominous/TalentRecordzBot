const Discord = require("discord.js");
const config = require('../../config.json');
const prefix = config.prefix;
const invite = `https://discordapp.com/oauth2/authorize?permissions=1341643849&scope=bot&client_id=${config.client_id}`;

module.exports = (bot) => {
	bot.addCommand("servers", (payload) => {
	var message = payload.message
        let embed = new Discord.RichEmbed();
        embed.setColor(0x9900FF)
        embed.setThumbnail(bot.client.user.avatarURL)
        embed.addField("Name: ", bot.client.user.username, true)
        embed.addField("ID: ", bot.client.user.id, true)
        embed.addField("Created: ", bot.client.user.createdAt, true)
        embed.addField("Servers Connected!: ", bot.client.guilds.size, true)
        embed.addField("Owner: ", config.owner, true)
        embed.addField("OwnerID: ", config.owner_id, true)

        message.channel.send({embed})
        
    })
}
