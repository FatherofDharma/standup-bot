const Discord = require('discord.js');
const client = new Discord.Client();
require('dotenv').config();

client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.login(process.env.TOKEN);

client.on('message', message => {
    console.log(`Channel : ${message.channel.name} \n ${message.author.username}: ${message.content}`);

    if (message.content.toLowerCase() === "ping") {
        message.reply('pong');
    }
});
