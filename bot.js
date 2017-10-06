//*** Created by TortleWortle on 3/31/2017.*//
// This is an example bot
const TortleBot = require('tortlebot-core')
const Discord = require("discord.js");
const config = require('./config.json');
const client = new Discord.Client({ autoReconnect: true });
const fs = require("fs")
const rb = "```"
const request = require("request");

client.login(config.token)

const bot = new TortleBot(client);

console.log("BOT IS STARTING UP!")
//var msg = `
//------------------------------------------------------
//> Do 'git pull' periodically to keep your bot updated!
//> Logging in...
//------------------------------------------------------
//Logged in as ${bot.client.user.username} [ID ${bot.client.user.id}]
//On ${bot.client.guilds.size} servers!
//${bot.client.channels.size} channels and ${bot.clientbot.users.size} users cached!
//Bot is logged in and ready to play some tunes!
//LET'S GO!
//------------------------------------------------------`

//console.log(msg)



bot.setPrefix(config.prefix)

bot.registerModule(require('./modules/stream/mixer'));
bot.registerModule(require('./modules/stream/twitch'));
//bot.registerModule(require('./modules/emotes/mixer'));
//bot.registerModule(require('./modules/emotes/twitch'));
bot.registerModule(require('./modules/admin/eval'));
bot.registerModule(require('./modules/admin/shutdown'));
bot.registerModule(require('./modules/admin/web'));
bot.registerModule(require('./modules/admin/api'));
//bot.registerModule(require('./modules/admin/mysql'));
bot.registerModule(require('./modules/commands/dmowner'));
bot.registerModule(require('./modules/commands/servers'));
bot.registerModule(require('./modules/commands/server'));
bot.registerModule(require('./modules/commands/8ball'));
bot.registerModule(require('./modules/commands/beammeup'));
bot.registerModule(require('./modules/commands/google'));
bot.registerModule(require('./modules/commands/invite'));
bot.registerModule(require('./modules/commands/ping'));
bot.registerModule(require('./modules/commands/specs'));
bot.registerModule(require('./modules/commands/about'));
bot.registerModule(require('./modules/commands/sub'));
bot.registerModule(require('./modules/commands/git'));
//bot.registerModule(require('./modules/commands/chisbday'));
bot.registerModule(require('./modules/commands/whatsmyname'));
bot.registerModule(require('./modules/commands/help'));
//bot.registerModule(require('./modules/audio/radio/radiostats'));
//bot.registerModule(require('./modules/audio/radio/radioplay'));
bot.registerModule(require('./modules/audio/youtube/youtube'));
//bot.registerModule(require('./modules/commands/videoyt'));

process.on('unhandledRejection', console.error);
