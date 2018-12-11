// Only import the compile function from handlebars instead of the entire library
import { compile } from 'handlebars';
import update from '../helpers/update';
import { getInstance, getDb } from '../firebase/firebase';

// Firebase
const firebase = getInstance();

const db = getDb();

// Import the template to use
const homeTemplate = require('../templates/home.handlebars');

export default () => {
  // Data to be passed to the template
  const logo = '../../src/assets/SVG/KotLife_Logo.svg';
  // Return the compiled template to the router
  // update(compile(homeTemplate)({ status, logo, user }));
  const status = firebase.auth().currentUser;
  if (status) {
    window.location.replace('#/dash');
  } else {
    update(compile(homeTemplate)({ logo }));
  }
}
