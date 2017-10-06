const Discord = require("discord.js");
const config = require('../../config.json');
const prefix = config.prefix;

module.exports = (bot) => {
	bot.addCommand("hey talent 8ball ", (payload) => {
	var message = payload.message
        var suffix = message.content.split(" ").slice(1).join(" ");
      if(suffix == "" || suffix == null) return message.channel.sendMessage("Do " + config.prefix + "hey talent 8ballhey talent 8ball <Question?> for your Awser!");
        var mes = ["It is certain", "It is decidedly so" , "Without a doubt" , "Yes, definitely" , "You may rely on it" , "As I see it, yes" , "Most likely" , "Outlook good" , "Yes" , "Signs point to yes" , "Reply hazy try again" , "Ask again later" , "Better not tell you now" , "Cannot predict now" , "Concentrate and ask again" , "Don't count on it" , "My reply is no" , "The stars say no" , "Outlook not so good" , "Very doubtful"];
        message.channel.send(mes[Math.floor(Math.random() * mes.length)])
    })
}
