const Discord = require('discord.js');
const client = new Discord.Client();
require('dotenv').config();
const keepRunning = require('./keepRunning');
keepRunning();

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
    const day = date.getUTCDay();
    const hours = date.getUTCHours();
    const mins = date.getUTCMinutes() < 10 ? `0${date.getUTCMinutes()}` : `${date.getUTCMinutes()}`;
    const time = parseInt(`${hours}${mins}`);

    // alert students
    if ((time === 1658 || time === 2028) && day !== 0 && day !== 6) {
        console.log("standup triggered");
        general.send(`:parrot: Squawk @here! Get ready for standup!`);
        robert.send('Robert, get ready for standup!');
    }

    // set countdown status
    let timeString = null;
    if (time < 1700 && day !== 6 && day !== 0) {
        timeString = timeRemaining(date, "17:00:00");
    } else if (time >= 1700 && time <= 2030 && day != 6 && day !== 0) {
        timeString = timeRemaining(date, "20:30:00");
    } else if (time >= 2030 || day === 5 || day === 6) {
        let tempDate = date;
        let dayMod = 1;
        // loop to add extra days to the countdown if it's Fri or Sat
        while (dayMod + day === 6 || dayMod + day === 7) {
            console.log(dayMod + day);
            dayMod++;
        }
        tempDate.setDate(new Date(date.getUTCDate() + dayMod));
        timeString = timeRemaining(tempDate, "17:00:00");
    };

    // custom statuses on bots are ignored by discord, 'Watching' activity is the best I can do for a status 
    if (timeString) client.user.setActivity(`${timeString} until next standup`, { type: 'WATCHING' });
    console.log(timeString);
    // this sets a trigger to call alarmClock whenever the cpu clock's seconds are 0, 
    // updating the bot's status when the clock changes minutes
    setTimeout(alarmClock, 60000 - (date.getTime() % 60000));
};

// create a string of hours & mins remaining until next standup
const timeRemaining = (date, time) => {
    const dateString = date.toUTCString().slice(0, date.toUTCString().length - 13);
    const nextStandup = new Date(`${dateString} ${time} UTC`);
    console.log(nextStandup);
    const timeLeft = nextStandup - Date.now();
    let hoursLeft = Math.floor((timeLeft / (1000 * 60 * 60)));
    let minutesLeft = Math.ceil((timeLeft / 1000) / 60 % 60);
    if (minutesLeft === 60) {
        minutesLeft = 0;
        hoursLeft++;
    }
    const hs = (hoursLeft !== 1) ? "s" : "";
    const ms = (minutesLeft !== 1) ? "s" : "";
    return `${hoursLeft} hour${hs} ${minutesLeft} minute${ms}`;
};


// this doesn't work for the next day the way it's written, after midnight UTC on friday it starts triggering for the next day

// the entire if should be rewritten to just subract the next time from now