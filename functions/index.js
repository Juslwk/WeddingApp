//index.js

const functions = require('firebase-functions');
const app = require('express')();

const {
    getAllInvitations,
    getAllGuests,
    createInvitations
} = require('./APIs/invitations')

app.get('/invitations', getAllInvitations);
app.get('/guests', getAllGuests);
app.post('/invitations', createInvitations);

exports.api = functions.https.onRequest(app);