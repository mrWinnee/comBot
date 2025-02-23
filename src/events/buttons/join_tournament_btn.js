const fs = require('fs');
const path = require('path');
const { getJoinedPlayers } = require('../../functions/other/get_joined_players');
const { getBlackListIds } = require('../../functions/other/get_black_list_Ids');
const {getLimitData} = require('../../functions/other/limit_data');
const { createTeams, sendTeamsReport } = require('../../functions/other/create_teams');
const { createTeamsVc } = require('../../functions/other/create_teams_vc');

module.exports = {
    name: 'interactionCreate',
    async execute(interaction, eventObject, client) {
        // Event handling logic goes here
        if (!interaction.isButton()) return;
        if (interaction.customId === 'join_tournament') {

            //check for black list players to prevent them from joining the tournament
            const blackListIds = getBlackListIds();
            if (blackListIds.includes(interaction.user.id)){
                return interaction.reply({ content: 'You are not allowed to join the tournament! **by 3mek <@510601958562856961>**', ephemeral: true });
            }

            //check if the user has already joined the tournament
            let joinedPlayers = getJoinedPlayers();
            if (joinedPlayers.some(player => player.userId === interaction.user.id)) {
                return interaction.reply({ content: 'You have already joined the tournament!', ephemeral: true });
            }
            
            const member = await interaction.guild.members.fetch(interaction.user.id);
            const elo = ['Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond', 'Master', 'Grand Master', 'Challenger', 'Souvreign'];
            const matchingRole = member.roles.cache.find((role) => elo.includes(role.name));
            let roleName = "Grand Master";
            let evaluation = 36;
            if (matchingRole) {
                roleName = matchingRole.name;
                evaluation = (elo.indexOf(roleName) + 1) * (roleName === 'Diamond' ? 2 : roleName === 'Master' ? 3 : roleName === 'Grand Master' ? 4 : roleName === 'Challenger' ? 5 : roleName === 'Souvreign' ? 6 : 1);
            }
                
            joinedPlayers.push({
                username: interaction.user.tag,
                userId: interaction.user.id,
                roleName: roleName,
                evaluation: evaluation,
            });
            fs.writeFileSync(path.join(__dirname, '..', '..', 'data', 'joined_players.json'), JSON.stringify(joinedPlayers), 'utf8');

            const joinedPlayer = await interaction.reply({ content: `<@${interaction.user.id}> joined the tournament` });
            setTimeout(() => {
                joinedPlayer.delete().catch(console.error);
            }, 2000); // 5000 milliseconds = 5 seconds

            const {limit} = getLimitData();
            if (joinedPlayers.length === limit){
                console.log("Tournament is full");
                const createdTeams = createTeams(joinedPlayers);
                const channel = interaction.channel;
                sendTeamsReport(createdTeams.teams, channel);
                await createTeamsVc(createdTeams.teams, "1342828132771823727");
            }
        }
    }
};