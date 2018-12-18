import { compile } from 'handlebars';
import update from '../helpers/update';
import { getInstance, getDb } from '../firebase/firebase';
import { Room } from '../helpers/classes';
import tokens from '../config';

const firebase = getInstance();
const db = getDb();

const newTemplate = require('../templates/new.handlebars');

const getValue = (element) => {
  return document.querySelector(element).value;
};

const storeRoom = (room) => {
  return new Promise(
    (resolve, reject) => {
      db.ref('rooms').push(room)
        .then(() => resolve(null))
        .catch(error => reject(error));
    },
  );
};

const generatePhotoUrl = () => {
  return new Promise(
    (resolve, reject) => {
      fetch(`https://api.unsplash.com/photos/random?query=dorm-room&client_id=${tokens.unsplashToken}`)
        .then((response) => {
          const photo = response.json();
          resolve(photo);
        }, error => reject(error));
    }
  );
}

const createRoom = () => {
  const directions = {
    address: getValue('#address'),
    lng: document.querySelector('#lng').innerHTML,
    lat: document.querySelector('#lat').innerHTML,
  };

  const price = {
    price: getValue('#price'),
    deposit: getValue('#deposit'),
  };

  const details = {
    type: getValue('#type'),
    surface: getValue('#opp'),
    floor: getValue('#verdieping'),
    people: getValue('#personen'),
    shower: getValue('#douche'),
    toilet: getValue('#toilet'),
    bath: getValue('#bad'),
    kitchen: getValue('#keuken'),
    furniture: getValue('#meubels'),
    furn_description: getValue('#beschrijfMeubels'),
    total: getValue('#totaal'),
    owner: firebase.auth().currentUser.uid,
  };

  const extra = getValue('#comment');

  let photo = '';
  generatePhotoUrl()
    .then((photoUrl) => {
      photo = photoUrl.urls.full;
      const room = new Room(directions, price, details, photo, extra);
      console.log(room);
      storeRoom(room)
        .then(() => window.location.replace('#/rooms/list'));
    });
}

const calcCoords = (input) => {
  const address = input.value;
  return new Promise(
    (resolve, reject) => {
      fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${address}.json?limit=1&access_token=${tokens.mapBoxToken}`)
        .then((response) => {
          const data = response.json();
          resolve(data);
        }, error => reject(error));
    }
  );

}

export default () => {
  if (firebase.auth().currentUser) {
    update(compile(newTemplate)({ }));
    const addKotBtn = document.querySelector('#addKot');
    const addressField = document.querySelector('#address');
    addressField.addEventListener('blur', () => {
      calcCoords(addressField)
        .then((coords) => {
          // document.querySelector('#coords').innerHTML = coords;
          document.querySelector('#lng').innerHTML = coords.features[0].center[1];
          document.querySelector('#lat').innerHTML = coords.features[0].center[0];
        })
    });
    addKotBtn.addEventListener('click', (e) => {
      e.preventDefault();
      createRoom();
    });
  } else {
    window.location.replace('/');
  }
};