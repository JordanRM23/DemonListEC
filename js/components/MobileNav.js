import { store } from '../main.js';

export default {
    template: `
        <div class="mobile-nav-container">
            <button class="mobile-menu-toggle" @click="isOpen = !isOpen">
                <span class="hamburger" :class="{ 'open': isOpen }"></span>
            </button>
            
            <transition name="slide">
                <nav class="mobile-nav" v-if="isOpen">
                    <router-link 
                        v-for="item in menuItems" 
                        :key="item.to"
                        class="mobile-nav__tab" 
                        :to="item.to" 
                        @click="isOpen = false"
                    >
                        <span class="type-label-lg">{{ item.label }}</span>
                    </router-link>
                    
                    <div class="mobile-nav__actions">
                        <a 
                            v-for="action in actions" 
                            :key="action.href"
                            class="mobile-nav__cta" 
                            :href="action.href" 
                            :target="action.external ? '_blank' : null"
                        >
                            {{ action.icon }} {{ action.label }}
                        </a>
                    </div>
                </nav>
            </transition>
            
            <div class="mobile-overlay" v-if="isOpen" @click="isOpen = false"></div>
        </div>
    `,
    data() {
        return {
            isOpen: false,
            store,
            menuItems: [
                { to: '/', label: 'Lista' },
                { to: '/leaderboard', label: 'Jugadores' },
                { to: '/roulette', label: 'Ruleta' },
                { to: '/changelog', label: 'Changelog' }
            ],
            actions: [
                { href: 'https://discord.gg/JskKyjzmws', label: 'Discord', icon: '💬', external: true },
                { href: 'https://discord.gg/JskKyjzmws', label: 'Enviar Records', icon: '📝', external: true },
                { href: '#', label: 'Login', icon: '🔑', external: false }
            ]
        };
    },
    watch: {
        // Cerrar menú al cambiar de ruta
        $route() {
            this.isOpen = false;
        }
    }
};