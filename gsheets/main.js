/*
-- google-auth-library
Google's officially supported node.js client library for using OAuth 2.0 and authentication with Google APIs. 

Installing the client library:
-- npm install google-auth-library

The Google Developers Console provides a .json file that you can use to configure a JWT (JSON Web Token) auth client and authenticate your requests, for example when using a service account.
*/

const {JWT} = require('google-auth-library');
const {google} = require('googleapis');
//const keys = require('./keys.json');
require('dotenv').config();

let listOfRows = []; // example: [[row1Data], [row2Data], [row3Data], ...]

async function main(listOfRows) {
    
    // Construct a new instance of the JWT class
    const client = new JWT({
        email:process.env.CLIENT_EMAIL,
        key: process.env.PRIVATE_KEY,
        //email: keys.client_email, 
        //key: keys.private_key, 
        scopes: ['https://www.googleapis.com/auth/spreadsheets'],// See, edit, create, and delete all your Google Sheets spreadsheets
    });
    
    // authorize() method: promise that resolves with credentials
    client.authorize(function(error) {
        if(error) {
            console.log(error);
            return;
        } else {
            console.log('Connected!')
        }
    });

    // Define new Google Sheets API object and pass in authentication data
    const gapi = google.sheets({version:'v4', auth: client});
    
    /* Insert new rows and append values */
    let rows = [listOfRows, // new row
                ['test@email.com', 'TestRow'], // new row
                ['test@email.com', 'TestRow']]; // new row
    
    const appendOptions = {
        spreadsheetId: process.env.SHEET_ID, // unique spreadsheet id
        range: process.env.RANGE, // sheet and cell range
        valueInputOption: 'USER_ENTERED', // values will be parsed as if the user typed them into the UI
        insertDataOption: 'INSERT_ROWS', // insert new rows for new data at first blank row
        resource: {values: rows} // new object with data to be passed in
    };

    let response = await gapi.spreadsheets.values.append(appendOptions);
    console.log('Response Status Code:', response.status);
}

main().catch(console.error);