const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const {getTeamVcIdByNumber} = require('../../functions/other/teams_vc_ids');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('replace-player')
        .setDescription('Replace a player in the tournament with another player.')
        .addIntegerOption(option =>
            option.setName('team_number')
                .setDescription('The team number')
                .setRequired(true))
        .addUserOption(option =>
            option.setName('old_player')
                .setDescription('The Old player')
                .setRequired(true))
        .addUserOption(option =>
            option.setName('new_player')
                .setDescription('The New player')
                .setRequired(true)),
    devOnly: true,

    async execute(interaction, client) {
        // Command execution logic goes here
        const teamNumber = interaction.options.getInteger('team_number');
        const oldPlayer = interaction.options.getUser('old_player');
        const newPlayer = interaction.options.getUser('new_player');
        const channelId = getTeamVcIdByNumber(teamNumber);
        const channel = client.channels.cache.get(channelId);

        if (!channel) {
            return interaction.reply({ content: 'Channel not found.', ephemeral: true });
        }

        try {
            await channel.permissionOverwrites.edit(newPlayer.id, {
                Connect: true, 
            });
        } catch (error) {
            console.error(`Failed to set permissions for member ${newPlayer.username} on channel ${channel.id}: ${error.message}`);
        }

        try {
            await channel.permissionOverwrites.edit(oldPlayer.id, {
                Connect: false, 
            });
        } catch (error) {
            console.error(`Failed to set permissions for member ${oldPlayer.username} on channel ${channel.id}: ${error.message}`);
        }
    }
};