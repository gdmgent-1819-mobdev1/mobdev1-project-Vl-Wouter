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
    console.log(window.location.href.split('/')[5]);
    const combinedid = window.location.href.split('/')[5];
    const userPromise = dataHelper.getUserInfo(firebase.auth().currentUser.uid);
    const convPromise = dataHelper.getConversation(combinedid);

    Promise.all([userPromise, convPromise])
      .then((values) => {
        console.log(values);
        const user = values[0];
        const conversation = values[1];
        // Promises to get more information about room and owner
        const roomInfoPromise = dataHelper.getRoomInfo(conversation.room);
        const ownerInfoPromise = dataHelper.getUserInfo(conversation.owner);
        Promise.all([roomInfoPromise, ownerInfoPromise])
          .then((values) => {
            console.log(values);
            const room = values[0];
            const owner = values[1];
            console.log(user);
            console.log(conversation);
            update(compile(conversationTemplate)({ room, owner, conversation, user }));
            menuHelper.defineMenu();

          });
      });
    // get messages from conversation
    // build text field for message
    // when sent push message to conversation
  } else {
    window.location.replace('#/');
  }
}