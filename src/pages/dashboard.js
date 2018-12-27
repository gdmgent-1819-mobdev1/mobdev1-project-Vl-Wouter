import { compile } from 'handlebars';
import update from '../helpers/update';
import { getInstance } from '../firebase/firebase';
import menuHelper from '../helpers/nav-functions';
import dataHelper from '../helpers/data-functions';

const firebase = getInstance();

const dashTemplate = require('../templates/dashboard.handlebars');


export default () => {
  const status = firebase.auth().currentUser;
  if (status) {
    const userPromise = dataHelper.getUserInfo(status.uid);
    const roomsPromise = dataHelper.getRooms();
    const featuredPromise = dataHelper.getRandomRoom();

    Promise.all([userPromise, roomsPromise, featuredPromise])
      .then((values) => {
        const user = values[0];
        const rooms = values[1];
        const featured = values[2];
        if (user.type === 'owner') {
          window.location.replace('#/rooms/list');
        } else {
          update(compile(dashTemplate)({ user, rooms, featured }));
          menuHelper.defineMenu();
          dataHelper.checkUnread(user);
        }
      });
  } else {
    window.location.replace('#/');
  }
};
