require('dotenv').config();

const {Client, IntentsBitField} = require('discord.js')
const mongoose = require('mongoose');
const eventHandler = require('./handlers/eventHandler');
const { logBotRolePermissions } = require('./utils/checkPermissions');

const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent,
    ],
});


(async() => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected to DB.");
        eventHandler(client);
        client.login(process.env.TOKEN);

        // logBotRolePermissions(client);
        
    } catch (error) {
        console.log(`Error: ${error}`);
    }

        
})();



// '1070086796068786228'