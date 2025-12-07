const Level = require('../../models/Level');
const {
  MessageFlags,
  ApplicationCommandOptionType
} = require('discord.js');

module.exports = {
    name: 'testdate',
    description: 'Sets your test date',
    options: [
        {
            name: 'test',
            description: 'SAT/ACT',
            type: ApplicationCommandOptionType.String,
            required: true,
            choices: [
            { name: 'SAT', value: 'SAT' },
            { name: 'ACT', value: 'ACT' },
            ],
        },
        {
          name: 'date',
          description: 'MM/DD/YY',
          type: ApplicationCommandOptionType.String,
          required: true,
        },
    ],

    callback: async (client, interaction) => {
        await interaction.deferReply({flags: MessageFlags.Ephemeral});

        const dateRegex = /^(0[1-9]|1[0-2])\/(0[1-9]|[12]\d|3[01])\/\d{2}$/;

        const dateInput = interaction.options.getString("date");

        if (!dateRegex.test(dateInput)) {
          return interaction.editReply({
            content: "❌ Invalid date format. Please use `MM/DD/YY` (e.g. `03/05/26`).",
            flags: MessageFlags.Ephemeral
          });
        }

        // Convert to full date: MM/DD/20YY
        const [month, day, year] = dateInput.split('/');
        const fullYear = parseInt(year) + 2000;
        const date = new Date(`${fullYear}-${month}-${day}`);

        // Final validation check
        if (isNaN(date.getTime())) {
          return interaction.editReply({
            content: "❌ That date couldn't be parsed. Please double-check the format.",
            flags: MessageFlags.Ephemeral
          });
        }



        const query = {
            userId: interaction.user.id,
            username: interaction.user.username,
            guildId: interaction.guild.id,
        };

        const level = await Level.findOne(query);

        if (!level) {
              // Create new level if it doesn't exist
              level = new Level({
                userId: targetUser.id,
                username: targetUser.username,
                guildId: interaction.guild.id,
              });
            }

        level.test = interaction.options.getString("test");
        level.testDate = interaction.options.getString("date");
        await level.save()
        
        console.log(interaction.options.getString("test"), interaction.options.getString("date"));


        interaction.editReply({
            content: `Test: ${level.test}\nDate: ${interaction.options.getString("date")}`,
            flags: MessageFlags.Ephemeral
        }
    );
  },
};