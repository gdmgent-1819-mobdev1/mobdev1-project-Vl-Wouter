import { compile } from 'handlebars';
import { distance } from '@turf/turf';
import update from '../helpers/update';
import { getInstance } from '../firebase/firebase';
import menuHelper from '../helpers/nav-functions';
import dataHelper from '../helpers/data-functions';

const firebase = getInstance();

const listTemplate = require('../templates/list.handlebars');

/**
 * Gets a value from an element
 * @param {string} selector selector for said element
 */
const getValue = (selector) => {
  return document.querySelector(selector).value;
};

/**
 * checks if a value is empty or undefined
 * @param {string} string string to check
 */
const isEmpty = (string) => {
  return string === '';
};

/**
 * Pushes only non-empty values to an array
 * @param {*} array array to push to
 * @param {*} value value to push to array
 * @param {*} name name to push with value
 */
const arrayPush = (array, value, name) => {
  if (!isEmpty(value)) {
    array.push(`${name}=${value}`);
  }
};

/**
 * Applies the filters filled in from the filter menu
 */
const applyFilters = () => {
  //* Variables for filters
  const queryStringArray = [];

  const minPrice = getValue('#minPrice');
  const maxPrice = getValue('#maxPrice');

  const minDist = getValue('#minDistance');
  const maxDist = getValue('#maxDistance');

  const type = getValue('input[name=filterType]:checked');

  const surface = getValue('#filterArea');

  // Check if variables are empty and add non-empty to query
  arrayPush(queryStringArray, minPrice, 'minPrice');
  arrayPush(queryStringArray, maxPrice, 'maxPrice');
  arrayPush(queryStringArray, minDist, 'minDist');
  arrayPush(queryStringArray, maxDist, 'maxDist');
  queryStringArray.push(`type=${type}`);
  arrayPush(queryStringArray, surface, 'surface');

  const query = `?${queryStringArray.join('&')}`;
  window.location.replace(`#/rooms/list${query}`);
};

/**
 * Applies filters to the current array of rooms
 * @param {Array} rooms Array of rooms
 */
const filterRooms = (rooms) => {
  const query = window.location.href.split('?')[1];
  let finalRooms = [];
  if (query) {
    const params = query.split('&');
    const filters = {
      minPrice: 0,
      maxPrice: 9000,
      minDist: 0,
      maxDist: 9000,
      type: 'All',
      surface: '',
    };
    params.forEach((param) => {
      const split = param.split('=');
      filters[split[0]] = split[1];
    });

    rooms.forEach((room) => {
      console.log(room.price.price);
      if (room.price.price > filters.minPrice && room.price.price < filters.maxPrice) {
        if (room.distance > filters.minDist && room.distance < filters.maxDist) {
          if (filters.type === 'All' || room.info.type === filters.type) {
            if (!isEmpty(filters.surface) && room.info.surface === filters.surface) {
              finalRooms.push(room);
            } else {
              finalRooms.push(room);
            }
          }
        }
      }
    });
  } else {
    finalRooms = rooms;
  }
  return finalRooms;
};

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
          const filteredRooms = filterRooms(rooms);
          resolve(filteredRooms);
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
  document.querySelector('#addFilters').addEventListener('click', (e) => {
    e.preventDefault();
    applyFilters();
  });
};

export default () => {
  if (firebase.auth().currentUser) {
    const userPromise = dataHelper.getUserInfo(firebase.auth().currentUser.uid);
    const roomPromise = dataHelper.getRooms();

    Promise.all([userPromise, roomPromise])
      .then((values) => {
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
