/*jshint esversion: 6 */
/*
 * Chis's Music Bot
 * Developed by ChisdealHD & Bacon_Space
 * Visit https://discord.gg/QWuVhAD for more information.
 */
var errorlog = require("./data/errors.json")

const Discord = require("discord.js")
const started = Date()

try {
    var config = require('./config.json');
    console.log("Config file detected!");
} catch (err) {
    console.log(err);
    console.log("No config detected, attempting to use environment variables...");
    if (process.env.MUSIC_BOT_TOKEN && process.env.YOUTUBE_API_KEY) {
        var config = {
            "token": process.env.MUSIC_BOT_TOKEN,
            "client_id": config.client_id,
            "prefix": config.prefix,
            "owner_id": config.owner_id,
            "status": "Musicccc",
            "youtube_api_key": process.env.YOUTUBE_API_KEY,
	    "twitch_api_key": config.twitch_api_key,
            "admins": config.admins
        }
    } else {
        console.log("No token passed! Exiting...")
        process.exit(0)
    }
}
const admins = config.admins;
const bot = new Discord.Client()
const notes = require('./data/notes.json')
const os = require('os')
const prefix = config.prefix;
const ytkey = config.youtube_api_key;
const client_id = config.client_id;
const twitchkey = config.twitch_api_key;
const twitchusername = config.twitchusername;
const serverport = config.server_port;
const rb = "```"
const sbl = require("./data/blservers.json")
const ubl = require("./data/blusers.json")
const fs = require("fs")
const warns = require("./data/warns.json")
const queues = {}
const ytdl = require('ytdl-core')
const search = require('youtube-search')
const prefix1 = "hey talent, ";
const request = require('request')
const opus = require('opusscript')
const cheerio = require('cheerio')
const express = require('express')
  , logger = require('morgan')
  , app = express()
const markdown = require( "markdown" ).markdown;
const startTime = Date.now();
const invite = "My OAuth URL: " + `https://discordapp.com/oauth2/authorize?permissions=1341643849&scope=bot&client_id=${config.client_id}`;
var l = require('stringformat');
const opts = {
    part: 'snippet',
    maxResults: 10,
    key: config.youtube_api_key
}
var intent;

function getQueue(guild) {
    if (!guild) return
    if (typeof guild == 'object') guild = guild.id
    if (queues[guild]) return queues[guild]
    else queues[guild] = []
    return queues[guild]
}

function getRandomInt(max) {
    return Math.floor(Math.random() * (max + 1));
}

var paused = {}

//Fix dis shit
function getRandomMusic(queue, msg) {
    fs.readFile('./data/autoplaylist.txt', 'utf8', function(err, data) {
        if (err) throw err;
        console.log('OK: autoplaylist.txt');
        var random = data.split('\n');

        var num = getRandomInt(random.length);
        console.log(random[num])
        var url = random[num];
        msg.author.username = "AUTOPLAYLIST";
        play(msg, queue, url)
    });
}

function play(msg, queue, song) {
    try {
        if (!msg || !queue) return;
        //if (msg.guild.voiceConnection.channel.members.first() == undefined)
        if (song) {
            search(song, opts, function(err, results) {
                if (err) return msg.channel.sendMessage("Video not found please try to use a youtube link instead.");
                song = (song.includes("https://" || "http://")) ? song : results[0].link
                let stream = ytdl(song, {
                    audioonly: true
                })

                stream.on('error', function(error) {
                    return msg.channel.sendMessage("Could not play video, or Video is Private. Please try another URL or SONGNAME!");
                })
                
                let test
                if (queue.length === 0) test = true
                queue.push({
                    "title": results[0].title,
                    "requested": msg.author.username,
                    "toplay": stream
                })
                console.log("Queued " + queue[queue.length - 1].title + " in " + msg.guild.name + " as requested by " + queue[queue.length - 1].requested)
                msg.channel.sendMessage("Queued **" + queue[queue.length - 1].title + "**")
                if (test) {
                    setTimeout(function() {
                        play(msg, queue)
                    }, 1000)
                }
            })
        } else if (queue.length != 0) {
            msg.channel.sendMessage(`Now Playing **${queue[0].title}** | Requested by ***${queue[0].requested}***`)
            console.log(`Playing ${queue[0].title} as requested by ${queue[0].requested} in ${msg.guild.name}`);
            bot.user.setGame('Playing: ' +queue[0].title+' | Connected servers: '+bot.guilds.size,'https://twitch.tv/'+twitchusername);
            let connection = msg.guild.voiceConnection
            if (!connection) return console.log("No Connection!");
            intent = connection.playStream(queue[0].toplay)

            intent.on('error', () => {
                queue.shift()
                play(msg, queue)
            })

            intent.on('end', () => {
                queue.shift()
                play(msg, queue)
            })
        } else {
            msg.channel.sendMessage('No more music in queue! Starting autoplaylist')


            //TODO: When no more music, play randomly from playlist

            getRandomMusic(queue, msg);


        }
    } catch (err) {
        console.log("WELL LADS LOOKS LIKE SOMETHING WENT WRONG! Visit MusicBot server for support (https://discord.gg/EX642f8) and quote this error:\n\n\n" + err.stack)
        errorlog[String(Object.keys(errorlog).length)] = {
            "code": err.code,
            "error": err,
            "stack": err.stack
        }
        fs.writeFile("./data/errors.json", JSON.stringify(errorlog), function(err) {
            if (err) return console.log("Even worse we couldn't write to our error log file! Make sure data/errors.json still exists!");
        })

    }
}

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

