// Only import the compile function from handlebars instead of the entire library
import { compile } from 'handlebars';
import update from '../helpers/update';
import { getInstance } from '../firebase/firebase';

// Firebase
const firebase = getInstance();

// Import the template to use
const menuTemplate = require('../templates/menu.handlebars');

const logout = () => {
  firebase.auth().signOut()
    .catch(error => console.log(error.message));
};

export default () => {
  // Data to be passed to the template
  const logo = '../../src/assets/SVG/KotLife_Logo.svg';
  let user = null;
  let status = false;
  // Return the compiled template to the router

  if (firebase) {
    const profile = firebase.auth().currentUser;
    console.log(profile);
    if (profile) {
      status = true;
      user = 'user';
      document.querySelector('#logout-btn').addEventListener('click', logout);
    } else {
      window.location.href = '/';
    }
    update(compile(menuTemplate)({ status, logo, user }));
  }
};
