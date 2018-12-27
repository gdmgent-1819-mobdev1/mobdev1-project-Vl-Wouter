import {
  compile,
} from 'handlebars';
import update from '../helpers/update';
import {
  getInstance,
  getDb,
} from '../firebase/firebase';
import menuHelper from '../helpers/nav-functions';
import dataHelper from '../helpers/data-functions';

const firebase = getInstance();
const db = getDb();

const newTemplate = require('../templates/createM.handlebars');

/**
 * Takes all parameters from URL search query and returns them as object
 * @param {string} query URL search query
 */
const getParamsFromQuery = (query) => {
  const queries = query.split('&');
  const params = {};
  queries.forEach((searchParam) => {
    const [key, value] = searchParam.split('=');
    params[key] = value;
  });
  return params;
};

/**
 * Prepares the webpage with correct information on type of message
 * @param {string} query search query to get correct parameters
 */
const prepMessage = (query) => {
  return new Promise(
    (resolve, reject) => {
      const params = getParamsFromQuery(query);
      if (params.room) {
        const roomPromise = dataHelper.getRoomInfo(params.room);
        const toPromise = dataHelper.getUserInfo(params.to);

        Promise.all([roomPromise, toPromise])
          .then((values) => {
            const room = values[0];
            const to = values[1];
            const messagedata = {
              room: room.directions.address,
              to: {
                id: to.id,
                name: `${to.first_name} ${to.last_name}`,
              },
            };
            resolve(messagedata);
          })
          .catch(error => reject(error));
      } else if (params.reply_id) {
        dataHelper.getMessageDetail(params.reply_id)
          .then((message) => {
            const messagedata = {
              room: message.room,
              to: {
                id: message.from.id,
                name: message.from.name,
              },
              reply_to: params.reply_id,
            };
            resolve(messagedata);
          })
          .catch(error => reject(error));
      }
    },
  );
};

/**
 * adds message to database, sending it to the correct user
 * @param {object} from user the message comes from
 */
const sendMessage = (from) => {
  const messageDetails = {
    from: {
      id: from.id,
      name: `${from.first_name} ${from.last_name}`,
    },
    to: {
      id: dataHelper.getValue('#toId'),
      name: dataHelper.getValue('#to'),
    },
    room: dataHelper.getValue('#subject'),
    message: dataHelper.getValue('#message'),
    timestamp: Date.now(),
    read: false,
  };
  console.log(messageDetails);
  db.ref('/messages').push(messageDetails)
    .then(() => {
      window.location.replace('#/messages');
    })
    .catch(error => console.log(error));
};

export default () => {
  if (firebase.auth().currentUser) {
    const query = window.location.href.split('?')[1];
    const userPromise = dataHelper.getUserInfo(firebase.auth().currentUser.uid);
    const prepPromise = prepMessage(query);

    Promise.all([userPromise, prepPromise])
      .then((values) => {
        const [user, messagedata] = values;
        update(compile(newTemplate)({
          user,
          messagedata,
        }));
        menuHelper.defineMenu();
        const sendBtn = document.querySelector('#sendMessage');
        sendBtn.addEventListener('click', (e) => {
          e.preventDefault();
          sendMessage(user);
        });
      });
  } else {
    window.location.replace('#/');
  }
};
