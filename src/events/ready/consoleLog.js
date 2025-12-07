const {ActivityType} = require('discord.js');
const scheduleSend = require('../schedulers/scheduleSend');

module.exports = (client) => {
    console.log(`DEPLOYED ${client.user.tag} is online :)`);
    // client.user.setUsername('Acely Test Bot');
    client.user.setActivity({
        name: "Doing",
        type: ActivityType.Custom,
        state: "SAT | ACT Prep"
    });


    scheduleSend(client);
};
