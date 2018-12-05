// Only import the compile function from handlebars instead of the entire library
import { compile } from 'handlebars';
import update from '../helpers/update';
import { getInstance, getDb } from '../firebase/firebase';

// Firebase
const firebase = getInstance();

const db = getDb();

// Import the template to use
const homeTemplate = require('../templates/home.handlebars');

// const checkStatus = () => {
//   return new Promise((resolve, reject) => {
//     const status = firebase.auth().currentUser;
//     if(status) {
//       user = db.ref(`users/${status.uid}`).once('value')
//         .then((snapshot) => {
//           resolve(snapshot.val());
//         })
//         .catch(error => reject(error));
//     } else {
//       resolve(null);
//     }
//   });
// };

const logout = () => {
  firebase.auth().signOut()
    .then(window.location.reload())
    .catch(error => console.log(error.message));
};

const populatePage = (id) => {
  console.log(id);
  db.ref(`users/${id}`).once('value')
    .then((snapshot) => {
      const data = snapshot.val();
      console.log(data);
      document.querySelector('#username').innerHTML = `${data.first_name} ${data.last_name}`;
    });
}

export default () => {
  // Data to be passed to the template
  const logo = '../../src/assets/SVG/KotLife_Logo.svg';
  // Return the compiled template to the router
  // update(compile(homeTemplate)({ status, logo, user }));
  const status = firebase.auth().currentUser;
  if (status) {
    update(compile(homeTemplate)({ logo, status }));
    // Add handling of user data here
    populatePage(status.uid);
    document.querySelector('#logout-btn').addEventListener('click', logout);
  } else {
    update(compile(homeTemplate)({ logo }));
  }


  // if (firebase) {
  //   const profile = firebase.auth().currentUser;
  //   console.log(profile);
  //   if (profile) {
  //     status = true;
  //     user = 'user';
  //   } else {
  //     user = 'new person';
  //   }
  //   update(compile(homeTemplate)({ status, logo, user }));
  //   if (profile) {
  //     document.querySelector('#logout-btn').addEventListener('click', logout);
  //   }
  // }
};
