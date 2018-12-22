import { getInstance } from '../firebase/firebase';

const firebase = getInstance();

/**
 * toggles the kot menu
 */
const toggleMenu = () => {
  document.querySelector('.menu').classList.toggle('menu--down');
};

/**
 * Logs out current user
 */
const logout = () => {
  firebase.auth().signOut()
    .then(window.location.replace('#/'));
};

/**
 * Used to define the menu and it's actions on every page
 */
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
