import { compile } from 'handlebars';
import update from '../helpers/update';
import { getInstance } from '../firebase/firebase';
import menuHelper from '../helpers/nav-functions';
import dataHelper from '../helpers/data-functions';

const firebase = getInstance();

const messagesTemplate = require('../templates/messages.handlebars');

export default () => {
  if (firebase.auth().currentUser) {
    dataHelper.getUserInfo(firebase.auth().currentUser.uid)
      .then((user) => {
        let studentMode = false;
        if (user.type === 'student') {
          studentMode = true;
        }
        dataHelper.getMessages(user)
          .then((messages) => {
            console.log(messages);
            update(compile(messagesTemplate)({ messages, studentMode }));
            menuHelper.defineMenu();
          });
      });
  } else {
    window.location.replace('#/');
  }
};
