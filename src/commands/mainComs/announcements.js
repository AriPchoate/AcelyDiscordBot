const {
  Client,
  Interaction,
  MessageFlags,
  AttachmentBuilder,
  	ActionRowBuilder,
  	ButtonBuilder,
 	ButtonStyle,
} = require('discord.js');

const Level = require('../../models/Level');
const announcementFillers = require('../../files/announcementFillers');



module.exports = {

    name: 'announcements',
    description: 'devonly',
    devOnly: true,

    callback: async(client, interaction) => {
        // interaction.reply(`Pong! ${client.ws.ping}ms`);
        await interaction.deferReply({flags: MessageFlags.Ephemeral});

        // Need button logic to allow someone to select the announcement they want


        const allAnnouncements = announcementFillers();

        


        const row = new ActionRowBuilder();

        console.log("Working through this 1");
        console.log(allAnnouncements.length);

        for (let i=0; i < allAnnouncements.length; i++) {
            announc = allAnnouncements[i];


            if (announc.live != "Y") {
                continue; 
            }
            
            const button = new ButtonBuilder()
                .setLabel(announc.title)
                .setCustomId(`${i}`)
                .setStyle(ButtonStyle.Primary)

            row.addComponents(button);
        };

        console.log("Working through this 2");

        const response = await interaction.editReply({
            content: "Available announcements. If you do not see the one you would like, run /updatequestions.",
            components: [row]
        });


        const collector = response.createMessageComponentCollector({
                filter: (i) => i.user.id === interaction.user.id,
            });

        // 2. Listen for the 'collect' event (the click)
        collector.on('collect', async (confirmation) => {
            const fs = require('fs');
            const path = require('path');

            const finalAnnouncement = allAnnouncements[confirmation.customId];
            const resultMessage = `**${finalAnnouncement.title}** \n${finalAnnouncement.descrip}`;

            await confirmation.update({ 
                content: "Announcement has been sent below (this is private)", 
                components: [] 
            });

            const choices = [finalAnnouncement.choice1, finalAnnouncement.choice2, finalAnnouncement.choice3, finalAnnouncement.choice4, finalAnnouncement.choice5, finalAnnouncement.choice6];
            const pollRows = new ActionRowBuilder();
            let hasButtons = false;
            const voteCounts = {}; 

            choices.forEach((choice, index) => {
                if (!choice) return; 
                hasButtons = true;
                voteCounts[choice] = 0; 

                const button = new ButtonBuilder()
                    .setLabel(choice)
                    .setCustomId(`choice_${index}`) // Keep ID simple for the global handler
                    .setStyle(ButtonStyle.Primary);
                    
                pollRows.addComponents(button);
            });

            const followAnnouncement = { content: resultMessage, ephemeral: false };
            if (hasButtons) followAnnouncement.components = [pollRows];

            // 1. Send the public poll message
            const pollMessage = await interaction.followUp(followAnnouncement);

            // 2. SETUP THE LOG CHANNEL (Crucial: Define variables here)
            const logChannelId = '1486880448637309029';
            const logChannel = await client.channels.fetch(logChannelId).catch(() => null);
            let logMessage; 

            if (logChannel && hasButtons) {
                try {
                    logMessage = await logChannel.send({
                        embeds: [{
                            title: `Live Results: ${finalAnnouncement.title}`,
                            description: "Waiting for first vote...",
                            color: 0x3498db
                        }]
                    });
                } catch (err) {
                    console.error("Missing Access to Log Channel.");
                }
            }
            
            // 3. SAVE TO JSON FILE (Now logMessage and logChannel are defined)
            if (hasButtons && logMessage) {
                const filePath = path.join(__dirname, '..', '..', '..', '.data', 'pollResults.json');
                
                let pollDB = {};
                if (fs.existsSync(filePath)) {
                    pollDB = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
                }

                pollDB[pollMessage.id] = {
                    title: finalAnnouncement.title,
                    logMessageId: logMessage.id,
                    logChannelId: logChannel.id,
                    choices: choices.filter(Boolean),
                    votes: voteCounts,
                    voters: []
                };

                fs.writeFileSync(filePath, JSON.stringify(pollDB, null, 2));
            }

            collector.stop();
        });      

        // interaction.editReply(`Pong! Client ${ping}ms | Websocket: ${client.ws.ping}ms`);
    }
};