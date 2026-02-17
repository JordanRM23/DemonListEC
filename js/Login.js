import { store } from '../main.js';

export default {
    template: `
        <main class="page-auth">
            <div class="auth-container">
                <h2 class="type-headline-md"> Iniciar Sesión</h2>
                
                <div v-if="error" class="error-message type-body">{{ error }}</div>
                
                <form @submit.prevent="handleLogin">
                    <div class="form-group">
                        <label class="type-label-lg">Usuario o Email</label>
                        <input 
                            type="text" 
                            v-model="form.username" 
                            placeholder="Tu usuario"
                            class="type-body"
                            required
                        />
                    </div>
                    
                    <div class="form-group">
                        <label class="type-label-lg">Contraseña</label>
                        <input 
                            type="password" 
                            v-model="form.password" 
                            placeholder="••••••••"
                            class="type-body"
                            required
                        />
                    </div>
                    
                    <button type="submit" class="btn btn-primary" :disabled="loading">
                        <span class="type-label-lg">
                            {{ loading ? 'Entrando...' : 'Entrar' }}
                        </span>
                    </button>
                </form>
                
                <button class="btn btn-secondary" @click="$router.push('/register')">
                    <span class="type-label-md">¿No tienes cuenta? Regístrate</span>
                </button>
            </div>
        </main>
    `,
    data() {
        return {
            form: {
                username: '',
                password: ''
            },
            loading: false,
            error: null
        };
    },
    methods: {
        async handleLogin() {
            this.loading = true;
            this.error = null;
            
            try {
                await store.login(this.form.username, this.form.password);
                this.$router.push('/submit');
            } catch (err) {
                this.error = 'Usuario o contraseña incorrectos';
            } finally {
                this.loading = false;
            }
        }
    }
};