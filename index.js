const Discord = require('discord.js');
const client = new Discord.Client();
require('dotenv').config();
const alerts = require('./alerts');

client.login(process.env.TOKEN);
let general = null;

client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
    client.channels.fetch(process.env.GENERAL).then(channel => { general = channel; });
    alarmClock();
});

//found this solution for a dst function in a stack overflow conversation and have adapted it here
const dst = (date) => {
    let jan = new Date(date.getFullYear(), 0, 1).getTimezoneOffset();
    let jul = new Date(date.getFullYear(), 6, 1).getTimezoneOffset();
    return Math.max(jan, jul) != date.getTimezoneOffset();
};

const alarmClock = () => {
    const date = new Date();
    const day = date.getUTCDay();
    const hours = date.getUTCHours();
    const mins = date.getUTCMinutes() < 10 ? `0${date.getUTCMinutes()}` : `${date.getUTCMinutes()}`;
    const time = parseInt(`${hours}${mins}`);
    let localTargetTime;
    const pdtTimes = {
        amWarn: 1655,
        amTime: 1700,
        amTimeRemainStr: "17:00:00",
        pmWarn: 2025,
        pmTime: 2030,
        pmTimeRemainStr: "20:30:00"
    };
    const pstTimes = {
        amWarn: 1755,
        amTime: 1800,
        amTimeRemainStr: "18:00:00",
        pmWarn: 2125,
        pmTime: 2130,
        pmTimeRemainStr: "21:30:00"
    };
    if (dst(date)) {
        localTargetTime = pdtTimes;
    } else {
        localTargetTime = pstTimes;
    }
    // alert students
    if ((time === localTargetTime.amWarn || time === localTargetTime.pmWarn) && day !== 0 && day !== 6) {
        general.send(`Standup is in 5 minutes @here. Be prepared to answer these three questions:
        1.    What did you do yesterday?
        2.    What will you do today?
        3.    What (if anything) is blocking your progress?`);
    } else if ((time === localTargetTime.amTime || time === localTargetTime.pmTime) && day !== 0 && day !== 6) {
        const alert = alerts[Math.floor(Math.random() * alerts.length)];
        general.send(alert);
    }

    // set countdown status
    let timeString = null;
    if (time >= localTargetTime.pmTime || day === 6 || day === 0) {
        let tempDate = date;
        let dayMod = 1;
        while (dayMod + day === 6 || dayMod + day === 7) { dayMod++; }

        tempDate.setDate(new Date(date.getUTCDate() + dayMod));
        timeString = timeRemaining(tempDate, localTargetTime.amTimeRemainStr);
    } else if (time < localTargetTime.amTime) {
        timeString = timeRemaining(date, localTargetTime.amTimeRemainStr);
    } else if (time >= localTargetTime.amTime && time < localTargetTime.pmTime) {
        timeString = timeRemaining(date, localTargetTime.pmTimeRemainStr);
        //fix strings============================================================================
    }

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
