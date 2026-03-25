const Level = require('../models/Level.js');
const {
  MessageFlags
} = require('discord.js');



module.exports = async(query, rewardAmount) => {
    const level = await Level.findOne(query);

    level.xp += rewardAmount


    await level.save();

};
