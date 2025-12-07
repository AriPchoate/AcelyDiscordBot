const { Client, Message } = require('discord.js');
const calculateLevelXp = require('../../utils/calculateLevel');
const Level = require('../../models/Level');
const { assignRoles } = require('../../utils/roles');
const cooldowns = new Set();
const cooldownTime = 10000;

// Currently engaged - date of last message
// Lose xp or access to a channel if haven't been engaged for 3 months

function getXp() {
  return 1;
}

/**
 *
 * @param {Client} client
 * @param {Message} message
 */
module.exports = async (client, message) => {
    // if (cooldowns.has(message.author.id)) {
    //     message.reply("On Cooldown");
    // }
    if (!message.inGuild() || message.author.bot || cooldowns.has(message.author.id)) return;
    // console.log("Received a message");
    const xpToGive = getXp();

    const query = {
        userId: message.author.id,
        username: message.author.username,
        guildId: message.guild.id,
    };


    try {
        const level = await Level.findOne(query);

        if (level) {
            console.log("Adding xp to existing");
            const currentLevel = calculateLevelXp(level.xp)
            level.xp += xpToGive;
            const newLevel = calculateLevelXp(level.xp)
            // console.log(newLevel)
            if (newLevel > currentLevel) {
                level.level = newLevel;
                // message.channel.send(`${message.member} you have leveled up to **Level ${newLevel}**.`);


                assignRoles(message.member, newLevel); 

            }

            // if (level.xp > calculateLevelXp(level.level)) {
            //     level.xp = 0;
            //     level.level += 1;

            //     message.channel.send(`${message.member} you have leveled up to **level ${level.level}**.`);
            // }

            await level.save().catch((e) => {
                console.log(`Error saving updated level ${e}`);
                return;
            });
            cooldowns.add(message.author.id);
            setTimeout(() => {
                cooldowns.delete(message.author.id);
            }, cooldownTime); //ms
        }

        // if (!level)
        else {
            // create new level
            const user = message.author;
            console.log("Going to make a new entry");
            const newLevel = new Level({
                userId: message.author.id,
                username: message.author.username,
                guildId: message.guild.id,
                xp: 1,
                level: 1,
                // testDate: "unknown",
            });

            await newLevel.save();
            cooldowns.add(message.author.id);
            setTimeout(() => {
                cooldowns.delete(message.author.id);
            }, cooldownTime);
        }
    } catch (error) {
        console.log(`Error giving xp: ${error}`);
    }
    };