import { compile } from 'handlebars';
import update from '../helpers/update';

const { getInstance } = require('../firebase/firebase');

const firebase = getInstance();

const loginTemplate = require('../templates/login.handlebars');

export default () => {
  update(compile(loginTemplate)());
  // Add logic
  const loginBtn = document.querySelector('#login-btn');

  loginBtn.addEventListener('click', () => {
    const email = document.querySelector('#email').value;
    const password = document.querySelector('#pass').value;

    firebase.auth().signInWithEmailAndPassword(email, password)
      .catch(error => console.log(error.message));
  });

  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      window.location.replace('/');
    }
  });
};
