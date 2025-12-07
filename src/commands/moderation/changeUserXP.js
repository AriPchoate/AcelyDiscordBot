const {
  ApplicationCommandOptionType,
  MessageFlags,
} = require('discord.js');
const Level = require('../../models/Level');
const LevelCalc = require('../../utils/calculateLevel');
const { assignRoles } = require('../../utils/roles');

// const SetLevel = require('../../utils/setLevel');

module.exports = {
  name: 'setxp',
  description: "Sets a user's XP",
  options: [
    {
      name: 'target-user',
      description: 'The user you want to set XP for. Dev Only',
      type: ApplicationCommandOptionType.User,
      required: true,
    },
    {
      name: 'newxp',
      description: 'The new XP value',
      type: ApplicationCommandOptionType.Number,
      required: true,
    }
  ],
  devOnly: true,

  callback: async (client, interaction) => {
    await interaction.deferReply({flags: MessageFlags.Ephemeral});
    // await interaction.deferReply({ ephermeral: true});

    const targetUser = interaction.options.getUser('target-user');
    const newXP = interaction.options.getNumber('newxp');

    if (!targetUser || !targetUser.id) {
      return interaction.editReply("That user doesn't exist in this server.");
    }

    const query = {
      userId: targetUser.id,
      username: targetUser.username,
      guildId: interaction.guild.id,
    };

    let level = await Level.findOne(query);

    // console.log("Got to this point")

    if (!level) {
      // Create new level if it doesn't exist
      level = new Level({
        userId: targetUser.id,
        username: targetUser.username,
        guildId: interaction.guild.id,
        xp: newXP,
        level: LevelCalc(level.xp),
      });
    } else {
      level.xp = newXP;
    }

    level.level = LevelCalc(level.xp);

    // Tests function
    // const testXPs = [0, 50, 150, 200, 300, 900, 1000, 1050, 1200, 2400, 2600];

    // for (const xp of testXPs) {
    //   console.log(`XP: ${xp} => Level: ${LevelCalc(xp)}`);
    // }

    await level.save();

    


    const member = await interaction.guild.members.fetch(targetUser.id);

    const botMember = member.guild.members.me;

    console.log("Bot permissions in guild:", botMember.permissions.toArray());

    const channelPerms = interaction.channel.permissionsFor(botMember);
    console.log("Bot permissions in channel:", channelPerms.toArray());

    console.log(member);



    const role = member.guild.roles.cache.get('1411541634423718020');
    console.log({
      roleName: role.name,
      rolePosition: role.position,
      managed: role.managed,
      permissions: role.permissions.toArray(),
    });


    await assignRoles(member, level.level);

    return interaction.editReply({
      content: `Set XP for <@${targetUser.id}> to ${level.xp}. Now level ${level.level}`, flags: MessageFlags.Ephemeral
    });
  }
};





