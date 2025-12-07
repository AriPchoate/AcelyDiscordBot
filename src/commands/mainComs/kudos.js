
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


// const {
//   ApplicationCommandOptionType,
//   MessageFlags,
// } = require('discord.js');
// const Level = require('../../models/Level');
// const LevelCalc = require('../../utils/calculateLevel');
// const { assignRoles } = require('../../utils/roles');

// const cooldowns = new Set();
// const cooldownTime = 3600000;

// // const SetLevel = require('../../utils/setLevel');

// module.exports = {
//   name: 'kudos',
//   description: "Kudos a user",
//   options: [
//     {
//       name: 'target-user',
//       description: 'The user you want to kudos',
//       type: ApplicationCommandOptionType.User,
//       required: true,
//     },
//   ],

//   callback: async (client, interaction) => {
//     await interaction.deferReply({flags: MessageFlags.Ephemeral});


    

//     const targetUser = interaction.options.getUser('target-user');


//     if ( cooldowns.has(targetUser.id)) {
//         return interaction.editReply("You kudos is on cooldown");
//     } 

//     if (!targetUser || !targetUser.id) {
//       return interaction.editReply("That user has been given kudos recently already.");
//     }



//     const query = {
//       userId: targetUser.id,
//       username: targetUser.username,
//       guildId: interaction.guild.id,
//     };

//     let level = await Level.findOne(query);

//     // console.log("Got to this point")

//     if (!level) {
//       // Create new level if it doesn't exist
//       return interaction.editReply("That user is not active");
//     } else {
//       level.xp += 10;
//     }

//     level.level = LevelCalc(level.xp);

//     // Tests function
//     // const testXPs = [0, 50, 150, 200, 300, 900, 1000, 1050, 1200, 2400, 2600];

//     // for (const xp of testXPs) {
//     //   console.log(`XP: ${xp} => Level: ${LevelCalc(xp)}`);
//     // }

//     await level.save();

//     const member = await interaction.guild.members.fetch(targetUser.id);
//     await assignRoles(member, level.level);


//     cooldowns.add(targetUser.id);
//     setTimeout(() => {
//         cooldowns.delete(targetUser.id);
//     }, cooldownTime);

    
//     return interaction.editReply({
//       content: `<@${targetUser.id}> has been given kudos`, flags: MessageFlags.Ephemeral
//     });

//   }
// };


// -----------------------------------------------


// const {
//   ApplicationCommandOptionType,
//   MessageFlags,
// } = require('discord.js');
// const Level = require('../../models/Level');
// const LevelCalc = require('../../utils/calculateLevel');
// const { assignRoles } = require('../../utils/roles');

// // Track cooldowns for givers and receivers separately
// const receiverCooldowns = new Set();
// const giverCooldowns = new Set();
// const cooldownTime = 3600000; // 1 hour

// module.exports = {
//   name: 'kudos',
//   description: "Kudos a user",
//   options: [
//     {
//       name: 'target-user',
//       description: 'The user you want to kudos',
//       type: ApplicationCommandOptionType.User,
//       required: true,
//     },
//   ],

//   callback: async (client, interaction) => {
//     await interaction.deferReply();

//     const targetUser = interaction.options.getUser('target-user');
//     const giverUser = interaction.user;

//     // 🚫 Prevent giving kudos to yourself
//     if (targetUser.id === giverUser.id) {
//       return interaction.editReply( { content: "You can't kudos yourself", flags: MessageFlags.Ephemeral });
//     }

//     // 🚫 Check if the *giver* is on cooldown
//     if (giverCooldowns.has(giverUser.id)) {
//       return interaction.editReply({ content: "You are on cooldown. Please wait before giving kudos again.", flags: MessageFlags.Ephemeral, });
//     }

//     // 🚫 Check if the *receiver* is on cooldown
//     if (receiverCooldowns.has(targetUser.id)) {
//       return interaction.editReply( { content: "That user has been given kudos recently. Try again later.", flags: MessageFlags.Ephemeral });
//     }

//     // Ensure target user exists
//     if (!targetUser || !targetUser.id) {
//       return interaction.editReply( { content: "Invalid user selected.", flags: MessageFlags.Ephemeral } );
//     }

//     const query = {
//       userId: targetUser.id,
//       username: targetUser.username,
//       guildId: interaction.guild.id,
//     };

//     let level = await Level.findOne(query);

//     if (!level) {
//       return interaction.editReply( { content: "That user is not active", flags: MessageFlags.Ephemeral });
//     } else {
//       level.xp += 10;
//     }

//     level.level = LevelCalc(level.xp);
//     await level.save();

//     const member = await interaction.guild.members.fetch(targetUser.id);
//     await assignRoles(member, level.level);

//     // ✅ Add cooldowns for both giver + receiver
//     giverCooldowns.add(giverUser.id);
//     receiverCooldowns.add(targetUser.id);

//     setTimeout(() => giverCooldowns.delete(giverUser.id), cooldownTime);
//     setTimeout(() => receiverCooldowns.delete(targetUser.id), cooldownTime);

//     return interaction.editReply({
//       content: `<@${targetUser.id}> has been given kudos by <@${giverUser.id}>`,
//     });
//   }
// };



// -------------------------------------------------

