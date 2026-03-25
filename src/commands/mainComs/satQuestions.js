const {
 	Client,
 	Interaction,
  	MessageFlags,
  	ApplicationCommandOptionType,
	ActionRowBuilder,
  	ButtonBuilder,
 	ButtonStyle,
} = require('discord.js');

const questions = require('../../files/satPracticeQuestions.js');
const giveReward = require('../../utils/giveReward');

totalNumQuestion = 10

module.exports = {
  	name: 'satquestion',
  	description: 'Gives you a SAT practice question',

    callback: async (client, interaction) => {
        // await interaction.deferReply({flags: MessageFlags.Ephemeral});
        await interaction.deferReply();

		const allowedChannelId = '1458883425120550985';

		if (interaction.channelId !== allowedChannelId) {
            return interaction.editReply(`This command can only be used in <#${allowedChannelId}>!`);
        }


        const qNum = Math.floor((Math.random()*256));

		const questionData = questions(qNum);

		const qText = `Question: ${questionData.question}
	A) ${questionData.choice1}
	B) ${questionData.choice2}
	C) ${questionData.choice3}
	D) ${questionData.choice4}
		`

		const buttons = new ActionRowBuilder().addComponents(
			new ButtonBuilder().setCustomId('A').setLabel('A').setStyle(ButtonStyle.Primary),
			new ButtonBuilder().setCustomId('B').setLabel('B').setStyle(ButtonStyle.Primary),
			new ButtonBuilder().setCustomId('C').setLabel('C').setStyle(ButtonStyle.Primary),
			new ButtonBuilder().setCustomId('D').setLabel('D').setStyle(ButtonStyle.Primary)
    	);
		
		// 2. Send the question with buttons
		const response = await interaction.editReply({
			content: qText,
			components: [buttons]
		});

		// 3. Create a Collector to listen for the click
		const collector = response.createMessageComponentCollector({
				filter: (i) => i.user.id === interaction.user.id,
			});

		// 2. Listen for the 'collect' event (the click)
		collector.on('collect', async (confirmation) => {
            const isCorrect = confirmation.customId === questionData.answer;
            const explanation = questionData.explanation?.trim();
            
			const resultMessage = isCorrect 
				? `${qText}\n\n Great job! The answer was ||${questionData.answer}.||`
				: `${qText}\n\n Unfortunately, the correct answer was ||**${questionData.answer}**, but you chose **${confirmation.customId}**.${explanation ? `\n\n**Explanation:** ${explanation}` : ''} ||`;

			if (isCorrect) {
				const user = interaction.member.id;
				const guild = interaction.guild.id;
				const query = {
					userId: user,
					guildId: guild,
				};
				giveReward(query, 5);
				console.log(`Gave 5 xp to user for correct answer`);
			}

			await confirmation.update({ 
				content: resultMessage, 
				components: [] // Remove buttons so they can't answer again
			});

			// Stop the collector since the question is finished
			collector.stop();
		});
    },
};




/*
const {
 	Client,
 	Interaction,
  	MessageFlags,
  	ApplicationCommandOptionType,
	ActionRowBuilder,
  	ButtonBuilder,
 	ButtonStyle,
} = require('discord.js');

const satPracticeQuestions = require('../../files/satPracticeQuestions');


totalNumQuestion = 10

module.exports = {
  	name: 'satquestion',
  	description: 'Gives you a SAT practice question',

    callback: async (client, interaction) => {
        // await interaction.deferReply({flags: MessageFlags.Ephemeral});
        await interaction.deferReply();

		const allowedChannelId = '1458883425120550985';

		if (interaction.channelId !== allowedChannelId) {
            return interaction.editReply(`This command can only be used in <#${allowedChannelId}>!`);
        }


        const qNum = Math.floor((Math.random()*128));

		const questionData = satPracticeQuestions(qNum);

		const qText = `Question: ${questionData.question}
	A) ${questionData.choice1}
	B) ${questionData.choice2}
	C) ${questionData.choice3}
	D) ${questionData.choice4}
		`

		const buttons = new ActionRowBuilder().addComponents(
			new ButtonBuilder().setCustomId('A').setLabel('A').setStyle(ButtonStyle.Primary),
			new ButtonBuilder().setCustomId('B').setLabel('B').setStyle(ButtonStyle.Primary),
			new ButtonBuilder().setCustomId('C').setLabel('C').setStyle(ButtonStyle.Primary),
			new ButtonBuilder().setCustomId('D').setLabel('D').setStyle(ButtonStyle.Primary)
    	);
		
		// 2. Send the question with buttons
		const response = await interaction.editReply({
			content: qText,
			components: [buttons]
		});

		// 3. Create a Collector to listen for the click
		const collector = response.createMessageComponentCollector({
				filter: (i) => i.user.id === interaction.user.id,
			});

		// 2. Listen for the 'collect' event (the click)
		collector.on('collect', async (confirmation) => {
            const isCorrect = confirmation.customId === questionData.answer;
            const explanation = questionData.explanation?.trim();
            
            const resultMessage = isCorrect 
                ? `${qText}\n\n Great job! The answer was ${questionData.answer}.`
                : `${qText}\n\n Unfortunately, the correct answer was **${questionData.answer}**, but you chose **${confirmation.customId}**.${explanation ? `\n\n**Explanation:** ${explanation}` : ''}`;
			
			await confirmation.update({ 
				content: resultMessage, 
				components: [] // Remove buttons so they can't answer again
			});

			// Stop the collector since the question is finished
			collector.stop();
		});
    },
};
*/