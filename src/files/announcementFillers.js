const fs = require('fs');
const path = require('path');

module.exports = (num) => {
    // Point to the JSON file in the same folder
    const filePath = path.join(__dirname, '..', '..', '.data', 'announcements.json');
    
    if (!fs.existsSync(filePath)) return null;

    // Read the file from disk
    const data = fs.readFileSync(filePath, 'utf-8');
    const allAnnouncements = JSON.parse(data);

    // if (questionsList.length === 0) return null;

    // Use modulo to pick a valid index
    // const index = num;
    return allAnnouncements;
};