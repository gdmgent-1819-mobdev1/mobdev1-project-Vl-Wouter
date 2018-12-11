import Navigo from 'navigo';
import handlebars, { compile } from 'handlebars';
import './styles/main.scss';

import routes from './routes';

// Partials
const header = require('./partials/header.handlebars');
const footer = require('./partials/footer.handlebars');

// Register the partial components
handlebars.registerPartial('header', compile(header)({ logo: '<img src="../src/assets/SVG/Kotlife_Logo.svg" alt="logo" class="header__logo">' }));
handlebars.registerPartial('footer', compile(footer)());

// Router logic to load the correct template when needed
const router = new Navigo(window.location.origin, true);

routes.forEach((route) => {
  router.on(route.path, () => {
    route.view();
    router.updatePageLinks();
  });
});

// This catches all non-existing routes and redirects back to the home
router.notFound(() => {
  router.navigate('/');
});
router.resolve();
window.onload = () => {
  router.navigate(window.location.hash.split('/')[1]);
};
