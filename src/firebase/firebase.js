const firebaseInstance = require('firebase');

// Initialize Firebase
const config = {
  apiKey: "AIzaSyDUSvKrd8THZrCRbZ572556AGC0EjTE360",
  authDomain: "eindopdracht-mobdev-i.firebaseapp.com",
  databaseURL: "https://eindopdracht-mobdev-i.firebaseio.com",
  projectId: "eindopdracht-mobdev-i",
  storageBucket: "eindopdracht-mobdev-i.appspot.com",
  messagingSenderId: "343442090204",
};

let instance = null;
let db = null;

const initFirebase = () => {
  instance = firebaseInstance.initializeApp(config);
};

const initDb = () => {
  db = firebaseInstance.database();
};

const getDb = () => {
  if (!db) {
    initDb();
  }
  return db;
};

const getInstance = () => {
  if (!instance) {
    initFirebase();
  }
  return instance;
};
export {
  initFirebase,
  getInstance,
  initDb,
  getDb,
};
