const Discord = require("discord.js");
const config = require('../../config.json');
const prefix = config.prefix;
const os = require('os')
var upgradeTime = 172801;
var seconds = upgradeTime;
var countdownTimer = setInterval('timer()', 1000);

module.exports = (bot) => {

  function timer() {
    var days        = Math.floor(seconds/24/60/60);
    var hoursLeft   = Math.floor((seconds) - (days*86400));
    var hours       = Math.floor(hoursLeft/3600);
    var minutesLeft = Math.floor((hoursLeft) - (hours*3600));
    var minutes     = Math.floor(minutesLeft/60);
    var remainingSeconds = seconds % 60;
    if (remainingSeconds < 10) {
        remainingSeconds = "0" + remainingSeconds; 
    }
    document.getElementById('countdown').innerHTML = days + ":" + hours + ":" + minutes + ":" + remainingSeconds;
    if (seconds == 0) {
        clearInterval(countdownTimer);
        document.getElementById('countdown').innerHTML = "Completed";
    } else {
        seconds--;
    }


	bot.addTraditionalCommand("chisbday", message => {
		message.delete(1000)
       let embed = new Discord.RichEmbed();
        embed.setColor(0x9900FF)
        embed.setThumbnail("http://chisdealhd.xyz/images/Avatar_chis.png")
        embed.addField("Name: ", "ChisdealHD BirthDay!", true)
        embed.addField("Age will BE!: ", config.chisage, true)
        embed.addField("how may Days Left: ", countdownTimer, true)
        embed.addField("What him be doing: ", config.chisact, true)
    })
}