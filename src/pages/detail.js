// Only import the compile function from handlebars instead of the entire library
import { compile } from 'handlebars';
import update from '../helpers/update';
import menuHelper from '../helpers/nav-functions';
import { getInstance, getDb } from '../firebase/firebase';
import dataHelper from '../helpers/data-functions';

// Firebase
const firebase = getInstance();
const db = getDb();

// Import the template to use
const detailTemplate = require('../templates/detail.handlebars');

const deleteRoom = (id) => {
  return new Promise(
    (resolve, reject) => {
      db.ref(`rooms/${id}`).remove()
        .then(resolve(null))
        .catch(error => reject(error));
    },
  );
};

export default () => {
  if (firebase.auth().currentUser) {
    (function(d, s, id) {
      var js, fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) return;
      js = d.createElement(s); js.id = id;
      js.src = 'https://connect.facebook.net/en_GB/sdk.js#xfbml=1&version=v3.2';
      fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));
    
    // get room and user id
    const userId = firebase.auth().currentUser.uid;
    const roomId = window.location.href.split('/')[5];
    // create promises
    const userPromise = dataHelper.getUserInfo(userId);
    const roomPromise = dataHelper.getRoomInfo(roomId);
    const favoritePromise = dataHelper.checkFavorite(userId, roomId);

    Promise.all([userPromise, roomPromise, favoritePromise])
      .then((values) => {
        const user = values[0];
        const room = values[1];
        const fav = values[2];
        let ownerMode;
        room.info.owner === user.id ? ownerMode = true : ownerMode = false;
        update(compile(detailTemplate)({ user, room, fav, ownerMode, roomId }));
        menuHelper.defineMenu();
        document.querySelector('#deleteRoom').addEventListener('click', () => {
          deleteRoom(roomId)
            .then(window.location.replace('#/rooms/list'));
        });
        if (fav) {
          const delFavBtn = document.querySelector('#delFavorite');
          delFavBtn.addEventListener('click', () => {
            dataHelper.removeFavorite(roomId, userId)
              .then(() => {
                window.location.replace('#/rooms/list');
              });
          });
        } else {
          const addFavBtn = document.querySelector('#addFavorite');
          addFavBtn.addEventListener('click', () => {
            dataHelper.addToFavorites(roomId, userId)
              .then(() => {
                window.location.replace('#/favorites');
              });
          });
        }
      });
  } else {
    window.location.replace('#/');
  }
  // Data to be passed to the template
  // Return the compiled template to the router
  // update(compile(homeTemplate)({ status, logo, user }));
  // const status = firebase.auth().currentUser;
  // const id = window.location.href.split('/')[5];

  // if (status) {
  //   update(compile(detailTemplate)({ }));
  //   db.ref(`rooms/${id}`).once('value')
  //     .then((snapshot) => {
  //       const room = snapshot.val();
  //       dataHelper.getFavorites(status.uid)
  //         .then((favorites) => {
  //           console.log(favorites);
  //           let favorited = false;
  //           if (favorites[id]) {
  //             favorited = true;
  //           }
  //           console.log(favorited);
  //           update(compile(detailTemplate)({ room, favorited }));
  //           if (favorites[id]) {
  //             const delFavBtn = document.querySelector('#delFavorite');
  //             delFavBtn.addEventListener('click', () => {
  //               dataHelper.removeFavorite(id, status.uid)
  //                 .then(() => {
  //                   window.location.replace('#/rooms/list');
  //                 });
  //             });
  //           } else {
  //             const addFavBtn = document.querySelector('#addFavorite');
  //             addFavBtn.addEventListener('click', () => {
  //               dataHelper.addToFavorites(id, status.uid)
  //                 .then(() => {
  //                   window.location.replace('#/rooms/list');
  //                 });
  //             });
  //           }
  //           menuHelper.defineMenu();
  //         });
  //     });
  // } else {
  //   window.location.replace('#/');
  // }
};
