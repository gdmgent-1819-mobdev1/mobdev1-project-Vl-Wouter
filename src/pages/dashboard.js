import { compile } from 'handlebars';
import update from '../helpers/update';
import { getInstance, getDb } from '../firebase/firebase';

const firebase = getInstance();
const db = getDb();

const dashTemplate = require('../templates/dashboard.handlebars');

const logout = () => {
  firebase.auth().signOut()
    .then(window.location.replace('/'))
    .catch(error => console.log(error.message));
};

export default () => {
  const status = firebase.auth().currentUser;
  let loading = true;
  update(compile(dashTemplate)({ loading }));
  if (status) {
    let data = null;
    db.ref(`users/${status.uid}`).once('value')
      .then((snapshot) => {
        data = snapshot.val();
        loading = false;
        update(compile(dashTemplate)({ data, loading }));
        const logoutbtn = document.querySelector('#logout-btn');
        logoutbtn.addEventListener('click', logout);
      });
  } else {
    window.location.replace('/');
  }
};
