const { Schema, model } = require('mongoose');

const levelSchema = new Schema({
    userId: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
    },
    guildId: {
        type: String,
        required: true,
    },
    xp: {
        type: Number,
        default: 0,
    },
    level: {
        type: Number,
        default: 0,
    },
    test: {
        type: String,
        default: "unknown",
    },
    testDate: {
        type: Date,
    }
});

module.exports = model('Level', levelSchema);