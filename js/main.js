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
            isMobile: window.innerWidth < 1024,
            mobileMenuOpen: false
        };
    },
    mounted() {
        window.addEventListener('resize', () => {
            const newIsMobile = window.innerWidth < 1024;
            if (this.isMobile !== newIsMobile) {
                this.isMobile = newIsMobile;
                this.mobileMenuOpen = false;
            }
        });
        
        // Cerrar menú al cambiar de ruta
        this.$router.afterEach(() => {
            this.mobileMenuOpen = false;
        });
    }
});

const router = VueRouter.createRouter({
    history: VueRouter.createWebHashHistory(),
    routes,
});

app.use(router);
app.mount('#app');