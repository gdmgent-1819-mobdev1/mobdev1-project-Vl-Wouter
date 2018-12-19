// Only import the compile function from handlebars instead of the entire library
import { compile } from 'handlebars';
import update from '../helpers/update';
import menuHelper from '../helpers/nav-functions';
import { getInstance, getDb } from '../firebase/firebase';

// Firebase
const firebase = getInstance();

const db = getDb();

// Import the template to use
const detailTemplate = require('../templates/detail.handlebars');

export default () => {
  // Data to be passed to the template
  // Return the compiled template to the router
  // update(compile(homeTemplate)({ status, logo, user }));
  const status = firebase.auth().currentUser;
  const id = window.location.href.split('/')[5];

  if (status) {
    update(compile(detailTemplate)({ }));
    db.ref(`rooms/${id}`).once('value')
      .then((snapshot) => {
        const room = snapshot.val();
        update(compile(detailTemplate)({ room }));
        menuHelper.defineMenu();
      });
  } else {
    window.location.replace('#/');
  }
};
