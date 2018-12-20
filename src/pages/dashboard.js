import { compile } from 'handlebars';
import update from '../helpers/update';
import { getInstance, getDb } from '../firebase/firebase';
import menuHelper from '../helpers/nav-functions';
import dataHelper from '../helpers/data-functions';

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
  const title = 'Welcome';
  let loading = true;
  update(compile(dashTemplate)({ title, loading }));
  if (status) {
    let data = null;
    db.ref(`users/${status.uid}`).once('value')
      .then((snapshot) => {
        data = snapshot.val();
        loading = false;
        db.ref('rooms').once('value')
          .then((roomdata) => {
            const rooms = roomdata.val();
            const roomArray = dataHelper.getRooms(rooms, data);
            const featured = dataHelper.randomIndex(roomArray);
            console.log(featured);
            update(compile(dashTemplate)({ title, data, featured, loading }));
            const logoutbtn = document.querySelector('#logout-btn');
            logoutbtn.addEventListener('click', logout);
            menuHelper.defineMenu();
          });
      });
  } else {
    window.location.replace('/');
  }
};
