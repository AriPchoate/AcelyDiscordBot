const fs = require('fs');
const path = require('path');

module.exports = () => {
    // Point to the JSON file in the same folder
    const filePath = path.join(__dirname, '..', '..', '.data', 'pollResults.json');
    
    if (!fs.existsSync(filePath)) return null;

    // Read the file from disk
    const data = fs.readFileSync(filePath, 'utf-8');
    const polls = JSON.parse(data);

    if (polls.length === 0) return null;

    return polls;
};