import { compile } from 'handlebars';
import update from '../helpers/update';
import { getInstance, getDb } from '../firebase/firebase';
import menuHelper from '../helpers/nav-functions';
import dataHelper from '../helpers/data-functions';

const firebase = getInstance();
const db = getDb();

const messageTemplate = require('../templates/message.handlebars');


const readMessage = (id) => {
  return new Promise(
    (resolve, reject) => {
      db.ref(`messages/${id}`).update({
        read: true,
      })
        .then(resolve(null))
        .catch(error => reject(error));
    },
  );
};

export default () => {
  if (firebase.auth().currentUser) {
    const messageId = window.location.href.split('/')[5];
    const userPromise = dataHelper.getUserInfo(firebase.auth().currentUser.uid);
    const messagePromise = dataHelper.getMessageDetail(messageId);
    const readPromise = readMessage(messageId);

    Promise.all([userPromise, messagePromise, readPromise])
      .then((values) => {
        const user = values[0];
        const message = values[1];
        const dateString = new Date(message.timestamp);
        const time = dateString.toUTCString();
        if (message.reply_to) {
          dataHelper.getMessageDetail(message.reply_to)
            .then((reply) => {
              update(compile(messageTemplate)({
                user,
                message,
                time,
                messageId,
                reply,
              }));
              menuHelper.defineMenu();
            });
        } else {
          update(compile(messageTemplate)({
            user,
            message,
            time,
            messageId,
          }));
          menuHelper.defineMenu();
        }
      });
  } else {
    window.location.replace('#/');
  }
};