bot.on('ready', function() {
    try {
        config.client_id = client_id;
//        bot.user.setGame('Do '+prefix+'help for more | made by ChisdealHD | '+bot.guilds.size+' Connected Servers ' +prefix+ 'invite for invite bot','https://twitch.tv/chisdealhd')
        var msg = `
------------------------------------------------------
> Do 'git pull' periodically to keep your bot updated!
> Logging in...
------------------------------------------------------
Logged in as ${bot.user.username} [ID ${bot.user.id}]
On ${bot.guilds.size} servers!
${bot.channels.size} channels and ${bot.users.size} users cached!
Bot is logged in and ready to play some tunes!
LET'S GO!
------------------------------------------------------`

        console.log(msg)
        var errsize = Number(fs.statSync("./data/errors.json")["size"])
        console.log("Current error log size is " + errsize + " Bytes")
        if (errsize > 5000) {
            errorlog = {}
            fs.writeFile("./data/errors.json", JSON.stringify(errorlog), function(err) {
                if (err) return console.log("Uh oh we couldn't wipe the error log");
                console.log("Just to say, we have wiped the error log on your system as its size was too large")
            })
        }
        console.log("------------------------------------------------------")
    } catch (err) {
        console.log("WELL LADS LOOKS LIKE SOMETHING WENT WRONG! Visit MusicBot server for support (https://discord.gg/EX642f8) and quote this error:\n\n\n" + err.stack)
        errorlog[String(Object.keys(errorlog).length)] = {
            "code": err.code,
            "error": err,
            "stack": err.stack
        }
        fs.writeFile("./data/errors.json", JSON.stringify(errorlog), function(err) {
            if (err) return console.log("Even worse we couldn't write to our error log file! Make sure data/errors.json still exists!");
        })

    }
})

bot.on('voiceStateUpdate', function(oldMember, newMember) {
	var svr = bot.guilds.array()
    for (var i = 0; i < svr.length; i++) {
        if (svr[i].voiceConnection) {
            if (paused[svr[i].voiceConnection.channel.id]) {
                if (svr[i].voiceConnection.channel.members.size > 1) {
                    //svr[i].defaultChannel.sendMessage("I resumed my music in " + svr[i].voiceConnection.channel.name)
					paused[svr[i].voiceConnection.channel.id].player.resume()
					var game = bot.user.presence.game.name;
                    delete paused[svr[i].voiceConnection.channel.id]
                    game = game.split("⏸")[1];
					bot.user.setGame(+game,'https://twitch.tv/'+twitchusername);
                }
            }
            if (svr[i].voiceConnection.channel.members.size === 1 && !svr[i].voiceConnection.player.dispatcher.paused) {
                //svr[i].defaultChannel.sendMessage("I paused my music in the voice channel because no one is there, rejoin the channel to resume music")
                svr[i].voiceConnection.player.dispatcher.pause();
                var game = bot.user.presence.game.name;
                paused[svr[i].voiceConnection.channel.id] = {
                    "player": svr[i].voiceConnection.player.dispatcher
                }
                bot.user.setGame("⏸ " + game,'https://twitch.tv/'+twitchusername);
            }
        }
    }
});

