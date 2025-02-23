const fs = require('fs');
const path = require('path');

function getTeamsVcIds() {
    try {
        const filePath = path.join(__dirname, '..', '..', 'data', 'teams_vc_ids.json');
        const fileContent = fs.readFileSync(filePath, 'utf8');
        const data = JSON.parse(fileContent);
        return data;
    } catch (error) {
        console.error('Error reading or parsing teams_vc_ids.json:', error);
        return null; // or you can return a default value or throw an error
    }
}

function setTeamsVcIds(data) {
    try {
        const filePath = path.join(__dirname, '..', '..', 'data', 'teams_vc_ids.json');
        fs.writeFileSync(filePath, JSON.stringify(data), 'utf8');
        return true;
    } catch (error) {
        console.error('Error writing teams_vc_ids.json:', error);
        return false;
    }
}

function getTeamVcIdByNumber(teamNumber) {
    const data = getTeamsVcIds();
    console.log("data : ", data);
    const teamVc = data.find(teamVc => teamVc.team === teamNumber);
    if (teamVc) {
        return teamVc.id;
    } else {
        console.error('Team number not found:', teamNumber);
        return null;
    }
}
module.exports = { getTeamsVcIds, setTeamsVcIds, getTeamVcIdByNumber };