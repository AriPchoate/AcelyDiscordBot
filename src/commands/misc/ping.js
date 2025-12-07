module.exports = {
    name: 'ping',
    description: 'Pong!',
    // devOnly: Boolena,
    // testOnly: Boolean,
    // options: Object[],
    // deleted : Boolean

    callback: async(client, interaction) => {
        // interaction.reply(`Pong! ${client.ws.ping}ms`);
        await interaction.deferReply();

        const reply = await interaction.fetchReply()

        const ping = reply.createdTimestamp - interaction.createdTimestamp;

        interaction.editReply(`Pong! Client ${ping}ms | Websocket: ${client.ws.ping}ms`);
    }
};