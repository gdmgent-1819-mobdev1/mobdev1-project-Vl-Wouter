// Pages
import HomeView from './pages/home';
import LoginView from './pages/login';
import RegisterView from './pages/register';
import DashView from './pages/dashboard';
import ListView from './pages/list';
import ProfileView from './pages/profile';
import NewView from './pages/new';
import DetailView from './pages/detail';
import MapView from './pages/map';
import FavView from './pages/favorites';
import GameView from './pages/game';

export default [
  { path: '/', view: HomeView },
  { path: '/login', view: LoginView },
  { path: '/register', view: RegisterView },
  { path: '/dash', view: DashView },
  { path: '/rooms/list', view: ListView },
  { path: '/profile', view: ProfileView },
  { path: '/rooms/new', view: NewView },
  { path: '/rooms/map', view: MapView },
  { path: '/rooms/KotOrNot', view: GameView },
  { path: '/rooms/:id', view: DetailView },
  { path: '/favorites', view: FavView },
];
