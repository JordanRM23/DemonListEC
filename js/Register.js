import { store } from '../main.js';

export default {
    template: `
        <main class="page-auth">
            <div class="auth-container">
                <h2 class="type-headline-md"> Crear Cuenta</h2>
                
                <div v-if="error" class="error-message type-body">{{ error }}</div>
                
                <form @submit.prevent="handleRegister">
                    <div class="form-group">
                        <label class="type-label-lg">Usuario</label>
                        <input 
                            type="text" 
                            v-model="form.username" 
                            placeholder="Tu nombre de usuario"
                            class="type-body"
                            required
                        />
                    </div>
                    
                    <div class="form-group">
                        <label class="type-label-lg">Email</label>
                        <input 
                            type="email" 
                            v-model="form.email" 
                            placeholder="tu@email.com"
                            class="type-body"
                            required
                        />
                    </div>
                    
                    <div class="form-group">
                        <label class="type-label-lg">Contraseña</label>
                        <input 
                            type="password" 
                            v-model="form.password" 
                            placeholder="Mínimo 6 caracteres"
                            class="type-body"
                            required
                            minlength="6"
                        />
                    </div>
                    
                    <div class="form-group">
                        <label class="type-label-lg">Confirmar Contraseña</label>
                        <input 
                            type="password" 
                            v-model="form.confirmPassword" 
                            placeholder="Repite tu contraseña"
                            class="type-body"
                            required
                        />
                    </div>
                    
                    <button type="submit" class="btn btn-primary" :disabled="loading">
                        <span class="type-label-lg">
                            {{ loading ? 'Creando cuenta...' : 'Crear Cuenta' }}
                        </span>
                    </button>
                </form>
                
                <button class="btn btn-secondary" @click="$router.push('/login')">
                    <span class="type-label-md">¿Ya tienes cuenta? Inicia sesión</span>
                </button>
            </div>
        </main>
    `,
    data() {
        return {
            form: {
                username: '',
                email: '',
                password: '',
                confirmPassword: ''
            },
            loading: false,
            error: null
        };
    },
    methods: {
        async handleRegister() {
            if (this.form.password !== this.form.confirmPassword) {
                this.error = 'Las contraseñas no coinciden';
                return;
            }
            
            this.loading = true;
            this.error = null;
            
            try {
                await store.register(
                    this.form.username, 
                    this.form.email, 
                    this.form.password
                );
                this.$router.push('/submit');
            } catch (err) {
                this.error = 'Error al crear la cuenta';
            } finally {
                this.loading = false;
            }
        }
    }
};