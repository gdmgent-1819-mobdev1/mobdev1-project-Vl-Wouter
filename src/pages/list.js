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

  const query = `?filter&${queryStringArray.join('&')}`;
  window.location.replace(`#/rooms/list${query}`);
};

const getSearchParams = () => {
  const query = window.location.href.split('?')[1];
  if(query) {
    const params = query.split('&');
    return params;
  } else {
    return null;
  }
}

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
      const [key, value] = param.split('=');
      filters[key] = value;
    });

    rooms.forEach((room) => {
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
          let finalRooms = [];
          if (window.location.href.split('?')[1]) {
            const query = window.location.href.split('?')[1];
            if (query.split('&')[0] === 'filter') {
              finalRooms = filterRooms(rooms);
            } else {
              const sortDir = query.split('&')[1].split('=')[1];
              if (sortDir === 'asc') {
                finalRooms = dataHelper.sortRooms(rooms, 'asc');
              } else {
                finalRooms = dataHelper.sortRooms(rooms, 'desc');
              }
            }
          } else {
            finalRooms = rooms;
          }
          resolve(finalRooms);
        })
        .catch(error => reject(error));
    },
  );
};

const prepareOwnedRooms = (rooms, user) => {
  const finalArray = [];
  rooms.forEach((room) => {
    if (room.info.owner === user.id) {
      finalArray.push(room);
    }
  });
  return finalArray;
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
    let sortAsc = false;
    let sortDesc = false;
    if (window.location.href.split('?')[1] && window.location.href.split('?')[1].split('&')[0] === 'sort') {
      const sortType = window.location.href.split('?')[1].split('&')[1].split('=')[1];
      switch (sortType) {
        case 'asc': sortAsc = true; break;
        case 'desc': sortDesc = true; break;
        default: return;
      }
    }
    const userPromise = dataHelper.getUserInfo(firebase.auth().currentUser.uid);
    const roomPromise = dataHelper.getRooms();

    Promise.all([userPromise, roomPromise])
      .then((values) => {
        const user = values[0];
        if (user.type === 'student') {
          prepareStudentRooms(values[1], user)
            .then((rooms) => {
              update(compile(listTemplate)({ rooms, ownerMode: false, sortAsc, sortDesc }));
              menuHelper.defineMenu();
              defineFilterMenu();
              dataHelper.checkUnread(user);
              document.querySelector('#sortBtn').addEventListener('click', (e) => {
                e.preventDefault();
                if (!window.location.href.split('?')[1] || window.location.href.split('?')[1].split('&')[1] === 'dir=desc') {
                  window.location.replace('#/rooms/list?sort&dir=asc');
                } else {
                  window.location.replace('#/rooms/list?sort&dir=desc');
                }
              });
            });
        } else {
          const rooms = prepareOwnedRooms(values[1], user);
          update(compile(listTemplate)({ rooms, ownerMode: true }));
          menuHelper.defineMenu();
          dataHelper.checkUnread(user);
        }
      });
  } else {
    window.location.replace('#/');
  }
};
