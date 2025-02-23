const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const {setLimitData} = require('../../functions/other/limit_data');
module.exports = {
    data: new SlashCommandBuilder()
        .setName('join-tournament')
        .setDescription('this command creates a button for joining the tournament.')
        .addIntegerOption(option =>
            option.setName('limit')
                .setDescription('the limit number of members in the tournament.')
                .setRequired(true)),
    devOnly:true,
    async execute(interaction, client) {
        // Command execution logic goes here
        const limit = interaction.options.getInteger('limit');
        if (limit % 5 != 0) return interaction.reply({ content: 'The limit must be a multiple of 5'});
        setLimitData(limit);
        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId("join_tournament")
                .setEmoji("🎮")
                .setLabel("Join Tournament")
                .setStyle(ButtonStyle.Primary)
                .setDisabled(false),
        );
        await interaction.reply({
            content: `**You want to join the tournament ! Click the button below ⬇**`,
            components: [row],
        });
    }
};