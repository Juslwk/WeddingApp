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
  Timestamp,
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
  let value = window.location.href.substring(window.location.href.lastIndexOf('/') + 1);
  if (value)
  {
    const db = getFirestore();

    const invitationRef = doc(db, "invitations", value);
    const invitationSnap = await getDoc(invitationRef);
    if (invitationSnap.exists()) {
      var data = {
        LastVisitTime: Timestamp.now()
      };
      updateDoc(invitationSnap.ref, data);

      var hasSavedBefore = invitationSnap.data().LastSaveTime ? true : false;
      if (hasSavedBefore)
      {
        submitElement.style.display = "none";
        thankyouElement.style.display = "inherit";
        questionsElement.style.display = "inherit";
      }

      var disabledText = hasSavedBefore ? "disabled" : "";
      var pointerStyleText = hasSavedBefore ? 'style="cursor: default;"' : '';

      const guestCollectionRef = collection(db, "invitations", value, "guests");
      const querySnapshot = await getDocs(guestCollectionRef);
      querySnapshot.forEach((doc) => {
        var ceremonyCheckedText = doc.data().AttendTeaCeremony ? "checked" : "";
        ceremonyDiv.innerHTML += `
        <div class='ceremony-guest-name'>`+ doc.data().Name +`</div> -
        <input id='ceremonyCheckBox-`+ doc.id +`' type='checkbox' `+ ceremonyCheckedText +` ` + disabledText + `>
        <label for='ceremonyCheckBox-`+ doc.id +`' class='check-trail' `+ pointerStyleText + `>
          <span class='check-handler'></span>
        </label>
        <div></div>`
    
        var dinnerCheckedText = doc.data().AttendDinner ? "checked" : "";
        dinnerDiv.innerHTML += `
        <div class='dinner-guest-name'>`+ doc.data().Name +`</div> -
        <input id='dinnerCheckBox-`+ doc.id +`' type='checkbox' `+ dinnerCheckedText + ` ` + disabledText + `>
        <label for='dinnerCheckBox-`+ doc.id +`' class='check-trail' ` + pointerStyleText + `>
          <span class='check-handler'></span>
        </label>
        <div></div>`
      });

    } else {
      console.log("No such document!");
      messageFormElement.style.display = "none";
      rsvpImage.style.display = "none";
    }
  }
  else
  {
    messageFormElement.style.display = "none";
    rsvpImage.style.display = "none";
  }
}

// Triggered when the send new message form is submitted.
async function onMessageFormSubmit(e) {
  e.preventDefault();
  let value = window.location.href.substring(window.location.href.lastIndexOf('/') + 1)
  const db = getFirestore();

  const invitationRef = doc(db, "invitations", value);
  const invitationSnap = await getDoc(invitationRef);

  if (invitationSnap.exists()) {
    var data = {
      LastSaveTime: Timestamp.now()
    };
    updateDoc(invitationSnap.ref, data);
    
    const guestCollectionRef = collection(db, "invitations", value, "guests");
    getDocs(guestCollectionRef)
    .then(querySnapshot => {
      querySnapshot.forEach((guest) => {
        console.log(guest.id, " => ", guest.data());
        var ceremonyCheckBox = document.getElementById('ceremonyCheckBox-' + guest.id)
        var dinnerCheckBox = document.getElementById('dinnerCheckBox-' + guest.id)
        var data = {
          AttendTeaCeremony: ceremonyCheckBox.checked ? true : false,
          AttendDinner: dinnerCheckBox.checked ? true : false,
        };
        updateDoc(guest.ref, data);

        ceremonyCheckBox.disabled = true;
        dinnerCheckBox.disabled = true;
      })
    })
    .then(() => {
      submitElement.style.display = "none";
      thankyouElement.style.display = "inherit";
      questionsElement.style.display = "inherit";
      var inputCollection = document.getElementsByClassName('check-trail'); 
      for (let i = 0; i < inputCollection.length; i++) {
        inputCollection[i].style.cursor = "default";
      }
    });
  }
  else
  {
    console.log("No such document!");
  }
}

function myNavFunc(){
  window.open("https://www.google.com/maps/dir/?api=1&travelmode=driving&layer=traffic&destination=3.148903549120716, 101.82652633088857");
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
var rsvpImage = document.getElementById('rsvp');
var venueDiv = document.getElementById('venue');

// messageFormElement.addEventListener('submit', onMessageFormSubmit);
// venueDiv.addEventListener('click', myNavFunc);


const firebaseAppConfig = getFirebaseConfig();
initializeApp(firebaseAppConfig);

getPerformance();

// loadInvitation();
