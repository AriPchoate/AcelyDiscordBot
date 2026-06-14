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

        // Announcements Section
    {
        const sheet = doc.sheetsByTitle["Announcements"];
        const rows = await sheet.getRows();

        // if (rows.length > 0) {
        //     console.log("Available headers in Sheets:", rows[0]._rawData);
        // }

        // const questionsArray = rows.map(row => {
        //     return {
        //         live: row.get('Announcement Live (Y/N)'),
        //         title: row.get('Title'),
        //         descrip: row.get('Description (Should be in Markdown)'),
        //         pollChoice: row.get('Optional Poll (Y/N)') || "",
        //         pollTitle: row.get('Poll Title (Optional)') || "",
        //         choice1: row.get('Choice 1 (Optional)') || "",
        //         choice2: row.get('Choice 2 (Optional)') || "",
        //         choice3: row.get('Choice 3 (Optional)') || "",
        //         choice4: row.get('Choice 4 (Optional)') || "",
        //         choice5: row.get('Choice 5 (Optional)') || "",
        //         choice6: row.get('Choice 6 (Optional)') || "",
        //     };
        // });
        
        const questionsArray = rows.map(row => {
            return {
                live: row.get('Announcement Live (Y/N)'),
                title: row.get('Title'),
                descrip: row.get('Description (Should be in Markdown)'),
                pollChoice: row.get('Optional Poll (Y/N)'),
                pollTitle: row.get('Poll Title (Optional)'),
                choice1: row.get('Choice 1 (Optional)'),
                choice2: row.get('Choice 2 (Optional)'),
                choice3: row.get('Choice 3 (Optional)'),
                choice4: row.get('Choice 4 (Optional)'),
                choice5: row.get('Choice 5 (Optional)'),
            };
        });

        const fileName = "announcements.json"

        const filePath = path.join(__dirname, '..', '..', '.data', fileName);

        // Save the array to a file so the bot can use it without calling Google again
        fs.writeFileSync(filePath, JSON.stringify(questionsArray, null, 2), 'utf-8');

        // console.log("Questions and announcements updated.");

    }



        const sheet = doc.sheetsByTitle["Announcements"];
        const rows = await sheet.getRows();

        const questionsArray = rows.map(row => {
            return {
                test: row.get('SAT or ACT or Both'),
                daysBefore: row.get('How many days before the test date?'),
                descrip: row.get('Announcement (in Markdown)'),
            };
        });

        const fileName = "autoMessages.json"

        const filePath = path.join(__dirname, '..', '..', '.data', fileName);

        // Save the array to a file so the bot can use it without calling Google again
        fs.writeFileSync(filePath, JSON.stringify(questionsArray, null, 2), 'utf-8');

        console.log("Questions, announcements, and messages updated.");



        return;

    } catch (err) {
        console.error("Sync Error:", err);
        throw err;
    }
}