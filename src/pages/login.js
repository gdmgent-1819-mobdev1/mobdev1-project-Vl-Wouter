import { compile } from 'handlebars';
import update from '../helpers/update';
import { getInstance } from '../firebase/firebase';

const firebase = getInstance();

const loginTemplate = require('../templates/login.handlebars');


const login = (email, pass) => {
  console.log(email);
  firebase.auth().signInWithEmailAndPassword(email, pass)
    .then(() => window.location.replace('#/dash'))
    .catch(error => console.log(error));
};

export default () => {
  if(firebase.auth().currentUser) {
    window.location.replace('#/dash');
  }
  update(compile(loginTemplate)());

  const loginbtn = document.querySelector('#login-btn');

  loginbtn.addEventListener('click', (e) => {
    e.preventDefault();
    const email = document.querySelector('#email').value;
    const password = document.querySelector('#pass').value;
    login(email, password);
  });
};
