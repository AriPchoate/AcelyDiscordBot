const {
  ApplicationCommandOptionType,
  MessageFlags,
  ChannelType,
} = require('discord.js');
const { assignRoles } = require('../../utils/roles');

// const SetLevel = require('../../utils/setLevel');

module.exports = {
  name: 'ticketclose',
  description: "Close a ticket",

  callback: async (client, interaction) => {
    // 1. Defer publicly to stop the 3-second clock
    await interaction.deferReply();

    const currentChannel = interaction.channel;
    const currentCategory = currentChannel.parent;

    // 2. ERROR CHECK: If not a ticket channel
    if (!currentCategory || currentCategory.id !== '1455016600704126976') {
        // Delete the public "thinking" message
        await interaction.deleteReply();
        // Send a brand new Ephemeral message
        return interaction.followUp({ 
            content: "This is not an active ticket channel.", 
            flags: MessageFlags.Ephemeral 
        }); 
    }

    const CLOSED_CATEGORY_ID = '1459285148116975637'; 
    
    try {
        const targetCategory = interaction.guild.channels.cache.get(CLOSED_CATEGORY_ID) || 
                               await interaction.guild.channels.fetch(CLOSED_CATEGORY_ID);

        if (!targetCategory) throw new Error("Category not found");

        // 3. SUCCESS: Move the channel
        await currentChannel.setParent(targetCategory.id);
        
        // Edit the public "thinking" message with the success text
        return interaction.editReply({
            content: `✅ The ticket has been closed: <#${currentChannel.id}>`
        });

    } catch (error) {
        console.error(error);
        await interaction.deleteReply();
        return interaction.followUp({ 
            content: "Error: Could not move the channel. Check bot permissions.", 
            flags: MessageFlags.Ephemeral 
        });
    }
  }
};

