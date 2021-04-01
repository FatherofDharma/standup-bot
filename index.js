const Discord = require('discord.js');
const client = new Discord.Client();
require('dotenv').config();

client.login(process.env.TOKEN);
let robert = null;
let general = null;

client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
    client.users.fetch(process.env.ROBERT_ID).then(user => { robert = user; });
    client.channels.fetch(process.env.GENERAL).then(channel => { general = channel; });
    alarmClock();
});

const alarmClock = () => {
    const date = new Date();
    const mins = date.getMinutes() < 10 ? `0${date.getMinutes()}` : `${date.getMinutes()}`;
    const day = date.getDay();
    const time = parseInt(`${date.getHours()}${mins}`);

    // alert students
    if ((time === 958 || time === 1328) && (day !== 0 || day !== 6)) {
        general.send(`:parrot: Squawk @here! Get ready for standup!`);
        robert.send('Robert, get ready for standup!');
    }

    // set countdown status
    let timeString = null;
    if (time < 1000) {
        timeString = timeRemaining(date, "10:00:00");
    } else if (time >= 1000 && time < 1330) {
        timeString = timeRemaining(date, "13:30:00");
    } else if (time >= 1330) {
        let tempDate = date;
        let dayMod = 1;
        // loop to add extra days to the countdown if it's Fri or Sat
        while (dayMod + day === 6 || dayMod + day === 7) { dayMod++; }

        tempDate.setDate(date.getDate() + dayMod);
        timeString = timeRemaining(tempDate, "10:00:00");
    }
    // custom statuses on bots are ignored by discord, 'Watching' activity is the best I can do for a status 
    if (timeString) client.user.setActivity(`${timeString} until next standup`, { type: 'WATCHING' });

    // this sets a trigger to call alarmClock whenever the cpu clock's seconds are 0, 
    // updating the bot's status when the clock changes minutes
    setTimeout(alarmClock, 60000 - (date.getTime() % 60000));
};

// create a string of hours & mins remaining until next standup
const timeRemaining = (date, time) => {
    const timeLeft = new Date(`${date.toDateString()} ${time}`) - new Date();
    const hoursLeft = Math.floor((timeLeft / (1000 * 60 * 60)));
    const hs = (hoursLeft !== 1) ? "s" : "";
    const minutesLeft = Math.ceil((timeLeft / 1000) / 60 % 60);
    const ms = (minutesLeft !== 1) ? "s" : "";
    return `${hoursLeft} hour${hs} ${minutesLeft} minute${ms}`;
};