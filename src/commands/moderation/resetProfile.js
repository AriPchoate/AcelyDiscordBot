const Level = require('../../models/Level');
const {
  MessageFlags,
  ApplicationCommandOptionType
} = require('discord.js');

const { assignRoles } = require('../../utils/roles');


module.exports = {
    name: 'resetprofile',
    description: "Resets/Makes a users profile",

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

        // const query = {
        //     userId: targetUser.id,
        //     username: targetUser.username,
        //     guildId: interaction.guild.id,
        // };


        // let level = await Level.findOne(query);


        const result = await Level.deleteOne({
            userId: targetUser.id,
            guildId: interaction.guild.id
        });
    
        // console.log("Got to this point")
    
        // if (!level) {
        //   // Create new level if it doesn't exist
        //   level = new Level({
        //     userId: targetUser.id,
        //     username: targetUser.username,
        //     guildId: interaction.guild.id,
        //     xp: 1,
        //     level: 1,
        //   });
        // } else {
        //     level.xp = 1;
        //     level.level = 1;
        // }


        const newLevel = new Level({
            userId: targetUser.id,
            username: targetUser.username,
            guildId: interaction.guildId,
            xp: 1,
            level: 1,
        });

        await newLevel.save();        

        // await level.save();

        const member = await interaction.guild.members.fetch(targetUser.id);
        await assignRoles(member, 1);

        return interaction.editReply({
        content: `Reseted/Created new profile for <@${targetUser.id}>`, flags: MessageFlags.Ephemeral
        });


    },
};