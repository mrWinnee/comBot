const fs = require('fs');
const path = require('path');

function getBlackListIds() {
    const blackListPath = path.join(__dirname, '..', '..', 'data', 'black_list.json');
    let blackListIds = [];

    try {
        const blackListData = fs.readFileSync(blackListPath, 'utf8');
        blackListIds = JSON.parse(blackListData);
    } catch (err) {
        console.error('Error reading black_list.json:', err);
    }

    return blackListIds;
}
module.exports = {getBlackListIds};