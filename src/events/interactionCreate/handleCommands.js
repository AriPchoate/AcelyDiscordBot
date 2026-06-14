const { devs, testServer } = require('../../../config.json');
const getLocalCommands = require('../../utils/getLocalCommands');
const {
  MessageFlags,
  EmbedBuilder,
} = require('discord.js');

const fs = require('fs');
const path = require('path');
const pollData = require('../../files/pollData.js');

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

  if (interaction.customId.startsWith('choice_')) {
    // await interaction.deferReply({ flags: MessageFlags.Ephemeral});
    
    const pollNumChoice = interaction.customId.split('_')[1];

    const messageId = interaction.message.id;

    const polls = pollData();

    const keys = Object.keys(polls);

    let correctMessageId;
    let choiceName;
    let alreadyVoted = false;

    if (keys.length === 0) {
        console.log("The object is empty. No keys to loop through.");
    } else {
        keys.forEach(key => {
            const p = polls[key];
            // console.log(p)
            // console.log(`Comparing: ${key} === ${messageId}`);
            
            if (key === messageId) {
                correctMessageId = messageId;

                if (polls[key]['voters'].includes(interaction.user.id) ){
                    alreadyVoted = true;
                }

                const pollVotes = polls[key]['votes'];
                const pollKeys = Object.keys(pollVotes);

                choiceName = pollKeys[pollNumChoice];
                // console.log(choiceName);
            }
            
        });
    }

    if (alreadyVoted) {
        return interaction.reply({
            content: 'Your response has already been recorded',
            flags: MessageFlags.Ephemeral,
          });
    }

    
    
    const filePath = path.join(__dirname, '..', '..', '..', '.data', 'pollResults.json');
    // // // 1. Read and Parse
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

    data[correctMessageId]['votes'][choiceName]++;
    data[correctMessageId]['voters'].push(interaction.user.id);

    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

    const results = data[correctMessageId]['votes'];


    const resultsList = Object.entries(results)
        .map(([choice, votes]) => `**${choice}**: ${votes} votes`)
        .join('\n\n');

    const channel = client.channels.cache.get('1486880448637309029');
    const message = await channel.messages.fetch(data[correctMessageId]['logMessageId']);

    const updatedEmbed = new EmbedBuilder()
        .setTitle(`Poll Results from \"${data[correctMessageId]['title']}\"`)
        .setDescription(resultsList || "No votes yet.")
        .setColor(0x2ecc71)
        .setFooter( {text: `Last voter: ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() } )
        .setTimestamp(new Date());

    await message.edit({ embeds: [updatedEmbed] });

    return interaction.reply({
        content: 'Your response has been recorded',
        flags: MessageFlags.Ephemeral,
    });

    
    
  }

}



};