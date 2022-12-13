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
  getDocs,
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

async function loadInvitation() {
  let value = window.location.href.substring(window.location.href.lastIndexOf('/') + 1)
  const db = getFirestore();
  const collectionRef = collection(db, "invitation", value, "guest");
  const querySnapshot = await getDocs(collectionRef);
  querySnapshot.forEach((doc) => {
    // doc.data() is never undefined for query doc snapshots
    console.log(doc.id, " => ", doc.data());
    ceremonyDiv.innerHTML += `
    <div class='ceremony-guest-name'>`+ doc.data().Name +`</div> -
    <input id='ceremonyCheckBox-`+ doc.id +`' type='checkbox' checked>
    <label for='ceremonyCheckBox-`+ doc.id +`' class='check-trail'>
      <span class='check-handler'></span>
    </label>
    <div></div>`

    dinnerDiv.innerHTML += `
    <div class='dinner-guest-name'>`+ doc.data().Name +`</div> -
    <input id='dinnerCheckBox-`+ doc.id +`' type='checkbox' checked>
    <label for='dinnerCheckBox-`+ doc.id +`' class='check-trail'>
      <span class='check-handler'></span>
    </label>
    <div></div>`
  });
}

// Triggered when the send new message form is submitted.
async function onMessageFormSubmit(e) {
  e.preventDefault();
  let value = window.location.href.substring(window.location.href.lastIndexOf('/') + 1)
  const db = getFirestore();
  const collectionRef = collection(db, "invitation", value, "guest");
  getDocs(collectionRef)
  .then(querySnapshot => {
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      console.log(doc.id, " => ", doc.data());
      var ceremonyCheckBox = document.getElementById('ceremonyCheckBox-' + doc.id)
      var dinnerCheckBox = document.getElementById('dinnerCheckBox-' + doc.id)
      var data = {
        AttendTeaCeremony: ceremonyCheckBox.checked ? true : false,
        AttendDinner: dinnerCheckBox.checked ? true : false,
      };
      updateDoc(doc.ref, data);
    })
  })
  .then(() => {
    submitElement.style.display = "none";
    thankyouElement.style.display = "inherit";
    questionsElement.style.display = "inherit";
  });
}

// A loading image URL.
var LOADING_IMAGE_URL = 'https://www.google.com/images/spin-32.gif?a';

// Shortcuts to DOM Elements.
var messageFormElement = document.getElementById('message-form');
var thankyouElement = document.getElementById('thankyou');
var questionsElement = document.getElementById('questions');
var submitElement = document.getElementById('submit');
var ceremonyDiv = document.getElementById('ceremony');
var dinnerDiv = document.getElementById('dinner');

messageFormElement.addEventListener('submit', onMessageFormSubmit);


const firebaseAppConfig = getFirebaseConfig();
initializeApp(firebaseAppConfig);

getPerformance();

loadInvitation();
