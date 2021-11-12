//returns a random alert string with the role being @mentioned
exports.getRandomAlert = (role) => {
  let alerts = [
    `:parrot: Squawk ${role}! It is time for standup!`,
    `:alarm_clock: Ding ding ${role}! It is time for standup!`,
    `:hourglass: The time has come for for standup ${role}!`,
    `:guitar: It's time to rock ${role}!`,
    `:kangaroo: It is time hop into standup ${role}!`,
    `:postal_horn: Tooooot, standup  ${role}!`,
    `:crystal_ball: :woman_mage_tone2: I see a standup starting ${role}!`,
    `:bell: Ding ding ${role}! It is time for standup!`,
    `:satellite: Incoming message ${role}.... "standup is starting!"`,
    `:bellhop: Ding ding ${role}! Time for standup!`,
    `:warning: :warning: :warning: Standup is starting ${role}! :warning: :warning: :warning: `
  ];
  return alerts[Math.floor(Math.random() * alerts.length)];
};


//FUTURE work: possibly turn into class and move alerts array out of function