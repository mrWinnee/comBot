const fs = require('fs');
const path = require('path');

function getLimitData() {
    try {
        const filePath = path.join(__dirname, '..', '..', 'data', 'limit.json');
        const fileContent = fs.readFileSync(filePath, 'utf8');
        const data = JSON.parse(fileContent);
        return data;
    } catch (error) {
        console.error('Error reading or parsing limit.json:', error);
        return null; // or you can return a default value or throw an error
    }
}

function setLimitData(data) {
    try {
        const filePath = path.join(__dirname, '..', '..', 'data', 'limit.json');
        fs.writeFileSync(filePath, JSON.stringify({limit: data}), 'utf8');
        return true;
    } catch (error) {
        console.error('Error writing limit.json:', error);
        return false;
    }
}
module.exports = { getLimitData, setLimitData };