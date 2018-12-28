import { getDb } from '../firebase/firebase';

const db = getDb();

/**
 * Gets an object from e.g firebase and returns it as an array.
 * @param {Object} object the object recieved from firebase.
 */
const getArray = (object) => {
  const arrayKeys = Object.keys(object);
  const arrayData = Object.values(object);
  const finalArray = [];
  arrayKeys.forEach((key, i) => {
    arrayData[i].key = key;
    finalArray[i] = arrayData[i];
  });

  return finalArray;
};

/**
 * Get all current rooms from the database and add button trigger to owned rooms
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

/**
 * Gets a list of all schools registered in the system.
 */
const getSchools = () => {
  return new Promise(
    (resolve, reject) => {
      db.ref('schools').once('value')
        .then((snapshot) => {
          const schools = snapshot.val();
          const schoolArray = getArray(schools);
          resolve(schoolArray);
        })
        .catch(error => reject(error));
    },
  );
};

/**
 * Gets all info from a users school
 * @param {string} id school id
 */
const getSchoolInfo = (id) => {
  return new Promise(
    (resolve, reject) => {
      db.ref(`schools/${id}`).once('value')
        .then((snapshot) => {
          const school = snapshot.val();
          resolve(school);
        })
        .catch(error => reject(error));
    },
  );
};

/**
 * Gets all informations from a certain room ID.
 * @param {string} id id of the room
 */
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

/**
 * Gets all favorites from 1 user
 * @param {string} user id of the user.
 */
const getFavorites = (user) => {
  return new Promise(
    (resolve, reject) => {
      db.ref(`favorites/${user}`).once('value')
        .then((snapshot) => {
          const data = snapshot.val();
          if (data) {
            const keys = Object.keys(data);
            const roomPromises = [];
            const rooms = [];
            keys.forEach((key) => {
              roomPromises.push(
                getRoomInfo(key)
                  .then((room) => {
                    room.room_id = key;
                    rooms.push(room);
                  }),
              );
            });
            Promise.all(roomPromises)
              .then(() => {
                resolve(rooms);
              });
          } else {
            const rooms = null;
            resolve(rooms);
          }
        })
        .catch(error => reject(error));
    },
  );
};

/**
 * Function to check if the currently opened room has been favorited
 * @param {*} user id of the logged in user
 * @param {*} room id of the current room
 */
const checkFavorite = (user, room) => {
  return new Promise(
    (resolve, reject) => {
      db.ref(`favorites/${user}/${room}`).once('value')
        .then((snapshot) => {
          const check = snapshot.val();
          resolve(check);
        })
        .catch(error => reject(error));
    },
  );
};

/**
 * Adds a room to the users favorites
 * @param {string} room room to add
 * @param {string} user user to add room to
 */
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

/**
 * Gets all info of a certain user.
 * @param {string} userId user id
 */
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

/**
 * Removes a favorite from a certain user
 * @param {string} room id of the room
 * @param {string} user id of the user
 */
const removeFavorite = (room, user) => {
  return new Promise(
    (resolve, reject) => {
      db.ref(`favorites/${user}/${room}`).remove()
        .then(() => resolve(null))
        .catch(error => reject(error));
    },
  );
};

/**
 * Gets a list of rooms and returns a random room.
 */
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

/**
 * Gets all messages from or for a user depending on the type
 * @param {Object} user user object to determine ID and type
 */
const getMessages = (user) => {
  return new Promise(
    (resolve, reject) => {
      db.ref('/messages').orderByChild('/to/id').equalTo(user.id).on('value', (snapshot) => {
        const messages = snapshot.val();
        resolve(messages);
      });
    },
  );
};

/**
 * Returns all details of a message
 * @param {*} messageId id of message
 */
const getMessageDetail = (messageId) => {
  return new Promise(
    (resolve, reject) => {
      db.ref(`/messages/${messageId}`).once('value')
        .then((snapshot) => {
          resolve(snapshot.val());
        })
        .catch(error => reject(error));
    },
  );
};

/**
 * Extension for checkUnread. Will send a notification when user has them enabled
 */
const notify = () => {
  if ('Notification' in window) {
    const notifText = 'Je hebt nog ongelezen berichten. Klik hier om ze te bekijken!';
    const notifIcon = '../../src/assets/SVG/Icon.svg';
    let notification;
    if (Notification.permission === 'granted') {
      notification = new Notification('Kotlife', { body: notifText, icon: notifIcon });
    } else if (Notification.permission !== 'denied') {
      Notification.requestPermission((permission) => {
        if (permission === 'granted') {
          notification = new Notification('Kotlife', { body: notifText, icon: notifIcon });
        }
      });
    }

    setTimeout(notification.close.bind(notification), 4000);
    notification.onclick = () => {
      window.location.replace('#/messages');
    };
  }
};

/**
 * Checks for unread messages by user
 * @param {Object} user user object
 */
const checkUnread = (user) => {
  getMessages(user)
    .then((messages) => {
      if (messages) {
        const ids = Object.keys(messages);
        const unread = [];
        ids.forEach((id) => {
          if (!messages[id].read) {
            unread.push(id);
          }
        });
        if (unread.length > 0) {
          notify();
        }
      }
    });
};

/**
 * Gets a value from an element
 * @param {string} selector selector for said element
 */
const getValue = (selector) => {
  return document.querySelector(selector).value;
};

const compareRooms = (a, b) => {
  if (a.distance < b.distance) {
    return -1;
  }
  if (a.distance > b.distance) {
    return 1;
  }
  return 0;
};

const sortRooms = (rooms, direction) => {
  let sorted = [];
  if (direction === 'asc') {
    sorted = rooms.sort(compareRooms);
  } else {
    sorted = rooms.sort(compareRooms);
    sorted = sorted.reverse();
  }
  return sorted;
};

export default {
  getRooms,
  getUserInfo,
  getRoomInfo,
  addToFavorites,
  removeFavorite,
  getRandomRoom,
  getFavorites,
  getSchools,
  getSchoolInfo,
  checkFavorite,
  getMessages,
  getMessageDetail,
  getValue,
  checkUnread,
  sortRooms,
};