bot.on("message", function(message) {
    try {
        if (message.author.bot) return
		if (message.channel.type === "dm") return;
        if (message.author === bot.user)
            if (message.guild === undefined) {
                message.channel.sendMessage("The bot only works in servers!")

                return;
            }
        if (sbl.indexOf(message.guild.id) != -1 && message.content.startsWith(prefix)) {
            message.channel.sendMessage("This server is blacklisted Congratz on Blacklist Unit!")
            return
        }
        if (ubl.indexOf(message.author.id) != -1 && message.content.startsWith(prefix)) {
            message.reply(" you are blacklisted and can not use the bot!")
            return
        }
	if (message.content.startsWith(prefix + 'setstream')) {
            if (message.author.id === config.owner_id || config.admins.indexOf(message.author.id) != -1) {
					let suffix = message.content.split(" ").slice(1).join(" ");
					bot.user.setGame(suffix+ ' Is now LIVE! | Do '+prefix+'help for More!','https://twitch.tv/'+suffix)
					message.channel.sendMessage(":ok_hand:" +suffix+ " is now set as Streaming")
            } else {
                message.channel.sendMessage('Only Owners and admins can set Streaming!');
            }
        }
	if (message.content.startsWith(prefix + 'sleeping')) {
            if (message.author.id === config.owner_id || config.admins.indexOf(message.author.id) != -1) {
					let suffix = message.content.split(" ").slice(1).join(" ");
					bot.user.setGame(suffix+ ' Is Sleeping DM him if needed | Do '+prefix+'help for More!','https://twitch.tv/'+twitchusername)
					message.channel.sendMessage(":ok_hand:" +suffix+ " is now set as Sleeping")
            } else {
                message.channel.sendMessage('Only Owners and admins can set Streaming!');
            }
        }
	if (message.content.startsWith(prefix + 'status')) {
            if (message.author.id === config.owner_id || config.admins.indexOf(message.author.id) != -1) {
					let suffix = message.content.split(" ").slice(1).join(" ")
					var user = message.author.username;
					bot.user.setGame(suffix ,'https://twitch.tv/'+twitchusername)
					message.channel.sendMessage(":ok_hand:" +suffix+ " is now set as Status")
            } else {
                message.channel.sendMessage('Only Owners and admins can set Status!');
            }
        }
        if (message.content.startsWith(prefix + "ping")) {
            var before = Date.now()
            message.channel.sendMessage("Pong!").then(function(msg) {
                var after = Date.now()
                msg.edit("Pong! **" + (after - before) + "**ms")

            })
        }
     if (message.content === prefix + 'help') {
    message.channel.sendMessage("", {embed: {
  color: 2590000,
  author: {
    name: bot.user.username,
    icon_url: bot.user.avatarURL
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
    icon_url: bot.user.avatarURL,
    text: '© ' + bot.user.username
  }
}});
  }
        if (message.content.startsWith(prefix + 'servers')) {
            message.channel.sendMessage("I'm currently on **" + bot.guilds.size + "** server(s)")
        }
        if (message.content === prefix + 'uptime') {
            message.channel.sendMessage("I have been up for `" + secondsToString(process.uptime()) + "` - My process was started at this time --> `" + started + "`")
        }

        if (message.content.startsWith(prefix + 'play')) {
            if (!message.guild.voiceConnection) {
                if (!message.member.voiceChannel) return message.channel.sendMessage('You need to be in a voice channel')
                var chan = message.member.voiceChannel
                chan.join()
            }
            let suffix = message.content.split(" ").slice(1).join(" ")
            if (!suffix) return message.channel.sendMessage('You need to specify a song link or a song name!')

            play(message, getQueue(message.guild.id), suffix)
        }
	
	if (message.content.startsWith(prefix + 'stop')) {
            var chan = message.member.voiceChannel
	    let player = message.guild.voiceConnection.player.dispatcher
	    let queue = getQueue(message.guild.id);
            player.pause()
	    for (var i = queue.length - 1; i >= 0; i--) {
            queue.splice(i, 1);
	    }
            chan.leave()
	    bot.user.setGame('Do '+prefix+'help for more | made by ChisdealHD | '+bot.guilds.size+' Connected Servers ' +prefix+ 'invite for invite bot','https://twitch.tv/'+twitchusername)
            message.channel.sendMessage(':wave: : no music then :( well im all alone!')
        }

        if (message.content.startsWith(prefix + 'sys')) {
            message.channel.sendMessage("```xl\nSystem info: " + process.platform + "-" + process.arch + " with " + process.release.name + " version " + process.version.slice(1) + "\nProcess info: PID " + process.pid + " at " + process.cwd() + "\nProcess memory usage: " + Math.ceil(process.memoryUsage().heapTotal / 1000000) + " MB\nSystem memory usage: " + Math.ceil((os.totalmem() - os.freemem()) / 1000000) + " of " + Math.ceil(os.totalmem() / 1000000) + " MB\nBot info: ID " + bot.user.id + " #" + bot.user.discriminator + "\n```");
        }
        if (message.content.startsWith(prefix + "serverblacklist")) {
            if (message.author.id === config.owner_id || config.admins.indexOf(message.author.id) != -1) {
                let c = message.content.split(" ").splice(1).join(" ")
                let args = c.split(" ")
                console.log("[DEVELOPER DEBUG] Blacklist args were: " + args)
                if (args[0] === "remove") {
                    sbl.splice(sbl.indexOf(args[1]))
                    fs.writeFile("./data/blservers.json", JSON.stringify(sbl))
                } else if (args[0] === "add") {
                    sbl.push(args[1])
                    fs.writeFile("./data/blservers.json", JSON.stringify(sbl))
                } else {
                    message.channel.sendMessage(`You need to specify what to do! ${prefix}serverblacklist <add/remove> <server id>`)
                }
            } else {
                message.channel.sendMessage("Sorry, this command is for the owner only.")
            }

        }
        if (message.content.startsWith(prefix + 'note')) {
            if (notes[message.author.id] === undefined) {
                notes[message.author.id] = {
                    'notes': []
                }
            }
            notes[message.author.id].notes[notes[message.author.id].notes.length] = {
                'content': message.cleanContent.split(" ").splice(1).join(" "),
                'time': Date()
            }
            fs.writeFile('./data/notes.json', JSON.stringify(notes), function(err) {
                if (err) return;
                message.channel.sendMessage('Added to notes! Type `' + prefix + 'mynotes` to see all your notes')
            })
        }
        if (message.content === prefix + 'mynotes') {
            var nutes = 'Here are your notes:\n\n```'
            for (var i = 0; i < notes[message.author.id].notes.length; i++) {
                nutes += `${i + 1}) '${notes[message.author.id].notes[i].content}' - Added ${notes[message.author.id].notes[i].time}\n`
            }

            nutes += "```"
            message.channel.sendMessage(nutes)
        }

        if (message.content.startsWith(prefix + "userblacklist")) {
            if (message.author.id === config.owner_id || config.admins.indexOf(message.author.id) != -1) {
                let c = message.content.split(" ").splice(1).join(" ")
                let args = c.split(" ")
                console.log("[DEVELOPER DEBUG] Blacklist args were: " + args)
                if (args[0] === "remove") {
                    ubl.splice(ubl.indexOf(args[1]))
                    fs.writeFile("./data/blusers.json", JSON.stringify(ubl))
                } else if (args[0] === "add") {
                    ubl.push(args[1])
                    fs.writeFile("./data/blusers.json", JSON.stringify(sbl))
                } else {
                    message.channel.sendMessage(`You need to specify what to do! ${prefix}serverblacklist <add/remove> <server id>`)
                }
            } else {
                message.channel.sendMessage("Sorry, this command is for the owner only.")
            }

        }

        if (message.content.startsWith(prefix + "clear")) {
            if (message.guild.owner.id == message.author.id || message.author.id == config.owner_id || config.admins.indexOf(message.author.id) != -1 || message.channel.permissionsFor(message.member).hasPermission('MANAGE_SERVER')) {
                let queue = getQueue(message.guild.id);
                if (queue.length == 0) return message.channel.sendMessage(`No music in queue`);
                for (var i = queue.length - 1; i >= 0; i--) {
                    queue.splice(i, 1);
                }
                message.channel.sendMessage(`Cleared the queue`)
            } else {
                message.channel.sendMessage('Only the admins can do this command');
            }
        }

        if (message.content.startsWith(prefix + "lookupwarn")) {
            if (message.guild.owner.id == message.author.id || message.author.id == config.owner_id || config.admins.indexOf(message.author.id) != -1 || message.channel.permissionsFor(message.member).hasPermission('MANAGE_SERVER')) {
                let user = message.mentions.users.array()[0];
                if (!user) return message.channel.sendMessage("You need to mention the user");
                let list = Object.keys(warns);
                let found = '';
                let foundCounter = 0;
                let warnCase;
                //looking for the case id
                for (let i = 0; i < list.length; i++) {
                    if (warns[list[i]].user.id == user.id) {
                        foundCounter++;
                        found += `${(foundCounter)}. Username: ${warns[list[i]].user.name}\nAdmin: ${warns[list[i]].admin.name}\nServer: ${warns[list[i]].server.name}\nReason: ${warns[list[i]].reason}\n`;
                    }
                }
                if (foundCounter == 0) return message.channel.sendMessage("No warns recorded for that user")
                message.channel.sendMessage(`Found ${foundCounter} warns\n ${found}`);
            } else {
                message.channel.sendMessage('Only the admins can do this command');
            }
        }

        if (message.content.startsWith(prefix + 'skip')) {
            if (message.guild.owner.id == message.author.id || message.author.id == config.owner_id || config.admins.indexOf(message.author.id) != -1 || message.channel.permissionsFor(message.member).hasPermission('MANAGE_SERVER')) {
                let player = message.guild.voiceConnection.player.dispatcher
                if (!player || player.paused) return message.channel.sendMessage("Bot is not playing!")
                message.channel.sendMessage('Skipping song...');
                player.end()
            } else {
                message.channel.sendMessage('Only the admins can do this command');
            }
        }

        if (message.content.startsWith(prefix + "deletewarn")) {
            if (message.channel.permissionsFor(message.member).hasPermission("KICK_MEMBERS") || message.channel.permissionsFor(message.member).hasPermission("BAN_MEMBERS") || message.guild.owner.id == message.author.id || message.author.id == config.owner_id || config.admins.indexOf(message.author.id) != -1) {
                let user = message.mentions.users.array()[0];
                if (!user) return message.channel.sendMessage("You need to mention the user");
                let list = Object.keys(warns);
                let found;
                //looking for the case id
                for (let i = 0; i < list.length; i++) {
                    if (warns[list[i]].user.id == user.id) {
                        found = list[i];
                        break;
                    }
                }
                if (!found) return message.channel.sendMessage('Nothing found for this user');
                message.channel.sendMessage(`Delete the case of ${warns[found].user.name}\nReason: ${warns[found].reason}`);
                delete warns[found];
                fs.writeFile("./data/warns.json", JSON.stringify(warns))
            } else {
                message.channel.sendMessage("You have to be able to kick/ban members to use this command")
            }
        }

        if (message.content.startsWith(prefix + 'pause')) {
            if (message.guild.owner.id == message.author.id || message.author.id == config.owner_id || config.admins.indexOf(message.author.id) != -1) {
                let player = message.guild.voiceConnection.player.dispatcher
                if (!player || player.paused) return message.channel.sendMessage("Bot is not playing")
                player.pause();
                message.channel.sendMessage("Pausing music...");
            } else {
                message.channel.sendMessage('Only admins can use this command!');
            }
        }

        if (message.content.startsWith(prefix + 'reminder')) {
            try {
                let c = message.content.substring(message.content.indexOf(' ') + 1, message.content.length)
                let msg = c.split(" ").splice(1).join(" ").split("|")
                msg[0] = msg[0].replace(/\s/g, '')
                let time = parseTime(msg[0])
                let reminder = msg[1].trim()
                message.reply("I will PM you a reminder to " + reminder + " in " + time + "!")
                setTimeout(function() {
                    message.channel.sendMessage(message.author + " Reminder: " + reminder)
                }, time.countdown)

                function parseTime(str) {
                    let num, time
                    if (str.indexOf(" ") > -1) {
                        num = str.substring(0, str.indexOf(" "))
                        time = str.substring(str.indexOf(" ") + 1).toLowerCase()
                    } else {
                        for (let i = 0; i < str.length; i++) {
                            if (str.substring(0, i) && !isNaN(str.substring(0, i)) && isNaN(str.substring(0, i + 1))) {
                                num = str.substring(0, i)
                                time = str.substring(i)
                                break
                            }
                        }
                    }
                    if (!num || isNaN(num) || num < 1 || !time || ["d", "day", "days", "h", "hr", "hrs", "hour", "hours", "m", "min", "mins", "minute", "minutes", "s", "sec", "secs", "second", "seconds"].indexOf(time) == -1) {
                        return
                    }
                    let countdown = 0
                    switch (time) {
                        case "d":
                        case "day":
                        case "days":
                            countdown = num * 86400000
                            break
                        case "h":
                        case "hr":
                        case "hrs":
                        case "hour":
                        case "hours":
                            countdown = num * 3600000
                            break
                        case "m":
                        case "min":
                        case "mins":
                        case "minute":
                        case "minutes":
                            countdown = num * 60000
                            break
                        case "s":
                        case "sec":
                        case "secs":
                        case "second":
                        case "seconds":
                            countdown = num * 1000
                            break
                    }
                    return {
                        num: num,
                        time: time,
                        countdown: countdown
                    }
                }
            } catch (err) {
                message.channel.sendMessage("Invalid arguments.")
            }
        }

        if (message.content.startsWith(prefix + 'shutdown')) {
            if (message.author.id === config.owner_id || config.admins.indexOf(message.author.id) != -1) {
                message.channel.sendMessage("**Shutdown has been initiated**.\nShutting down...")
                setTimeout(function() {
                    bot.destroy()
                }, 1000)
                setTimeout(function() {
                    process.exit()
                }, 2000)
            }
        }

        if (message.content.startsWith(prefix + 'warn')) {
            if (message.channel.permissionsFor(message.author).hasPermission("KICK_MEMBERS") || message.channel.permissionsFor(message.author).hasPermission("BAN_MEMBERS")) {
                let c = message.content
                let usr = message.mentions.users.array()[0]
                if (!usr) return message.channel.sendMessage("You need to mention the user");
                let rsn = c.split(" ").splice(1).join(" ").replace(usr, "").replace("<@!" + usr.id + ">", "")
                let caseid = genToken(20)

                function genToken(length) {
                    let key = ""
                    let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"

                    for (let i = 0; i < length; i++) {
                        key += possible.charAt(Math.floor(Math.random() * possible.length))
                    }

                    return key
                }

                warns[caseid] = {
                    "admin": {
                        "name": message.author.username,
                        "discrim": message.author.discriminator,
                        "id": message.author.id
                    },
                    "user": {
                        "name": usr.username,
                        "discrim": usr.discriminator,
                        "id": usr.id
                    },
                    "server": {
                        "name": message.guild.name,
                        "id": message.guild.id,
                        "channel": message.channel.name,
                        "channel_id": message.channel.id
                    },
                    "reason": rsn
                }
                message.channel.sendMessage(usr + " was warned for `" + rsn + "`, check logs for more info")
                fs.writeFile("./data/warns.json", JSON.stringify(warns))
            } else {
                message.channel.sendMessage("You have to be able to kick/ban members to use this command!")
            }
        }

        if (message.content.startsWith(prefix + 'say')) {
            if (message.author.id === config.owner_id || config.admins.indexOf(message.author.id) != -1) {
                var say = message.content.split(" ").splice(1).join(" ")
                message.delete();
                message.channel.sendMessage(say)
            }
        }

        if (message.content.startsWith(prefix + 'eval')) {
            if (isCommander(message.author.id)) {
                try {
                    let code = message.content.split(" ").splice(1).join(" ")
                    let result = eval(code)
                    message.channel.sendMessage("```diff\n+ " + result + "```")
                } catch (err) {
                    message.channel.sendMessage("```diff\n- " + err + "```")
                }
            } else {
                message.channel.sendMessage("Sorry, you do not have permissisons to use this command, **" + message.author.username + "**.")
            }
        }

        if (message.content.startsWith(prefix + 'volume')) {
            let suffix = message.content.split(" ")[1];
            var player = message.guild.voiceConnection.player.dispatcher
            if (!player || player.paused) return message.channel.sendMessage('No music m8, queue something with `' + prefix + 'play`');
            if (!suffix) {
                message.channel.sendMessage(`The current volume is ${(player.volume * 100)}`);
            } else if (message.guild.owner.id == message.author.id || message.author.id == config.owner_id || config.admins.indexOf(message.author.id) != -1) {
                let volumeBefore = player.volume
                let volume = parseInt(suffix);
                if (volume > 100) return message.channel.sendMessage("The music can't be higher then 100");
                player.setVolume((volume / 100));
                message.channel.sendMessage(`Volume changed from ${(volumeBefore * 100)} to ${volume}`);
            } else {
                message.channel.sendMessage('Only admins can change the volume!');
            }
        }

        if (message.content.startsWith(prefix + 'resume')) {
            if (message.guild.owner.id == message.author.id || message.author.id == config.owner_id || config.admins.indexOf(message.author.id) != -1) {
                let player = message.guild.voiceConnection.player.dispatcher
                if (!player) return message.channel.sendMessage('No music is playing at this time.');
                if (player.playing) return message.channel.sendMessage('The music is already playing');
                var queue = getQueue(message.guild.id);
                bot.user.setGame(queue[0].title);
                player.resume();
                message.channel.sendMessage("Resuming music...");
            } else {
                message.channel.sendMessage('Only admins can do this command');
            }
        }

        if (message.content.startsWith(prefix + 'invite')) {
            message.channel.sendMessage("My OAuth URL: " + `http://discordapp.com/oauth2/authorize?client_id=${config.client_id}&scope=bot`)
        }
        if (message.content.startsWith(prefix + 'git')) {
            message.channel.sendMessage("GitHub URL: **https://github.com/ChisdealHD/TalentRecordzBot**")
        }
		
	if (message.content === ":kappa") {
        message.channel.sendFile("./images/emotes/kappa.png")
    }
	if (message.content === ":beam") {
        message.channel.sendFile("./images/emotes/beam.png")
    }
	if (message.content === ":cactus") {
        message.channel.sendFile("./images/emotes/cactus.png")
    }
	if (message.content === ":cat") {
        message.channel.sendFile("./images/emotes/cat.png")
    }
	if (message.content === ":chicken") {
        message.channel.sendFile("./images/emotes/chicken.png")
    }
	if (message.content === ":dog") {
        message.channel.sendFile("./images/emotes/dog.png")
    }
	if (message.content === ":facepalm") {
        message.channel.sendFile("./images/emotes/facepalm.png")
    }
	if (message.content === ":fish") {
        message.channel.sendFile("./images/emotes/fish.png")
    }
	if (message.content === ":mappa") {
        message.channel.sendFile("./images/emotes/mappa.png")
    }
	if (message.content === ":salute") {
       message.channel.sendFile("./images/emotes/salute.png")
    }
	if (message.content === ":sloth") {
        message.channel.sendFile("./images/emotes/sloth.png")
    }
	if (message.content === ":swag") {
        message.channel.sendFile("./images/emotes/swag.png")
    }
	if (message.content === ":termital") {
        message.channel.sendFile("./images/emotes/termital.png")
    }
	if (message.content === ":whoappa") {
        message.channel.sendFile("./images/emotes/whoappa.png")
    }
	if (message.content === ":yolo") {
        message.channel.sendFile("./images/emotes/yolo.png")
    }
	if (message.content === ":heyguys") {
        message.channel.sendFile("./images/emotes/heyguys.png")
    }
	if (message.content === ":doorstop") {
        message.channel.sendFile("./images/emotes/doorstop.png")
    }
	if (message.content === ":elegiggle") {
        message.channel.sendFile("./images/emotes/elegiggle.png")
    }
	if (message.content === ":failfish") {
        message.channel.sendFile("./images/emotes/failfish.png")
    }
	if (message.content === ":feelsbadman") {
        message.channel.sendFile("./images/emotes/feelsbadman.png")
    }
	if (message.content === ":kappaclaus") {
        message.channel.sendFile("./images/emotes/kappaclaus.png")
    }
	if (message.content === ":kappapride") {
        message.channel.sendFile("./images/emotes/kappapride.png")
    }
	if (message.content === ":kappaross") {
       message.channel.sendFile("./images/emotes/kappaross.png")
    }
	if (message.content === ":kappawealth") {
        message.channel.sendFile("./images/emotes/kappawealth.png")
    }
	if (message.content === ":minglee") {
        message.channel.sendFile("./images/emotes/minglee.png")
    }
	if (message.content === ":nootnoot") {
        message.channel.sendFile("./images/emotes/nootnoot.png")
    }
	if (message.content === ":seemsgood") {
        message.channel.sendFile("./images/emotes/seemsgood.png")
    }
	if (message.content === ":swiftrage") {
        message.channel.sendFile("./images/emotes/swiftrage.png")
    }
	if (message.content === ":wutface") {
        message.channel.sendFile("./images/emotes/wutface.png")
    }
	if (message.content === ":getgranted") {
        message.channel.sendFile("./images/emotes/getgranted.png")
    }
	if (message.content === ":adults") {
        message.channel.sendFile("./images/emotes/adults.png")
    }
	if (message.content === ":android") {
        message.channel.sendFile("./images/emotes/android.png")
    }
	if (message.content === ":anonymous") {
        message.channel.sendFile("./images/emotes/anonymous.png")
    }
	if (message.content === ":deathstar") {
        message.channel.sendFile("./images/emotes/deathstar.png")
    }
	if (message.content === ":feelsgoodman") {
        message.channel.sendFile("./images/emotes/feelsgoodman.png")
    }
        if (message.content === ":thecreedsclan") {
        message.channel.sendFile("./images/emotes/LOGO.png")
    }
        if (message.content === ":ampenergycherry") {
        message.channel.sendFile("./images/emotes/AMPEnergyCherry.png")
    }
    	if (message.content === ":argieb8") {
        message.channel.sendFile("./images/emotes/ArgieB8.png")
    }
    	if (message.content === ":biblethump") {
        message.channel.sendFile("./images/emotes/biblethump.png")
    }
    	if (message.content === ":biersderp") {
        message.channel.sendFile("./images/emotes/biersderp.png")
    }
    	if (message.content === ":kapow") {
        message.channel.sendFile("./images/emotes/kapow.png")
    }
    	if (message.content === ":lirik") {
        message.channel.sendFile("./images/emotes/lirik.png")
    }
    	if (message.content === ":mau5") {
        message.channel.sendFile("./images/emotes/Mau5.png")
    }
    	if (message.content === ":mcat") {
        message.channel.sendFile("./images/emotes/mcaT.png")
    }
    	if (message.content === ":pjsalt") {
        message.channel.sendFile("./images/emotes/PJSalt.png")
    }
    	if (message.content === ":pjsugar") {
        message.channel.sendFile("./images/emotes/PJSugar.png")
    }
    	if (message.content === ":twitchRaid") {
        message.channel.sendFile("./images/emotes/twitchraid.png")
    }
	if (message.content === ":gaben") {
        message.channel.sendFile("./images/emotes/gaben.png")
    }
	if (message.content === ":twitch") {
        message.channel.sendFile("./images/emotes/twitch.png")
    }
    	if (message.content === ":Illuminati") {
        message.channel.sendFile("./images/emotes/Illuminati.png")
    }
	if (message.content === ":dableft") {
        message.channel.sendFile("./images/emotes/dableft.png")
    }
	if (message.content === ":dabright") {
        message.channel.sendFile("./images/emotes/dabright.png")
    }
    	if (message.content === prefix + "donate"){
        message.channel.sendMessage("Donate  HERE! show some LOVE <3 https://streamjar.tv/tip/chisdealhd")
    }
	
	if (message.content.startsWith(prefix + 'beam')) {
	  var suffix1 = message.content.split(" ").slice(1).join(" ");
	  if(suffix1 == "" || suffix1 == null) return message.channel.sendMessage("Do " + prefix + "beamstats <username?> for Beam User Status!");
    request("https://beam.pro/api/v1/channels/"+suffix1,
    function(err,res,body){
              var data1 = JSON.parse(body);
              if(data1.online){
                  message.channel.sendMessage("", {embed: {
  color: 0xd44a43,
  author: {
    name: suffix1,
    icon_url: data1.user.avatarUrl
  },
  title: 'Beam.pro',
  url: 'https://beam.pro/' + suffix1 + '/',
  description: suffix1 + ' Beam Channel',
  fields: [
    {
      name: 'Followers:',
      value: data1.numFollowers
    },
	{
      name: 'Title:',
      value: data1.name
    },
	{
      name: 'Live viewers:',
      value: data1.viewersCurrent
    },
	{
      name: 'Total Viewers:',
      value: data1.viewersTotal
    },
	{
      name: 'Level:',
      value: data1.user.level
    },
	{
      name: 'Sparks:',
      value: data1.user.sparks
    },
	{
      name: 'AGE Rate:',
      value: data1.audience
    },
	{
      name: ' Partnered',
	  value: data1.partnered
    },
    {
      name: ' Facebook',
	  value: ' [Facebook](' + data1.user.social.facebook + ').'
    },
	{
      name: ' Twitter',
	  value: ' [Twitter](' + data1.user.social.twitter + ').'
    },
	{
      name: ' YouTube',
	  value: ' [Youtube](' + data1.user.social.youtube + ').'
    },
	{
      name: ' Player.me',
	  value: ' [Player.me](' + data1.user.social.player + ').'
    }
    ],
      timestamp: new Date(),
  footer: {
    icon_url: bot.user.avatarURL,
    text: '© ' + bot.user.username
  }
}});
  }else{
                message.channel.sendMessage("", {embed: {
  color: 0xe1ddda,
  author: {
    name: suffix1,
    icon_url: data1.user.avatarUrl
  },
  title: 'Beam.pro',
  url: 'https://beam.pro/' + suffix1 + '/',
  description: suffix1 + ' Beam Channel',
  fields: [
    {
      name: 'Streaming:',
      value: suffix1 + ' is OFFLINE! </3 :('
    }
    ],
      timestamp: new Date(),
  footer: {
    icon_url: bot.user.avatarURL,
    text: '© ' + bot.user.username
  }
}});
  }
  });
  }

	
	if (message.content.startsWith(prefix + 'MCserverchecker')) {
	  var suffix = message.content.split(" ").slice(1).join(" ");
	   if(suffix == "" || suffix == null) return message.channel.sendMessage("Do " + prefix + "MCserverchecker <IP:PORT> for Checking Server is Online for Minecraft!");
    request("https://eu.mc-api.net/v3/server/info/"+suffix+"/json",
    function(err,res,body){
              var data = JSON.parse(body);
              if(data.online){
                  message.channel.sendMessage(suffix
                      +" is Active "
                      +"\n ICON: "+data.favicon
                      +"\n Online Players: "+data.players.online
					  +"\n Max Players: "+data.players.max
					  +"\n Online: "+data.online
					  +"\n Version: "+data.version.name)
              }else{
                message.channel.sendMessage(suffix+" is offline")
            }
        });
    }
	if (message.content.startsWith(prefix + "dance")) {
        fs.readFile('./dance.txt', 'utf8', function(err, data) {
        var updates = data.toString().split('\n')
        message.channel.sendMessage(updates);
            console.log(updates)
            if (err) {
                message.channel.sendMessage("This Command Doesnt WORK!, Please try AGAIN!");
            }

        });
    }
	if (message.content.startsWith(prefix + "google")) {
    var searchQuery = encodeURI(message.content.substring(8))
    var url = "https://www.google.com/search?q=" + searchQuery;
    message.channel.sendMessage(url + "\n Here Is Your Search!");
    }
	if (message.content.startsWith(prefix1 + "8ball")) {
		var suffix = message.content.split(" ").slice(1).join(" ");
      if(suffix == "" || suffix == null) return message.channel.sendMessage("Do " + prefix1 + "8ball <Question?> for your Awser!");
		var mes = ["It is certain", "It is decidedly so" , "Without a doubt" , "Yes, definitely" , "You may rely on it" , "As I see it, yes" , "Most likely" , "Outlook good" , "Yes" , "Signs point to yes" , "Reply hazy try again" , "Ask again later" , "Better not tell you now" , "Cannot predict now" , "Concentrate and ask again" , "Don't count on it" , "My reply is no" , "The stars say no" , "Outlook not so good" , "Very doubtful"];
		message.channel.sendMessage(mes[Math.floor(Math.random() * mes.length)])
	}
	if (message.content.startsWith(prefix1 + "beam me up")) {
		var mes = ["Aye, aye, Captain.", "Sorry, captain. i need more power!", "Right away, captain."];
		message.channel.sendMessage(mes[Math.floor(Math.random() * mes.length)])
	}
	if (message.content.startsWith(prefix1 + "whats my name")) {
		var user = message.author.username;
        message.channel.sendMessage("Your name is: " + user)
    }
	if (message.content.startsWith(prefix1 + "halo4")) {
		message.channel.sendMessage(" Mayday, mayday. This is UNSC FFG-201 Forward Unto Dawn, requesting immediate evac. Survivors aboard.")
	}
	if (message.content.startsWith(prefix1 + "tell me a joke")) {
		var mes = ["What did the mother bee say to the little bee, ```You bee good and beehive yourself.```", "i used to have a fear of hurdles, ```but eventually i got over it```", "Police officer to a driver: “OK, driver’s license, vehicle license, first aid kit and warning triangle. ```Driver: Nah, I’ve already got all that. But how much for that funny Captain’s cap?```", "A German, an American and a Russian walk into a bar.```The bartender looks at them suspiciously and says, “Is this some kind of a joke?```"];
		message.channel.sendMessage(mes[Math.floor(Math.random() * mes.length)])
	}
	if(message.content.startsWith(prefix + "twitch")) {
      var suffix = message.content.split(" ").slice(1).join(" ");
      if(suffix == "" || suffix == null) return message.channel.sendMessage("Do " + prefix + "twitch <username?> for Online Status!");
      request("https://api.twitch.tv/kraken/streams/"+suffix+"?client_id="+twitchkey,
			function(err,res,body){
				if(err) {
					console.log('Error encounterd: '+err);
					message.channel.sendMessage("Horrible stuff happend D:. Try again later.");
					return;
        }
				var stream = JSON.parse(body);
				if(stream.stream){
					message.channel.sendMessage(suffix
					 +" is online, playing "
					 +stream.stream.game
					 +"\n"+stream.stream.channel.status
					 +"\n"+stream.stream.preview.large);
				} else {
					message.channel.sendMessage(suffix+" is offline");
				}
			});
    }
	if(message.content.startsWith(prefix + "sub")) {
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
                                    message.channel.sendMessage("YouTube SUBSCRIBERS: **" + sub.items[0].statistics.subscriberCount + "**");
                                }else message.channel.sendMessage("Nothing found");
                            })
                        break;
                        }
                    }
                }else message.channel.sendMessage("Nothing found");
            }catch(e){
                message.channel.sendMessage(e);
            }
        })
    }

        if (message.content.startsWith(prefix + 'np') || message.content.startsWith(prefix + 'nowplaying')) {
            let queue = getQueue(message.guild.id);
            if (queue.length == 0) return message.channel.sendMessage("No music in queue");
            message.channel.sendMessage(`${rb}xl\nCurrently playing: ${queue[0].title} | by ${queue[0].requested}${rb}`);
        }
		if (message.content === prefix + 'specs') {
    message.channel.sendMessage("", {embed: {
  color: 2590000,
  author: {
    name: bot.user.username,
    icon_url: bot.user.avatarURL
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
    icon_url: bot.user.avatarURL,
    text: '© ' + bot.user.username
  }
}});
  }
        if (message.content.startsWith(prefix + 'queue')) {
            let queue = getQueue(message.guild.id);
            if (queue.length == 0) return message.channel.sendMessage("No music in queue");
            let text = '';
            for (let i = 0; i < queue.length; i++) {
                text += `${(i + 1)}. ${queue[i].title} | requested by ${queue[i].requested}\n`
            };
            message.channel.sendMessage(`${rb}xl\n${text}${rb}`);
        }
    } catch (err) {
        console.log("WELL LADS LOOKS LIKE SOMETHING WENT WRONG! Visit MusicBot server for support (https://discord.gg/EX642f8) and quote this error:\n\n\n" + err.stack)
        errorlog[String(Object.keys(errorlog).length)] = {
            "code": err.code,
            "error": err,
            "stack": err.stack
        }
        fs.writeFile("./data/errors.json", JSON.stringify(errorlog), function(err) {
            if (err) return console.log("Even worse we couldn't write to our error log file! Make sure data/errors.json still exists!");
        })

    }
})

