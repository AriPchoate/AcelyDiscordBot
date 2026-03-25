const { devs, testServer } = require('../../../config.json');
const getLocalCommands = require('../../utils/getLocalCommands');
const {
  MessageFlags
} = require('discord.js');

module.exports = async (client, interaction) => {
  // if (!interaction.isChatInputCommand()) return;

  if (interaction.isChatInputCommand()) {

  const localCommands = getLocalCommands();

  try {
    const commandObject = localCommands.find(
      (cmd) => cmd.name === interaction.commandName
    );

    if (!commandObject) return;

    // interaction.reply({
    //       content: 'The Acely Bot is still in development. Commands are disabled temporarily.',
    //       flags: MessageFlags.Ephemeral,
    //     });
    // return;

    // if (commandObject.devOnly) {
    //   if (!devs.includes(interaction.member.id)) {
    //     interaction.reply({
    //       content: 'Only developers are allowed to run this command.',
    //       flags: MessageFlags.Ephemeral,
    //     });
    //     return;
    //   }
    // }

    if (commandObject.devOnly) {
        // if(interaction.member.id == '1382821127801278514') return;
      
        const minRole = interaction.guild.roles.cache.get('1412625442665664598');

        if (!minRole) {
            console.error('Minimum role not found');
            return;
        }

        const member = interaction.member;

        const hasPermission = member.roles.cache.some(
            role => role.position >= minRole.position
        );

        if (!hasPermission) {
            await interaction.reply({
                content: 'You do not have permission to run this command.',
                flags: MessageFlags.Ephemeral,
            });
            return;
        }
    }




    if (commandObject.testOnly) {
      if (!(interaction.guild.id === testServer)) {
        interaction.reply({
          content: 'This command cannot be ran here.',
          flags: MessageFlags.Ephemeral,
        });
        return;
      }
    }

    if (commandObject.permissionsRequired?.length) {
      for (const permission of commandObject.permissionsRequired) {
        if (!interaction.member.permissions.has(permission)) {
          interaction.reply({
            content: 'Not enough permissions.',
            flags: MessageFlags.Ephemeral,
          });
          return;
        }
      }
    }

    if (commandObject.botPermissions?.length) {
      for (const permission of commandObject.botPermissions) {
        const bot = interaction.guild.members.me;

        if (!bot.permissions.has(permission)) {
          interaction.reply({
            content: "I don't have enough permissions.",
            flags: MessageFlags.Ephemeral,
          });
          return;
        }
      }
    }

    await commandObject.callback(client, interaction);

  } catch (error) {
    console.log(`There was an error running this command: ${error}`);
  }

  }


if (interaction.isButton()) {
  if (interaction.customId.startsWith('assignRole_')) {
    const roleId = interaction.customId.split('_')[1];
    const role = interaction.guild.roles.cache.get(roleId);

    if (!role) {
      return interaction.reply({
        content: 'Role not found.',
        flags: MessageFlags.Ephemeral,
      });
    }

    const member = interaction.member;

    try {
      // TOGGLE LOGIC
      if (member.roles.cache.has(role.id)) {
        await member.roles.remove(role);
        return interaction.reply({
          content: `Removed the **${role.name}** role.`,
          flags: MessageFlags.Ephemeral,
        });
      } else {
        await member.roles.add(role);
        return interaction.reply({
          content: `Added the **${role.name}** role.`,
          flags: MessageFlags.Ephemeral,
        });
      }
    } catch (err) {
      console.error(err);
      return interaction.reply({
        content: 'Failed to update your role.',
        flags: MessageFlags.Ephemeral,
      });
    }
  }
}








};