const { GoogleSpreadsheet } = require("google-spreadsheet");
const { JWT } = require("google-auth-library");
const credentials = require("../../googleCredentials.json");
const fs = require('fs');
const path = require('path');

// This is where your bot will "save" the questions


module.exports = async () => {
    try {
        const serviceAccountAuth = new JWT({
            email: credentials.client_email,
            key: credentials.private_key,
            scopes: ['https://www.googleapis.com/auth/spreadsheets'],
        });

        const doc = new GoogleSpreadsheet("1LDu9c4EJDmoREm1C630B0dZlXEtk6h_WkFSV0t1mlKc", serviceAccountAuth);
        await doc.loadInfo(); 
        

        tests = ["SAT", "ACT"];

        for (const test of tests) {

            const sheet = doc.sheetsByTitle[test];
            const rows = await sheet.getRows();

            // This is the "Loop" that converts Sheet Rows -> Your Object Format
            const questionsArray = rows.map(row => {
                return {
                    question: row.get('Question:'),
                    choice1: row.get('Choice A'),
                    choice2: row.get('Choice B'),
                    choice3: row.get('Choice C'),
                    choice4: row.get('Choice D'),
                    answer: row.get('Answer'),
                    explanation: row.get('Explanation (N/A):') || "",
                };
            });
            
            const fileName = `${test}questions.json`

            const filePath = path.join(__dirname, '..', '..', '.data', fileName);

            // Save the array to a file so the bot can use it without calling Google again
            fs.writeFileSync(filePath, JSON.stringify(questionsArray, null, 2), 'utf-8');

            console.log(`${test} questions updated.`)


        }

            
        // console.log(`Successfully synced SAT and ACT questions`);
        return;

    } catch (err) {
        console.error("Sync Error:", err);
        throw err;
    }
}