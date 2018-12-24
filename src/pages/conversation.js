import { compile } from 'handlebars';
import update from '../helpers/update';
import { getInstance } from '../firebase/firebase';
import menuHelper from '../helpers/nav-functions';
import dataHelper from '../helpers/data-functions';

const firebase = getInstance();

const conversationTemplate = require('../templates/conversation.handlebars');

export default () => {
  // check for login
  if(firebase.auth().currentUser) {
    // get messages from conversation
    // build text field for message
    // when sent push message to conversation
  } else {
    window.location.replace('#/');
  }
}