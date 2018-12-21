import { getInstance, getDb } from '../firebase/firebase';

const firebase = getInstance();
const db = getDb();

/**
 * Get all current rooms from the database and add button trigger to owned rooms
 * @param {*} user used to check if current user is owner of the room
 */
const getRooms = () => {
  return new Promise(
    (resolve, reject) => {
      db.ref('/rooms').once('value')
        .then((snapshot) => {
          const rooms = snapshot.val();
          const roomKeys = Object.keys(rooms);
          const roomData = Object.values(rooms);
          const roomArray = [];

          roomKeys.forEach((key, i) => {
            roomData[i].room_id = key;
            roomArray[i] = roomData[i];
          });

          resolve(roomArray);
        })
        .catch(error => reject(error));
    },
  );
};

const getRoomInfo = (id) => {
  return new Promise(
    (resolve, reject) => {
      db.ref(`rooms/${id}`).once('value')
        .then((snapshot) => {
          const roomData = snapshot.val();
          resolve(roomData);
        })
        .catch(error => reject(error));
    },
  );
};

const getFavorites = (user) => {
  return new Promise(
    (resolve, reject) => {
      db.ref(`favorites/${user}`).once('value')
        .then((snapshot) => {
          const data = snapshot.val();
          const keys = Object.keys(data);
          const roomPromises = [];
          const rooms = [];
          keys.forEach((key) => {
            roomPromises.push(
              getRoomInfo(key)
                .then((room) => {
                  rooms.push(room);
                }),
            );
          });
          Promise.all(roomPromises)
            .then(() => {
              resolve(rooms);
            });
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

const getUserInfo = (userId) => {
  return new Promise(
    (resolve, reject) => {
      db.ref(`users/${userId}`).once('value')
        .then((snapshot) => {
          const user = snapshot.val();
          resolve(user);
        })
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

const getRandomRoom = () => {
  return new Promise(
    (resolve, reject) => {
      getRooms()
        .then((roomArray) => {
          const number = Math.floor(Math.random() * roomArray.length);
          const room = roomArray[number];
          resolve(room);
        })
        .catch(error => reject(error));
    },
  );
};

export default {
  getRooms,
  getUserInfo,
  getRoomInfo,
  addToFavorites,
  removeFavorite,
  getRandomRoom,
  getFavorites,
};
