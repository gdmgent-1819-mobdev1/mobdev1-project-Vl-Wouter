import { getInstance, getDb } from '../firebase/firebase';

const firebase = getInstance();
const db = getDb();

/**
 * Get rooms from the js object returned by the database
 * @param {*} object
 */
const getRooms = (object, user) => {
  // Get keys and values of all rooms
  const keys = Object.keys(object);
  const data = Object.values(object);

  // Create an empty array
  const roomArray = [];
  // store data in array under room key
  keys.forEach((key, i) => {
    if (data[i].info.owner === user.id) {
      data[i].isOwner = true;
    }
    data[i].room_id = key;
    roomArray[i] = data[i];
  });

  // Return said array
  return roomArray;
};

const getFavorites = (user) => {
  return new Promise(
    (resolve, reject) => {
      db.ref(`favorites/${user}`).once('value')
        .then((snapshot) => {
          const data = snapshot.val();
          resolve(data);
        })
        .catch(error => reject(error));
    },
  );
};

const addToFavorites = (room, user) => {
  return new Promise(
    (resolve, reject) => {
      db.ref(`favorites/${user}`).update({
        [room]: true,
      })
        .then(() => resolve(null))
        .catch(error => reject(error));
    },
  );
};

const removeFavorite = (room, user) => {
  return new Promise(
    (resolve, reject) => {
      db.ref(`favorites/${user}/${room}`).remove()
        .then(() => resolve(null))
        .catch(error => reject(error));
    },
  );
};

const randomIndex = (array) => {
  const number = Math.floor((Math.random() * array.length));
  return array[number];
};

export default {
  getRooms,
  addToFavorites,
  removeFavorite,
  randomIndex,
  getFavorites,
};
