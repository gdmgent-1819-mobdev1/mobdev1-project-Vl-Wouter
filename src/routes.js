// Pages
import HomeView from './pages/home';
import LoginView from './pages/login';
import RegisterView from './pages/register';

export default [
  { path: '/', view: HomeView },
  { path: '/login', view: LoginView },
  { path: '/register', view: RegisterView },
];
