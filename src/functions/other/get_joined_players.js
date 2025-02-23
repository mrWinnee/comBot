const fs = require('fs');
const path = require('path');

function getJoinedPlayers() {
    const joinedPlayersPath = path.join(__dirname, '..', '..', 'data', 'joined_players.json');
    let joinedPlayers = [];
    try {
        const joinedPlayersData = fs.readFileSync(joinedPlayersPath, 'utf8');
        joinedPlayers = JSON.parse(joinedPlayersData);
    } catch (err) {
        console.error('Error reading black_list.json:', err);
    }
    return joinedPlayers;
}
module.exports = {getJoinedPlayers};