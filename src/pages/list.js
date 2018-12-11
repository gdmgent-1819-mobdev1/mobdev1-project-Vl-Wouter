import { compile } from 'handlebars';
import update from '../helpers/update';
import { getInstance, getDb } from '../firebase/firebase';

const firebase = getInstance();
const db = getDb();

const listTemplate = require('../templates/list.handlebars');


export default () => {
  let loading = true;
  let user = null;
  let rooms = {};
  let owner = false;
  let student = true;
  update(compile(listTemplate)({ loading }));
  if (firebase.auth().currentUser) {
    db.ref(`users/${firebase.auth().currentUser.uid}`).once('value')
      .then((snapshot) => {
        user = snapshot.val();
        if (user.type === 'owner') {
          student = false;
          owner = true;
        } else {
          student = true;
          owner = false;
        }
        loading = false;
        db.ref('rooms/').once('value')
          .then((room) => {
            rooms = room.val();
            console.log(rooms);
            update(compile(listTemplate)({
              loading, title: 'Alle koten', owner, student, rooms,
            }));
          });
      });
  } else {
    window.location.replace('/');
  }
};