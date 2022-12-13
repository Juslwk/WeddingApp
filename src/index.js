/**
 * Copyright 2015 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
'use strict';

import { initializeApp } from 'firebase/app';
import {
  getAuth,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from 'firebase/auth';
import {
  getFirestore,
  collection,
  addDoc,
  getDoc,
  query,
  orderBy,
  limit,
  onSnapshot,
  setDoc,
  updateDoc,
  doc,
  serverTimestamp,
  where,
} from 'firebase/firestore';
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from 'firebase/storage';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import { getPerformance } from 'firebase/performance';

import { getFirebaseConfig } from './firebase-config.js';

// Loads guest
async function loadGuests() {

  let value = window.location.href.substring(window.location.href.lastIndexOf('/') + 1)

  console.log(value);
  const db = getFirestore();
  const docRef = doc(db, "Guest", value);

  try {
    const docSnap = await getDoc(docRef);
    console.log(docSnap.data());
    document.getElementById("ceremony-guest-name").innerText = docSnap.data().Name;
    document.getElementById("dinner-guest-name").innerText = docSnap.data().Name;
  } catch(error) {
      console.log(error)
  }
}

// Triggered when the send new message form is submitted.
function onMessageFormSubmit(e) {
  e.preventDefault();
  let value = window.location.href.substring(window.location.href.lastIndexOf('/') + 1)

  const db = getFirestore();
  const docRef = doc(db, "Guest", value);

  var data = {
    AttendDinner: dinnerElement.checked ? true : false,
    AttendTeaCeremony: ceremonyElement.checked ? true : false,
  };
  
  updateDoc(docRef, data)
  .then(docRef => {
      console.log("Updated document");
      submitElement.style.display = "none";
      thankyouElement.style.display = "inherit";
      questionsElement.style.display = "inherit";
  })
  .catch(error => {
      console.log(error);
  })
}

// A loading image URL.
var LOADING_IMAGE_URL = 'https://www.google.com/images/spin-32.gif?a';

// Shortcuts to DOM Elements.
var messageFormElement = document.getElementById('message-form');
var dinnerElement = document.getElementById('dinnerCheckBox');
var ceremonyElement = document.getElementById('ceremonyCheckBox');
var thankyouElement = document.getElementById('thankyou');
var questionsElement = document.getElementById('questions');
var submitElement = document.getElementById('submit');

messageFormElement.addEventListener('submit', onMessageFormSubmit);


const firebaseAppConfig = getFirebaseConfig();
initializeApp(firebaseAppConfig);

getPerformance();

loadGuests();
