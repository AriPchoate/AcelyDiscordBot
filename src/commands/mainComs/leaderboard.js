const { ApplicationCommandOptionType, EmbedBuilder } = require('discord.js');
const Level = require('../../models/Level');

module.exports = {
    name: 'leaderboard',
    description: "Shows the XP leaderboard for this server",
    callback: async (client, interaction) => {
        await interaction.deferReply();

    try {
        // Fetch all levels for this guild and sort by XP in descending order
        const levels = await Level.find({ guildId: interaction.guild.id })
            .sort({ xp: -1 })
            .limit(10); // Show top 10 users

        if (!levels || levels.length === 0) {
            return interaction.editReply("No users found on the leaderboard yet.");
        }

        // Create an embed for the leaderboard
        const embed = new EmbedBuilder()
            .setTitle('🏆 Engagement Leaderboard')
            .setColor('#0099ff')
            .setDescription(`Top ${levels.length} users by XP in **${interaction.guild.name}**`);

      
        // Add each user to the embed
        try {
            for (const level of levels) {
            const member = await interaction.guild.members.fetch(level.userId);
            const displayName = member.displayName;

            embed.addFields({
            name: `#${levels.indexOf(level) + 1} - ${displayName}`,
            value: `**Level:** ${level.level} | **XP:** ${level.xp}`,
            inline: false,
            });
        }
        } catch (error) {
            console.warn(`Could not fetch member ${level.userId} for leaderboard.`, error);
            // Optionally, you can add a placeholder for missing users
            embed.addFields({
                name: `#${levels.indexOf(level) + 1} - [Left Server]`,
                value: `**XP:** ${level.xp} | **Level:** ${level.level}`,
                inline: false,
          });
        }
        

      await interaction.editReply({ embeds: [embed] });
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
      await interaction.editReply("Failed to fetch the leaderboard. Please try again later.");
    }
  }
};
