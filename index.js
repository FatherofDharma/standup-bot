const Discord = require('discord.js');
const client = new Discord.Client();
require('dotenv').config();

client.login(process.env.TOKEN);

client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
    let robert = client.users.fetch(process.env.ROBERT_ID).then(user => { robert = user; });
    let general = client.channels.fetch(process.env.GENERAL).then(channel => { general = channel; });

    setInterval(() => {
        let date = new Date();
        const mins = date.getMinutes() < 10 ? `0${date.getMinutes()}` : `${date.getMinutes()}`;
        const day = date.getDay();
        const time = parseInt(`${date.getHours()}${mins}`);

        // alert students
        if ((time === 957 || time === 1330) && (day !== 0 || day !== 6)) {
            general.send(`Ding ding @here! Get ready for standup!`);
            robert.send('Robert, get ready for standup!');
        }

        // set countdown status
        let timeString = null;
        if (time < 1000) {
            timeString = standupClock(date, "10:00:00");
        } else if (time >= 1000 && time < 1330) {
            timeString = standupClock(date, "13:30:00");
        } else if (time >= 1330) {
            let tempDate = date;
            let dayMod = 1;
            while (dayMod + day === 6 || dayMod + day === 7) { dayMod++; }
            tempDate.setDate(date.getDate() + dayMod);
            timeString = standupClock(tempDate, "10:00:00");
        }
        if (timeString) client.user.setActivity(`${timeString} until next standup`, { type: 'WATCHING' });
    }, 60000);
});

const standupClock = (date, time) => {
    var timeLeft = new Date(`${date.toDateString()} ${time}`) - new Date();
    var hoursLeft = Math.floor((timeLeft / (1000 * 60 * 60)));
    var minutesLeft = Math.floor((timeLeft / 1000) / 60 % 60);
    return `${hoursLeft} hours ${minutesLeft} minutes.`;
};
