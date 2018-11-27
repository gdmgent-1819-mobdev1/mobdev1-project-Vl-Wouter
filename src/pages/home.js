// Only import the compile function from handlebars instead of the entire library
import { compile } from 'handlebars';
import update from '../helpers/update';
import { getInstance } from '../firebase/firebase';

// Firebase
const firebase = getInstance();

// Import the template to use
const homeTemplate = require('../templates/home.handlebars');

const logout = () => {
  firebase.auth().signOut()
    .then(window.location.reload())
    .catch(error => console.log(error.message));
};

export default () => {
  // Data to be passed to the template
  const logo = '../../src/assets/SVG/KotLife_Logo.svg';
  let user = null;
  let status = false;
  // Return the compiled template to the router
  // update(compile(homeTemplate)({ status, logo, user }));

  if (firebase) {
    const profile = firebase.auth().currentUser;
    console.log(profile);
    if (profile) {
      status = true;
      user = 'user';
      
    } else {
      user = 'new person';
    }
    update(compile(homeTemplate)({ status, logo, user }));
    if(profile) {
      document.querySelector('#logout-btn').addEventListener('click', logout);
    }
  }
};
