const request = require('request')
const Discord = require("discord.js");
const config = require('../../config.json');
const token = config.authorization;

module.exports = (bot) => {
    bot.client.on('ready', () => {
        require('superagent').post('https://bots.discord.pw/api/bots/ID/stats')
            .set('Authorization', config.authorization)
            .send({ server_count: bot.client.guilds.size })
            .end((err, res) => { 
                if(!err) { console.log('Updated Server Count to https://bots.discord.pw/'); return; }
                console.error(`Failed to Update Server Count for https://bots.discord.pw/`, err);
            }); 
    });
	
	bot.client.on('ready', () => {
        require('superagent').post('https://discordbots.org/api/bots/ID/stats')
            .set('Authorization', config.authorization1)
            .send({ server_count: bot.client.guilds.size })
            .end((err, res) => { 
                if(!err) { console.log('Updated Server Count to https://discordbots.org/'); return; }
                console.error(`Failed to Update Server Count for https://discordbots.org/`, err);
            }); 
    });
}