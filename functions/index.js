//index.js

const functions = require('firebase-functions');
const app = require('express')();

const {
    getAllInvitations,
    getAllGuests
} = require('./APIs/invitations')

app.get('/invitations', getAllInvitations);
app.get('/guests', getAllGuests);

exports.api = functions.https.onRequest(app);