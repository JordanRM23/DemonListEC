import List from './pages/List.js';
import Leaderboard from './pages/Leaderboard.js';
import Roulette from './pages/Roulette.js';
import Login from './pages/Login.js';
import Register from './pages/Register.js';
import Submit from './pages/Submit.js';
import { store } from './main.js';

// Guard de autenticación
const requireAuth = (to, from, next) => {
    if (!store.isAuthenticated) {
        next('/login');
    } else {
        next();
    }
};

export default [
    { path: '/', component: List },
    { path: '/leaderboard', component: Leaderboard },
    { path: '/roulette', component: Roulette },
    { path: '/login', component: Login },
    { path: '/register', component: Register },
    { 
        path: '/submit', 
        component: Submit,
        beforeEnter: requireAuth
    },
];