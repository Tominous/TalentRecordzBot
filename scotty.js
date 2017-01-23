"use strict";
const prefix = "&!";
const l = require('stringformat');
const startTime = Date.now();
const fs = require('fs');
const os = require("os");
const Discord = require('discord.js');
const ytdl = require('ytdl-core');
l.extendString('format');
var otherFile = require('./testbot/bot.js')
const client = new Discord.Client();


const comingsoon = "This Command coming soon, still on progressed";

const inChannel = false;

client.on('ready', () => {
  console.log('Help Setup!');
});

client.on('message', message => {
  if (message.content === prefix + 'help') {
    message.channel.sendMessage("", {embed: {
  color: 2590000,
  author: {
    name: client.user.username,
    icon_url: client.user.avatarURL
  },
  title: 'Commands',
  url: 'https://docs.google.com/spreadsheets/d/1FIdXM5jG7QauYyiS3y92a-UCRapRmq8yl1axNzQZyN4/edit#gid=0',
  description: 'Where all commands Kept at.',
  fields: [
    {
      name: 'Created',
      value: 'This bot been Created by ChisdealHD_YT in Discord.js.'
    },
    {
      name: 'Website',
      value: 'Website still on progressed [Website](http://google.com) Not up YET!.'
    },
    {
      name: 'Partnerships',
      value: 'We dont have Parnerships YET!.'
    }
  ],
  timestamp: new Date(),
  footer: {
    icon_url: client.user.avatarURL,
    text: '© TalentRecordz'
  }
}});
  }
});
	

client.login('TOKEN