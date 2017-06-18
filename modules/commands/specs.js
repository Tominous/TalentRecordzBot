const Discord = require("discord.js");
const config = require('../../config.json');
const prefix = config.prefix;
const os = require('os')

module.exports = (bot) => {
	bot.addTraditionalCommand("specs", message => {
		message.delete(1000)
        message.channel.sendMessage("", {embed: {
  color: 2590000,
  author: {
    name: bot.client.user.username,
    icon_url: bot.client.user.avatarURL
  },
  title: 'Server Infomation!',
  description: 'Where all Server Infomation.',
  fields: [
    {
      name: 'System info:',
      value: process.platform
    },
    {
      name: 'System Bytes:',
      value: process.arch
    },
    {
      name: 'Running on:',
      value: process.release.name + ' version ' + process.version.slice(1)
    },
    {
      name: 'Process memory usage:',
      value: Math.ceil(process.memoryUsage().heapTotal / 1000000) + ' MB'
    },
    {
      name: 'System memory usage:',
      value: Math.ceil((os.totalmem() - os.freemem()) / 1000000) + ' of ' + Math.ceil(os.totalmem() / 1000000) + ' MB'
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