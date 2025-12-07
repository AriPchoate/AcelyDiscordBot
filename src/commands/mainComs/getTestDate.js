const Level = require('../../models/Level');
const {
  MessageFlags,
  ApplicationCommandOptionType
} = require('discord.js');

module.exports = {
    name: 'gettestdate',
    description: 'Gets your test date',

    callback: async (client, interaction) => {
        await interaction.deferReply({flags: MessageFlags.Ephemeral});

        const query = {
            userId: interaction.user.id,
            username: interaction.user.username,
            guildId: interaction.guild.id,
        };

        const level = await Level.findOne(query);

        if (!level) {
            interaction.editReply("You do not have any test info");
            return;
        };
          
        const date = new Date(level.testDate);
        const readableDate = `${(date.getMonth() + 1).toString().padStart(2, '0')}/` +
                     `${date.getDate().toString().padStart(2, '0')}/` +
                     `${date.getFullYear()}`;

        interaction.editReply({
            content: `Test: ${level.test}\nDate: ${readableDate}`,
            flags: MessageFlags.Ephemeral
        }
    );
  },
};