/**
 * To find your Firebase config object:
 * 
 * 1. Go to your [Project settings in the Firebase console](https://console.firebase.google.com/project/_/settings/general/)
 * 2. In the "Your apps" card, select the nickname of the app for which you need a config object.
 * 3. Select Config from the Firebase SDK snippet pane.
 * 4. Copy the config object snippet, then add it here.
 */
const config = {
  apiKey: "AIzaSyDuVtPSYJujM3nJdGF0z2jTYT2dIrymWEU",
  authDomain: "wedding-9b3ef.firebaseapp.com",
  projectId: "wedding-9b3ef",
  storageBucket: "wedding-9b3ef.appspot.com",
  messagingSenderId: "43008411571",
  appId: "1:43008411571:web:1ea5121f4dc69574c4adc6"
};

export function getFirebaseConfig() {
  if (!config || !config.apiKey) {
    throw new Error('No Firebase configuration object provided.' + '\n' +
    'Add your web app\'s configuration object to firebase-config.js');
  } else {
    return config;
  }
}