import { compile } from 'handlebars';
import update from '../helpers/update';
import { getInstance, getDb } from '../firebase/firebase';
import { Room } from '../helpers/classes';

const firebase = getInstance();
const db = getDb();

const newTemplate = require('../templates/new.handlebars');

const createRoom = () => {
  
}

export default () => {
  if (firebase.auth().currentUser) {
    update(compile(newTemplate)({ }));
  } else {
    window.location.replace('/');
  }
};