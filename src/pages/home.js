// Only import the compile function from handlebars instead of the entire library
import { compile } from 'handlebars';
import { resolve } from 'url';
import update from '../helpers/update';

const { getInstance } = require('../firebase/firebase');

const firebase = getInstance();
const db = firebase.firestore();

// Import the template to use
const homeTemplate = require('../templates/home.handlebars');



export default () => {
  // Data to be passed to the template
  // const user = 'Test user';
  const logo = '../../src/assets/SVG/KotLife_Logo.svg';
  const logout = () => {
    firebase.auth().signOut()
      .catch(error => alert(error.message));
  };

  // Return the compiled template to the router
  update(compile(homeTemplate)({ logo }));
};
