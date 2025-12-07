const Level = require('../../models/Level');
const {
  Client,
  Interaction,
  MessageFlags,
  ApplicationCommandOptionType
} = require('discord.js');


module.exports = {
    name: 'level',
    description: 'Provides your level and xp',
    options: [
      {
        name: 'target-user',
        description: 'The user whose level you want to see',
        type: ApplicationCommandOptionType?.User,
      }
    ],

    callback: async (client, interaction) => {
      if(!interaction.inGuild()) {
        interaction.reply("You can only run this in a server.");
        return;
      }

      await interaction.deferReply({flags: MessageFlags.Ephemeral});

      const mentionedUserID = interaction.options.get('target-user')?.value;
      const targetUserID = mentionedUserID || interaction.member.id;
      const targetUserObj = await interaction.guild.members.fetch(targetUserID);

      // const query = {
      //     userId: interaction.user.id,
      //     username: interaction.user.username,
      //     guildId: interaction.guild.id,
      // };

      const query = {
        userId: targetUserID,
        guildId: interaction.guild.id,
      }

      const level = await Level.findOne(query);

      if (!level) {
        interaction.editReply(
          "User does not exist or has not chatted yet"
        );
        return;
      }

      interaction.editReply({
          content: `User: ${targetUserObj.displayName}\nLevel: ${level.level}\nXP: ${level.xp}`,
          flags: MessageFlags.Ephemeral
      }
    );
  },
};
