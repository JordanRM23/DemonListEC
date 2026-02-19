import routes from './routes.js';

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
            isMobile: window.innerWidth <= 1023,
            menuOpen: false
        };
    },
    methods: {
        toggleMenu() {
            this.menuOpen = !this.menuOpen;
        },
        closeMenu() {
            this.menuOpen = false;
        },
        checkMobile() {
            this.isMobile = window.innerWidth <= 1023;
            if (!this.isMobile) {
                this.menuOpen = false;
            }
        }
    },
    mounted() {
        this.checkMobile();
        window.addEventListener('resize', this.checkMobile);
        
        // Cerrar menú al cambiar de ruta
        this.$router.afterEach(() => {
            this.menuOpen = false;
        });
    }
});

const router = VueRouter.createRouter({
    history: VueRouter.createWebHashHistory(),
    routes,
});

app.use(router);
app.mount('#app');