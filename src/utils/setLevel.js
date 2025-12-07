const Level = require('../../models/Level');
const calculateLevel = require('../../calculateLevel');
const {
  MessageFlags
} = require('discord.js');



module.exports = async(query) => {
    const level = await Level.findOne(query);

    level.level = calculateLevel(level.xp);
    await level.save();

};
