
const google = require('../../utils/googleData.js');

module.exports = {
    name: 'updatequestions',
    description: 'DEV: Updates question bank',
    devOnly: true,
    // testOnly: Boolean,
    // options: Object[],
    // deleted : Boolean

    callback: async (client, interaction) => {
        try {
            // 1. Acknowledge immediately (Starts the 15-minute clock)
            await interaction.deferReply();

            const rowCount = await google(); 

            await interaction.editReply(`Questions updated from Google Sheets`);
        } catch (error) {
            console.error(error);
            if (interaction.deferred) {
                await interaction.editReply("Error: The request took too long or Google failed.");
            }
        }
    }
}