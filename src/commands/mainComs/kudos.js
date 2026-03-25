
const { ApplicationCommandOptionType , MessageFlags } = require('discord.js');
const Level = require('../../models/Level');
const LevelCalc = require('../../utils/calculateLevel');
const { assignRoles } = require('../../utils/roles');

// Track cooldowns for givers and receivers separately
const receiverCooldowns = new Set();
const giverCooldowns = new Set();
const cooldownTime = 3600000; // 1 hour

module.exports = {
  name: 'kudos',
  description: "Kudos a user",
  options: [
    {
      name: 'target-user',
      description: 'The user you want to kudos',
      type: ApplicationCommandOptionType.User,
      required: true,
    },
  ],

  callback: async (client, interaction) => {
    const targetUser = interaction.options.getUser('target-user');
    const giverUser = interaction.user;

    // ----- quick validation (no defer yet) -----
    if (!targetUser || !targetUser.id) {
      return interaction.reply({ content: "Invalid user selected.", flags: MessageFlags.Ephemeral });
    }

    if (targetUser.id === giverUser.id) {
      return interaction.reply({ content: "You can't kudos yourself.", flags: MessageFlags.Ephemeral });
    }

    if (giverCooldowns.has(giverUser.id)) {
      return interaction.reply({ content: "You are on cooldown. Please wait before giving kudos again.", flags: MessageFlags.Ephemeral });
    }

    if (receiverCooldowns.has(targetUser.id)) {
      return interaction.reply({ content: "That user has been given kudos recently. Try again later.", flags: MessageFlags.Ephemeral });
    }

    // From here on we expect success → make the response public
    await interaction.deferReply(); // public by default

    try {
      const query = {
        userId: targetUser.id,
        username: targetUser.username,
        guildId: interaction.guild.id,
      };

      let level = await Level.findOne(query);
      if (!level) {
        // Post-defer error: remove public placeholder, send private error
        await interaction.deleteReply().catch(() => {});
        return interaction.followUp({ content: "That user is not active.", flags: MessageFlags.Ephemeral });
      }

      level.xp += 10;
      level.level = LevelCalc(level.xp);
      await level.save();

      const member = await interaction.guild.members.fetch(targetUser.id);
      await assignRoles(member, level.level);

      // cooldowns only after success
      giverCooldowns.add(giverUser.id);
      receiverCooldowns.add(targetUser.id);
      setTimeout(() => giverCooldowns.delete(giverUser.id), cooldownTime);
      setTimeout(() => receiverCooldowns.delete(targetUser.id), cooldownTime);

      return interaction.editReply({
        content: `<@${targetUser.id}> has been given kudos by <@${giverUser.id}>`,
      });
    } catch (err) {
      console.error('kudos error:', err);
      // keep the error private even though we deferred publicly
      try { await interaction.deleteReply(); } catch {}
      return interaction.followUp({
        content: "Something went wrong while giving kudos. Please try again.",
        flags: MessageFlags.Ephemeral,
      });
    }
  }
};
