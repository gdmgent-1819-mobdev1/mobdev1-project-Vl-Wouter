// Only import the compile function from handlebars instead of the entire library
import { compile } from 'handlebars';
import { resolve } from 'url';
import update from '../helpers/update';

// Import the template to use
const homeTemplate = require('../templates/home.handlebars');
const { getInstance } = require('../firebase/firebase');

const firebase = getInstance();
const db = firebase.firestore();

export default () => {
  // Data to be passed to the template
  // const user = 'Test user';
  // TODO: REWRITE!
  const logo = '../../src/assets/SVG/KotLife_Logo.svg';
  console.log(firebase.auth().currentUser);
  const profile = firebase.auth().currentUser;
  const logout = () => {
    firebase.auth().signOut()
      .catch(error => alert(error.message));
  };

  if (profile) {
    document.querySelector('#logout-btn').addEventListener('click', logout);
  }

  // Return the compiled template to the router
  update(compile(homeTemplate)({ logo, profile }));
};
