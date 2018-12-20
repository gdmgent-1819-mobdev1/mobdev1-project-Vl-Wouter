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

const defineButtons = (id, user) => {
  
}

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
        dataHelper.getFavorites(status.uid)
          .then((favorites) => {
            console.log(favorites);
            let favorited = false;
            if (favorites[id]) {
              favorited = true;
            }
            console.log(favorited);
            update(compile(detailTemplate)({ room, favorited }));
            if (favorites[id]) {
              const delFavBtn = document.querySelector('#delFavorite');
              delFavBtn.addEventListener('click', () => {
                delFavorite(id, status.uid);
                dataHelper.removeFavorite(id, status.uid)
                  .then(() => {
                    update(compile(detailTemplate)({ room, favorited: false }));
                    menuHelper.defineMenu();
                  });
              });
            } else {
              const addFavBtn = document.querySelector('#addFavorite');
              addFavBtn.addEventListener('click', () => {
                dataHelper.addToFavorites(id, status.uid)
                  .then(() => {
                    update(compile(detailTemplate)({ room, favorited: true }));
                    menuHelper.defineMenu();
                  });
              });
            }
            menuHelper.defineMenu();
          });
      });
  } else {
    window.location.replace('#/');
  }
};
