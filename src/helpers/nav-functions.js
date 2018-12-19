const toggleMenu = () => {
  document.querySelector('.menu').classList.toggle('menu--down');
};

const defineMenu = () => {
  const menuBtn = document.querySelector('#toggleMenu');
  menuBtn.addEventListener('click', (e) => {
    e.preventDefault();
    toggleMenu();
  });
};

export default {
  toggleMenu,
  defineMenu,
};
