import { compile } from 'handlebars';
import { distance } from '@turf/turf';
import update from '../helpers/update';
import { getInstance, getDb } from '../firebase/firebase';
import menuHelper from '../helpers/nav-functions';
import dataHelper from '../helpers/data-functions';

const firebase = getInstance();
const db = getDb();

const gameTemplate = require('../templates/game.handlebars');

/**
 * Function to prepare rooms for display. On this page that means taking all rooms and removing any that are already favorited
 * @param {Array} rooms The array returned by Firebase
 * @param {string} user The id of the currently logged in user
 */
const prepareRooms = (rooms, user) => {
  return new Promise(
    (resolve, reject) => {
      let solvedArray = [];
      const favPromise = dataHelper.getFavorites(user.id);
      const schoolPromise = dataHelper.getSchoolInfo(user.school);

      Promise.all([favPromise, schoolPromise])
        .then((values) => {
          const favorites = values[0];
          const school = values[1];
          rooms.forEach((room, i) => {
            const lat = parseFloat(room.directions.coords.lat, 10);
            const lng = parseFloat(room.directions.coords.lng, 10);
            room.distance = distance([school.directions.coords.lng, school.directions.coords.lat], [lng, lat], { units: 'kilometers' }).toFixed(2);
            if (!favorites[i] || favorites[i].room_id !== room.room_id) {
              solvedArray.push(room);
            }
            solvedArray = dataHelper.sortRooms(solvedArray, 'asc');
          });
          resolve(solvedArray);
        })
        .catch(error => reject(error));
    },
  );
};


const playGame = (rooms, count) => {
  let counter = count;
  if (counter === rooms.length) {
    window.location.replace('#/favorites');
  }
  const currentRoom = rooms[count];
  update(compile(gameTemplate)({ room: true, currentRoom }));
  menuHelper.defineMenu();
  const favBtn = document.querySelector(`#KOT__${currentRoom.room_id}`);
  const noBtn = document.querySelector(`#NOT__${currentRoom.room_id}`);

  favBtn.addEventListener('click', () => {
    const id = favBtn.id.split('__')[1];

    dataHelper.addToFavorites(id, firebase.auth().currentUser.uid)
      .then(() => {
        counter += 1;
        playGame(rooms, counter);
      });
  });

  noBtn.addEventListener('click', () => {
    counter += 1;
    playGame(rooms, counter);
  });
};

export default () => {
  if (firebase.auth().currentUser) {
    const userId = firebase.auth().currentUser.uid;
    const userPromise = dataHelper.getUserInfo(userId);
    const roomPromise = dataHelper.getRooms();

    Promise.all([userPromise, roomPromise])
      .then((values) => {
        const user = values[0];
        prepareRooms(values[1], user)
          .then((rooms) => {
            if (user.type === 'owner') {
              window.location.replace('#/rooms/list');
            }
            const count = 0;
            playGame(rooms, count);
          });
      });
  } else {
    window.location.replace('#/');
  }
};
