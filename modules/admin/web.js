const request = require('request')
const Discord = require("discord.js");
const config = require('../../config.json');
const admins = config.admins;
const serverport = config.server_port;
const started = Date()
const os = require('os');
const markdown = require( "markdown" ).markdown;
const express = require('express')

  , logger = require('morgan')

  , app = express()

module.exports = (bot) => {

// START API SITE

app.get('/', function(req, res){ res.send(markdown.toHTML("Running DiscordBot\nNode version: " + process.version + "\nDiscord.js version: " + Discord.version)); });

app.get('/prefix', function(req, res){ res.send(markdown.toHTML("Bot Prefix "+prefix )); });

app.get('/invite', function(req, res){ res.send(markdown.toHTML("Bot Invite "+invite )); });

app.get('/stats', function(req, res){ res.send(markdown.toHTML(`Talntrecordz is in ${bot.channels.size} channels on ${bot.guilds.size} servers, for a total of ${bot.users.size} users.` )); });

app.get('/guilds', function(req, res){ res.send("Talntrecordz is in "+ bot.guilds.array().length +" Servers "); });

app.get('/date', function(req, res){ res.send("Talntrecordz Date is "+ started +""); });

app.get('/uptime', function(req, res){ res.send("Talntrecordz Has Been Up For "+ started +""); });

app.get('/api/v1/botstats', function(req, res){ 

var result = {};

var myJson = {'name': ''+bot.client.user.username, 'Discords': ''+bot.client.guilds.size};
   res.contentType('application/json');
   res.send(JSON.stringify(myJson));
});

app.get('/specs', function(req, res){ res.send("xl\nSystem info: " + process.platform + "-" + process.arch + " with " + process.release.name + " version " + process.version.slice(1) + "\nProcess info: PID " + process.pid + " at " + process.cwd() + "\nProcess memory usage: " + Math.ceil(process.memoryUsage().heapTotal / 1000000) + " MB\nSystem memory usage: " + Math.ceil((os.totalmem() - os.freemem()) / 1000000) + " of " + Math.ceil(os.totalmem() / 1000000) + " MB\nBot info: ID " + bot.user.id + " #" + bot.user.discriminator + "\n") });



app.listen(process.env.PORT || + serverport);

// END API SITE

}