const {
  MessageFlags,
  ApplicationCommandOptionType,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require('discord.js');

module.exports = {
  name: 'startingbutton',
  description: 'Sends button for user to enter server',


  devOnly: true, // keeps it dev-only like your getprofile command
//   deleted: true,

  callback: async (client, interaction) => {
    await interaction.deferReply();
    
    const role = interaction.guild.roles.cache.find(r => r.name === 'Member');
    if (!role) {
      return interaction.editReply('The "Member" role does not exist in this server.');
    }

    // Build the button
    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId(`assignRole_${role.id}`) // unique ID for the button
        .setLabel(`Access Server`)
        .setStyle(ButtonStyle.Success)
    );

    // Send the message with the button
    await interaction.editReply({
      content: `Click the button below to **Access the Server**`,
      components: [row],
    });
  },
};
