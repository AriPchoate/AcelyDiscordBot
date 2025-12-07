const {
  ApplicationCommandOptionType,
  MessageFlags,
} = require('discord.js');
const Level = require('../../models/Level');
const LevelCalc = require('../../utils/calculateLevel');
const { assignRoles } = require('../../utils/roles');

// const SetLevel = require('../../utils/setLevel');

module.exports = {
  name: 'ticket',
  description: "Create a support request to communicate with admin",
  options: [
    {
      name: 'request',
      description: 'Description of the issue/request',
      type: ApplicationCommandOptionType.String,
      required: true,
    }
  ],
  devOnly: true, // need to change to false when implemented
  // deleted: true,

  callback: async (client, interaction) => {

    await interaction.deferReply({ flags: MessageFlags.Ephemeral });


    const issue = interaction.options.getString("request");
    const guild = interaction.guild;
    const member = interaction.member;

    // Minimum staff role
    const minRoleId = "1095875195836829790"; // replace with your lowest staff role ID
    const minRole = guild.roles.cache.get(minRoleId);

    const staffRoles = guild.roles.cache.filter(role => role.position >= minRole.position);

    const ticketCategory = guild.channels.cache.find(
        c => c.name.toLowerCase() === "not viewable currently" && c.type === 4
    );


    const channelName = `ticket-${member.user.username}-${Date.now().toString().slice(-4)}`;

    if (!ticketCategory) {
        // Stop the command and inform the user
        return interaction.editReply({
            content: "Ticket category 'Not Viewable Currently' not found! Please create it first.",
            flags: MessageFlags.Ephemeral
        });
    }



    const ticketChannel = await guild.channels.create({
        name: channelName,
        type: 0,
        parent: ticketCategory.id,
        permissionOverwrites: [
            { id: guild.id, deny: ["ViewChannel"] },
            { id: member.id, allow: ["ViewChannel", "SendMessages", "ReadMessageHistory"] },
            { id: client.user.id, allow: ["ViewChannel", "SendMessages"] },
            ...staffRoles.map(role => ({
                id: role.id,
                allow: ["ViewChannel", "SendMessages", "ReadMessageHistory"]
            }))
        ]
    });

    await ticketChannel.send({
        content:
`📩 **New Ticket Created**
**User:** ${member.user}
**Issue:** ${issue}

An admin member will be with you soon.`
    });

    return interaction.editReply({
        content: `Your ticket has been created: ${ticketChannel}`,
        flags: MessageFlags.Ephemeral
    });
  }
};


