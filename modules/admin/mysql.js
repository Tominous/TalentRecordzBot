const request = require('request')
const Discord = require("discord.js");
var mysql = require('mysql');
const config = require('../../config.json');
const token = config.authorization;

module.exports = (bot) => {
bot.client.on('ready', () => {
	var connection = mysql.createConnection({
	host: "localhost",
	user: "root",
	password: "password",
	database: "database"
	});
	connection.connect();	

	bot.client.on("serverCreated", function(server) {
		console.log("Trying to insert server " + bot.client.guilds.name + " into database");
			var info = {
				"servername": "'" + bot.client.guilds.name + "'",
				"serverid": bot.client.guilds.id,
				"ownerid": bot.client.guilds.owner.id,
				"prefix": "&!"
			}

		connection.query("INSERT INTO servers SET ?", info, function(error) {
			if (error) {
				console.log(error);
				return;
			}
			console.log("Guild Inserted!");
		})
	})

	bot.client.on("serverDeleted", function(server) {
		console.log("Attempting to remove " + bot.client.guilds.name + " from the database!");
		connection.query("DELETE FROM servers WHERE serverid = '" + bot.client.guilds.id + "'", function(error) {
			if (error) {
				console.log(error);
				return;
			}
			console.log("Guild Removed!");
		})
	})
});
}