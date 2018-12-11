import { compile } from 'handlebars';
import update from '../helpers/update';
import { getInstance, getDb } from '../firebase/firebase';

const firebase = getInstance();
const db = getDb();

const profileTemplate = require('../templates/profile.handlebars');


export default () => {
  if (firebase.auth().currentUser) {
    update(compile(profileTemplate)({ }));
  } else {
    window.location.replace('/');
  }
};