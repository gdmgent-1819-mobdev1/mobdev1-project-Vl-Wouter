import { compile } from 'handlebars';
import update from '../helpers/update';
import { getInstance, getDb } from '../firebase/firebase';
import menuHelper from '../helpers/nav-functions';
import dataHelper from '../helpers/data-functions';

const firebase = getInstance();
const db = getDb();

const favTemplate = require('../templates/favorites.handlebars');

export default () => {
  if (firebase.auth().currentUser) {
    const userId = firebase.auth().currentUser.uid;
    const userPromise = dataHelper.getUserInfo(userId);
    const favPromise = dataHelper.getFavorites(userId);
    Promise.all([userPromise, favPromise])
      .then((values) => {
        console.log(values);
        const user = values[0];
        const fav = values[1];
        update(compile(favTemplate)({ user, fav }));
        menuHelper.defineMenu();
      });
  } else {
    window.location.replace('#/');
  }
};
