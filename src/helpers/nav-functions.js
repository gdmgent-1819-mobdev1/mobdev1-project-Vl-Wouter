import { getInstance } from '../firebase/firebase';

const firebase = getInstance();

const toggleMenu = () => {
  document.querySelector('.menu').classList.toggle('menu--down');
};

const logout = () => {
  firebase.auth().signOut()
    .then(window.location.replace('#/'));
};

const defineMenu = () => {
  const menuBtn = document.querySelector('#toggleMenu');
  menuBtn.addEventListener('click', (e) => {
    e.preventDefault();
    toggleMenu();
  });

  const logoutBtn = document.querySelector('#logout-btn');
  logoutBtn.addEventListener('click', logout);
};

export default {
  toggleMenu,
  defineMenu,
};
