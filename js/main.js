import routes from './routes.js';

export const store = Vue.reactive({
    dark: JSON.parse(localStorage.getItem('dark')) || false,
    
    // Auth state
    user: null,
    isAuthenticated: false,
    myRecords: [],
    
    toggleDark() {
        this.dark = !this.dark;
        localStorage.setItem('dark', JSON.stringify(this.dark));
    },
    
    // Auth methods
    async login(username, password) {
        // Simulación - Reemplazar con tu API real
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (username && password) {
                    this.user = {
                        id: 1,
                        username: username,
                        email: username + '@gmail.com',
                        role: 'player'
                    };
                    this.isAuthenticated = true;
                    localStorage.setItem('user', JSON.stringify(this.user));
                    this.loadRecords();
                    resolve(this.user);
                } else {
                    reject(new Error('Credenciales inválidas'));
                }
            }, 500);
        });
    },
    
    async register(username, email, password) {
        // Simulación - Reemplazar con tu API real
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (username && email && password) {
                    this.user = {
                        id: Date.now(),
                        username: username,
                        email: email,
                        role: 'player'
                    };
                    this.isAuthenticated = true;
                    localStorage.setItem('user', JSON.stringify(this.user));
                    this.myRecords = [];
                    resolve(this.user);
                } else {
                    reject(new Error('Datos incompletos'));
                }
            }, 500);
        });
    },
    
    logout() {
        this.user = null;
        this.isAuthenticated = false;
        this.myRecords = [];
        localStorage.removeItem('user');
    },
    
    async submitRecord(recordData) {
        // Simulación - Reemplazar con tu API real
        return new Promise((resolve) => {
            setTimeout(() => {
                const newRecord = {
                    id: Date.now(),
                    ...recordData,
                    status: 'pending',
                    date: new Date().toISOString()
                };
                this.myRecords.unshift(newRecord);
                this.saveRecords();
                resolve(newRecord);
            }, 800);
        });
    },
    
    loadRecords() {
        const saved = localStorage.getItem(`records_${this.user?.id}`);
        if (saved) {
            this.myRecords = JSON.parse(saved);
        } else {
            // Datos de ejemplo para demo
            this.myRecords = [
                { 
                    id: 1, 
                    level: 'Bloodbath', 
                    progress: 100, 
                    videoUrl: 'https://youtube.com/watch?v=xxx', 
                    status: 'approved', 
                    date: '2024-01-15T00:00:00.000Z' 
                },
                { 
                    id: 2, 
                    level: 'Yatagarasu', 
                    progress: 85, 
                    videoUrl: 'https://youtube.com/watch?v=yyy', 
                    status: 'pending', 
                    date: '2024-02-10T00:00:00.000Z' 
                }
            ];
        }
    },
    
    saveRecords() {
        if (this.user) {
            localStorage.setItem(`records_${this.user.id}`, JSON.stringify(this.myRecords));
        }
    },
    
    init() {
        // Restaurar sesión
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
            this.user = JSON.parse(savedUser);
            this.isAuthenticated = true;
            this.loadRecords();
        }
    }
});

const app = Vue.createApp({
    data: () => ({ store }),
    computed: {
        userInitials() {
            if (!store.user?.username) return '';
            return store.user.username.substring(0, 2).toUpperCase();
        }
    }
});

const router = VueRouter.createRouter({
    history: VueRouter.createWebHashHistory(),
    routes,
});

app.use(router);

// Inicializar store
store.init();

app.mount('#app');