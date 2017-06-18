const Discord = require("discord.js");
const config = require('../../config.json');

module.exports = (bot) => {

	bot.addTraditionalCommand("mixer emotes :beam", message => {
		message.delete(1000)
        message.channel.send({ files: ['./images/beam.png'] })
    })

    bot.addTraditionalCommand("mixer emotes :cactus", message => {
		message.delete(1000)
        message.channel.send({ files: ['./images/cactus.png'] })
    })

    bot.addTraditionalCommand("mixer emotes :cat", message => {
		message.delete(1000)
        message.channel.send({ files: ['./images/cat.png'] })
    })

    bot.addTraditionalCommand("mixer emotes :chicken", message => {
		message.delete(1000)
        message.channel.send({ files: ['./images/chicken.png'] })
    })

    bot.addTraditionalCommand("mixer emotes :dog", message => {
		message.delete(1000)
        message.channel.send({ files: ['./images/dog.png'] })
    })

    bot.addTraditionalCommand("mixer emotes :facepalm", message => {
		message.delete(1000)
        message.channel.send({ files: ['./images/facepalm.png'] })
    })

    bot.addTraditionalCommand("mixer emotes :fish", message => {
		message.delete(1000)
        message.channel.send({ files: ['./images/fish.png'] })
    })

    bot.addTraditionalCommand("mixer emotes :mappa", message => {
		message.delete(1000)
        message.channel.send({ files: ['./images/mappa.png'] })
    })

    bot.addTraditionalCommand("mixer emotes :salute", message => {
		message.delete(1000)
        message.channel.send({ files: ['./images/salute.png'] })
    })

    bot.addTraditionalCommand("mixer emotes :sloth", message => {
		message.delete(1000)
        message.channel.send({ files: ['./images/sloth.png'] })
    })

    bot.addTraditionalCommand("mixer emotes :swag", message => {
		message.delete(1000)
        message.channel.send({ files: ['./images/swag.png'] })
    })
 
    bot.addTraditionalCommand("mixer emotes :termital", message => {
		message.delete(1000)
        message.channel.send({ files: ['./images/termital.png'] })
    })

    bot.addTraditionalCommand("mixer emotes :whoappa", message => {
		message.delete(1000)
        message.channel.send({ files: ['./images/whoappa.png'] })
    })

    bot.addTraditionalCommand("mixer emotes :yolo", message => {
		message.delete(1000)
        message.channel.send({ files: ['./images/yolo.png'] })
    })
}