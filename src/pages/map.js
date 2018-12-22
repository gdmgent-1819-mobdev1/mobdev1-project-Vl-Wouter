import { compile } from 'handlebars';
import mapboxgl from 'mapbox-gl';
import update from '../helpers/update';
import tokens from '../config';
import { getInstance, getDb } from '../firebase/firebase';
import menuHelper from '../helpers/nav-functions';
import dataHelper from '../helpers/data-functions';

const firebase = getInstance();
const db = getDb();

const mapTemplate = require('../templates/map.handlebars');


export default () => {
  if(firebase.auth().currentUser) {
    const userPromise = dataHelper.getUserInfo(firebase.auth().currentUser.uid)
    const roomPromise = dataHelper.getRooms();

    Promise.all([userPromise, roomPromise])
      .then((values) => {
        const user = values[0];
        const rooms = values[1];
        user.type === 'owner' ? window.location.replace('#/rooms/list') : '';
        update(compile(mapTemplate)());
        menuHelper.defineMenu();
        mapboxgl.accessToken = tokens.mapBoxToken;
        const map = new mapboxgl.Map({
          container: 'map',
          style: 'mapbox://styles/mapbox/streets-v9',
          zoom: 12,
          center: [3.722610, 51.053992],
        });
        console.log(rooms);
        rooms.forEach((room) => {
          const marker = new mapboxgl.Marker()
            .setLngLat([room.directions.coords.lng, room.directions.coords.lat])
            .setPopup(new mapboxgl.Popup({ offset: 25 })
              .setHTML(`<p class='text-bold'>${room.directions.address}</p><p>€${room.price.price}</p><p><a href='#/rooms/${room.room_id}'>Meer info</a></p>`))
            .addTo(map);
        });
      });
  } else {
    window.location.replace('#/');
  }
  // let loading = true;
  // let user = null;
  // let rooms = {};
  // let student = true;
  // mapboxgl.accessToken = tokens.mapBoxToken;
  // update(compile(mapTemplate)({ loading }));
  // if (firebase.auth().currentUser) {
  //   db.ref(`users/${firebase.auth().currentUser.uid}`).once('value')
  //     .then((snapshot) => {
  //       user = snapshot.val();
  //       if (user.type === 'owner') {
  //         // window.location.replace('/');
  //       } else {
  //         student = true;
  //       }
  //       db.ref('rooms/').once('value')
  //         .then((room) => {
  //           rooms = room.val();
  //           console.log(rooms);
  //           loading = false;
  //           // rooms.forEach((roomdetail) => {
  //           //   const marker = new mapboxgl.Marker()
  //           //     .setLngLat([roomdetail.directions.coords.lng, roomdetail.directions.coords.lat])
  //           //     .addTo(map);
  //           // });
  //           update(compile(mapTemplate)({
  //             loading, student,
  //           }));
  //           menuHelper.defineMenu();
  //           const map = new mapboxgl.Map({
  //             container: 'map',
  //             style: 'mapbox://styles/mapbox/streets-v9',
  //             zoom: 12,
  //             center: [3.722610, 51.053992],
  //           });
  //           for (const roomdetail in rooms) {
  //             if (rooms.hasOwnProperty(roomdetail)) {
  //               const element = rooms[roomdetail];
  //               const marker = new mapboxgl.Marker()
  //                 .setLngLat([element.directions.coords.lat, element.directions.coords.lng])
  //                 .setPopup(new mapboxgl.Popup({ offset: 25 })
  //                 .setHTML(`<p class='text-bold'>${element.directions.address}</p><p>€${element.price.price}</p><p><a href='#/rooms/${roomdetail}'>Meer info</a></p>`))
  //                 .addTo(map);
  //             }
  //           }
  //         });
  //     });
  // } else {
  //   window.location.replace('/');
  // }
};
