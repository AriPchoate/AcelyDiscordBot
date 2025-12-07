const Level = require('../../models/Level');
const {
  MessageFlags,
  ApplicationCommandOptionType
} = require('discord.js');


module.exports = {
    name: 'getprofile',
    description: "Gets a users profile",

    options: [
    {
      name: 'target-user',
      description: 'Target user',
      type: ApplicationCommandOptionType.User,
      required: true,
    }
    ],
    devOnly: true,


    callback: async (client, interaction) => {
        await interaction.deferReply({flags: MessageFlags.Ephemeral});

        const targetUser = interaction.options.getUser('target-user');

        if (!targetUser || !targetUser.id) {
        return interaction.editReply("That user doesn't exist in this server.");
        }

        const query = {
            userId: targetUser.id,
            username: targetUser.username,
            guildId: interaction.guild.id,
        };

        let level = await Level.findOne(query);
        let readableDate = ``;


        if (!level) {
        return interaction.editReply("No profile found for that user.");
        }

        if (!level.testDate) {
            readableDate = "No save date";
        } else {
            const date = level.testDate;

            readableDate = `${(date.getMonth() + 1).toString().padStart(2, '0')}/` +
                    `${date.getDate().toString().padStart(2, '0')}/` +
                    `${date.getFullYear()}`;
        }
        

        interaction.editReply({
            content: `Username: ${level.username} \nLevel: ${level.level} \nXP: ${level.xp} \nTest: ${level.test} \nTest Date: ${readableDate}`
            }
        );
    },
};
