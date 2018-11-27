const firebaseInstance = require('firebase');

// Initialize Firebase
// TODO: Replace with your project's config
const config = {
  apiKey: '<key>',
  authDomain: '<projectId>.firebaseapp.com',
  databaseURL: 'https://<projectId>.firebaseio.com',
  projectId: '<projectId>',
  storageBucket: '<projectId>.appspot.com',
  messagingSenderId: '52666332181',
};

let instance = null;

const initFirebase = () => {
  instance = firebaseInstance.initializeApp(config);
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
};
