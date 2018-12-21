import { compile } from 'handlebars';
import update from '../helpers/update';
import { getInstance, getDb } from '../firebase/firebase';
import menuHelper from '../helpers/nav-functions';
import dataHelper from '../helpers/data-functions';

const firebase = getInstance();
const db = getDb();

const listTemplate = require('../templates/list.handlebars');


const toggleFilterMenu = () => {
  document.querySelector('#filters').classList.toggle('filter--up');
};

export default () => {
  if (firebase.auth().currentUser) {
    const userPromise = dataHelper.getUserInfo(firebase.auth().currentUser.uid);
    const roomPromise = dataHelper.getRooms();

    Promise.all([userPromise, roomPromise])
      .then((values) => {
        console.log(values);
        update(compile(listTemplate)({ }));
        menuHelper.defineMenu();
      });
    // db.ref(`users/${firebase.auth().currentUser.uid}`).once('value')
    //   .then((snapshot) => {
    //     user = snapshot.val();
    //     if (user.type === 'owner') {
    //       student = false;
    //       owner = true;
    //     } else {
    //       student = true;
    //       owner = false;
    //     }
    //     loading = false;
    //     db.ref('rooms/').once('value')
    //       .then((room) => {
    //         rooms = room.val();
    //         const studentRooms = dataHelper.getRooms(rooms, user);
    //         console.log(studentRooms);
    //         update(compile(listTemplate)({
    //           loading,
    //           title: 'Alle koten',
    //           owner,
    //           student,
    //           studentRooms,
    //         }));
    //         console.log(studentRooms);
    //         const filterBtn = document.querySelector('#filterBtn');
    //         document.querySelector('#cancelFilter').addEventListener('click', toggleFilterMenu);
    //         filterBtn.addEventListener('click', toggleFilterMenu);
    //         menuHelper.defineMenu();
    //       });
    //   });
  } else {
    window.location.replace('/');
  }
};