bot.on('ready', function() {
	setInterval(() => {
        fs.readFile('./status.txt', 'utf8', function(err, data) {
        var games = data.toString().split('\n')
        bot.user.setGame(games[Math.floor(Math.random()* games.length)]+ ' | Bot Prefix ' +prefix+' | '+bot.guilds.size+' Connected Servers','https://twitch.tv/'+twitchusername, function(err) {
        console.log(games)
            if (err) {
                message.channel.sendMessage("ERROR has be MADE!" + err);
            }
       });
    });
}, 120000)
});

bot.login(config.token)

// START Roboto SETUP
app.get('/', function(req, res){ res.send(markdown.toHTML("Running DiscordBot\nNode version: " + process.version + "\nDiscord.js version: " + Discord.version)); });
app.get('/prefix', function(req, res){ res.send(markdown.toHTML("Bot Prefix "+prefix )); });
app.get('/invite', function(req, res){ res.send(markdown.toHTML("Bot Invite "+invite )); });
app.get('/stats', function(req, res){ res.send(markdown.toHTML(`Talntrecordz is in ${bot.channels.size} channels on ${bot.guilds.size} servers, for a total of ${bot.users.size} users.` )); });
app.get('/guilds', function(req, res){ res.send("Talntrecordz is in "+ bot.guilds.array().length +" Servers "); });
app.get('/date', function(req, res){ res.send("Talntrecordz Date is "+ started +""); });
app.get('/uptime', function(req, res){ res.send("Talntrecordz Has Been Up For "+ started +""); });
app.get('/specs', function(req, res){ res.send("xl\nSystem info: " + process.platform + "-" + process.arch + " with " + process.release.name + " version " + process.version.slice(1) + "\nProcess info: PID " + process.pid + " at " + process.cwd() + "\nProcess memory usage: " + Math.ceil(process.memoryUsage().heapTotal / 1000000) + " MB\nSystem memory usage: " + Math.ceil((os.totalmem() - os.freemem()) / 1000000) + " of " + Math.ceil(os.totalmem() / 1000000) + " MB\nBot info: ID " + bot.user.id + " #" + bot.user.discriminator + "\n") });

app.listen(process.env.PORT || + serverport);
// END Roboto SETUP

process.on("unhandledRejection", err => {
    console.error("Uncaught We had a promise error, if this keeps happening report to dev server (https://discord.gg/EX642f8): \n" + err.stack);
});


