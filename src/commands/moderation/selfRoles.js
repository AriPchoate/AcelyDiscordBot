const {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  MessageFlags,
} = require('discord.js');


const roleGroups = [
  {
    title: 'SAT Test Date (2025)',
    description: 'When are you taking the SAT?',
    roles: [
      '2026 March SAT',
      '2026 May SAT',
      '2026 June SAT',
      '2026 August SAT',
      '2026 October SAT',
      '2026 November SAT',
      '2026 December SAT',
    ],
  },

  {
    title: 'AP Classes — History / Social Science',
    description: 'Select your AP history & social science classes:',
    roles: [
      'AP Micro/Macroeconomics',
      'AP Psychology',
      'AP Human Geography',
      'AP European History',
      'AP World History',
      'AP U.S. History',
      'AP Comparative Government and Politics',
      'AP Art',
    ],
  },

  {
    title: 'AP Classes — English / Foreign Language',
    description: 'Select your AP language classes:',
    roles: [
      'AP Literature and Composition',
      'AP Language and Composition',
      'AP Spanish',
      'AP French',
      'AP German',
      'AP Latin',
      'AP Chinese',
    ],
  },

  {
    title: 'AP Classes — Math / Computer Science',
    description: 'Select your AP math & CS classes:',
    roles: [
      'AP Statistics',
      'AP Calculus AB/BC',
      'AP Pre Calculus',
      'AP Computer Science A / Principles',
    ],
  },

  {
    title: 'AP Classes — Science',
    description: 'Select your AP science classes:',
    roles: [
      'AP Biology',
      'AP Environmental Science',
      'AP Physics (1 + 2)',
      'AP Physics C (E+M)',
      'AP Physics C (Mechanics)',
      'AP Chemistry',
    ],
  },

  {
    title: 'Graduation Class',
    description: 'What class are you?',
    roles: [
      'Class of 2029',
      'Class of 2028',
      'Class of 2027',
      'Class of 2026',
      'Class of 2025',
    ],
  },
];





module.exports = {
  name: 'selfroles',
  description: 'Send self-role buttons',
  devOnly: true,

  callback: async (client, interaction) => {
    await interaction.deferReply( { flags: MessageFlags.Ephemeral } );

    for (const group of roleGroups) {
      const rows = [];
      let currentRow = new ActionRowBuilder();

      for (const roleName of group.roles) {
        const role = interaction.guild.roles.cache.find(
          r => r.name === roleName
        );
        if (!role) continue;

        // Max 5 buttons per row
        if (currentRow.components.length === 5) {
          rows.push(currentRow);
          currentRow = new ActionRowBuilder();
        }

        currentRow.addComponents(
          new ButtonBuilder()
            .setCustomId(`assignRole_${role.id}`)
            .setLabel(role.name)
            .setStyle(ButtonStyle.Primary)
        );
      }

      if (currentRow.components.length > 0) {
        rows.push(currentRow);
      }

      await interaction.channel.send({
        content: `**${group.title}**\n${group.description}`,
        components: rows,
      });
    }

    await interaction.editReply('✅ Self-role messages sent.');
  },
};
