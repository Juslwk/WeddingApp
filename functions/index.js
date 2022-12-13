// Import the Firebase SDK for Google Cloud Functions.
const functions = require('firebase-functions');
const app = require('express')();
// Import and initialize the Firebase Admin SDK.
const admin = require('firebase-admin');
admin.initializeApp();


// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

exports.helloWorld = functions.https.onRequest((request, response) => {
  functions.logger.info("Hello logs!", {structuredData: true});
  response.send("Hello from Firebase!");
});
