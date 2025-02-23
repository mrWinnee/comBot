
const config = require("../../../config.json");
const client = require("../../index.js");
const { getTeamsVcIds, setTeamsVcIds } = require("../other/teams_vc_ids");

async function createTeamsVc(teams, parentCategoryId) {
    const guild = await client.guilds.fetch(config.bot.developerCommandsServerIds[0]);
    const voiceChannels = [];
    for (let i = 1; i <= teams.length; i++) {
        const channel = await guild.channels.create({
            name: `🚩 team ${i}`,
            type: 2, // Channel type: Voice Channel
            parent: parentCategoryId, // Parent category ID
        });
        voiceChannels.push(channel.id);

        // Prevent everyone from connecting to the channel
        try {
            await channel.permissionOverwrites.edit(guild.roles.everyone, {
                Connect: false, 
            });
        } catch (error) {
            console.error(`Failed to set permissions for everyone on channel ${channel.id}: ${error.message}`);
        }

        // Allow team members to connect to the channel
        for (const member of teams[i - 1]) {
            try {
                await channel.permissionOverwrites.edit(member.userId, {
                    Connect: true, 
                });
            } catch (error) {
                console.error(`Failed to set permissions for member ${member.userId} on channel ${channel.id}: ${error.message}`);
            }
        }

        // Move team members to the channel
        for (const member of teams[i - 1]) {
            try {
                const guildMember = await guild.members.fetch(member.userId);
                await guildMember.voice.setChannel(channel.id);
            } catch (error) {
                console.error(`Failed to move member ${member.username} to channel ${channel.id}: ${error.rawError.message}`); // Log error message
            }
        }

        // send the ids of each team to teams_vc_ids.json
        const teamsVcIds = getTeamsVcIds();
        teamsVcIds.push({ team: i, id: channel.id });
        setTeamsVcIds(teamsVcIds);

    }


    //return voiceChannels;
}



module.exports = { createTeamsVc };