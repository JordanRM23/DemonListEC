import routes from './routes.js';
import MobileNav from './components/MobileNav.js';

export const store = Vue.reactive({
    dark: JSON.parse(localStorage.getItem('dark')) || false,
    toggleDark() {
        this.dark = !this.dark;
        localStorage.setItem('dark', JSON.stringify(this.dark));
    },
});

const app = Vue.createApp({
    data() {
        return {
            store,
            isMobile: window.innerWidth < 1024
        };
    },
    components: {
        MobileNav
    },
    mounted() {
        window.addEventListener('resize', () => {
            this.isMobile = window.innerWidth < 1024;
        });
    }
});

const router = VueRouter.createRouter({
    history: VueRouter.createWebHashHistory(),
    routes,
});

app.use(router);
app.mount('#app');