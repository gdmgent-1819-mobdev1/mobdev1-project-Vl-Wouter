import { compile } from 'handlebars';
import { distance } from '@turf/turf';
import update from '../helpers/update';
import { getInstance, getDb } from '../firebase/firebase';
import menuHelper from '../helpers/nav-functions';
import dataHelper from '../helpers/data-functions';

const firebase = getInstance();
const db = getDb();

const listTemplate = require('../templates/list.handlebars');


const prepareStudentRooms = (rooms, user) => {
  return new Promise(
    (resolve, reject) => {
      dataHelper.getSchoolInfo(user.school)
        .then((school) => {
          rooms.forEach((room) => {
            const lat = parseFloat(room.directions.coords.lat, 10);
            const lng = parseFloat(room.directions.coords.lng, 10);
            room.distance = distance([school.directions.coords.lng, school.directions.coords.lat], [lng, lat], { units: 'kilometers' }).toFixed(2);
          });
          resolve(rooms);
        })
        .catch(error => reject(error));
    },
  );
};

const prepareOwnedRooms = (rooms, user) => {
  return new Promise(
    (resolve, reject) => {
      const finalArray = [];
      rooms.forEach((room) => {
        if (room.info.owner === user.id) {
          finalArray.push(room);
        }
      });
      resolve(finalArray);
    },
  );
};


const toggleFilterMenu = () => {
  document.querySelector('#filters').classList.toggle('filter--up');
};

const defineFilterMenu = () => {
  document.querySelector('#filterBtn').addEventListener('click', toggleFilterMenu);
  document.querySelector('#cancelFilter').addEventListener('click', toggleFilterMenu);
};

export default () => {
  if (firebase.auth().currentUser) {
    const userPromise = dataHelper.getUserInfo(firebase.auth().currentUser.uid);
    const roomPromise = dataHelper.getRooms();

    Promise.all([userPromise, roomPromise])
      .then((values) => {
        console.log(values);
        const user = values[0];
        if (user.type === 'student') {
          prepareStudentRooms(values[1], user)
            .then((rooms) => {
              update(compile(listTemplate)({ rooms, ownerMode: false }));
              menuHelper.defineMenu();
              defineFilterMenu();
            });
        } else {
          prepareOwnedRooms(values[1], user)
            .then((rooms) => {
              update(compile(listTemplate)({ rooms, ownerMode: true }));
              menuHelper.defineMenu();
              defineFilterMenu();
            });
        }
      });
  } else {
    window.location.replace('/');
  }
};
