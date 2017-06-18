const Discord = require("discord.js");
const os = require('os')

module.exports = (bot) => {
	bot.addTraditionalCommand("help", message => {
		message.delete(1000)
        message.channel.sendMessage("", {embed: {
        color: 2590000,
        author: {
            name: bot.client.user.username,
            icon_url: bot.client.user.avatarURL
         },
        title: 'Commands',
        url: 'https://docs.google.com/spreadsheets/d/1FIdXM5jG7QauYyiS3y92a-UCRapRmq8yl1axNzQZyN4/edit#gid=0',
        description: 'Where all commands Kept at.',
        fields: [
            {
                name: 'Running on:',
                value: process.release.name + ' version ' + process.version.slice(1)
            },
            {
                name: ' Created in Discord.js',
                value: ' Version: ' + Discord.version + ' [DiscordJS](https://github.com/hydrabolt/discord.js/).'
            }
        ],
        timestamp: new Date(),
        footer: {
            icon_url: bot.client.user.avatarURL,
            text: '© ' + bot.client.user.username
        }
        }});
    })
}