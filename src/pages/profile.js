import { compile } from 'handlebars';
import update from '../helpers/update';
import { getInstance, getDb } from '../firebase/firebase';
import menuHelper from '../helpers/nav-functions';

const firebase = getInstance();
const db = getDb();

const profileTemplate = require('../templates/profile.handlebars');


export default () => {
  const usericon = '../../src/assets/SVG/user.svg';
  let student = false;
  let owner = false;
  if (firebase.auth().currentUser) {
    update(compile(profileTemplate)({ }));
    db.ref(`users/${firebase.auth().currentUser.uid}`).once('value')
      .then((snapshot) => {
        const user = snapshot.val();
        if (user.type === 'owner') {
          owner = true;
        } else {
          student = true;
        }
        update(compile(profileTemplate)({
          user,
          usericon,
          owner,
          student,
        }));
        const menuBtn = document.querySelector('#toggleMenu');
        menuBtn.addEventListener('click', (e) => {
          e.preventDefault();
          menuHelper.toggleMenu();
        });
      });
  } else {
    window.location.replace('/');
  }
};