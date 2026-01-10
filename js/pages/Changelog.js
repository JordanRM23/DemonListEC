import Spinner from '../components/Spinner.js';
import { fetchChangelog } from '../content.js';

export default {
    components: { Spinner },
    data: () => ({
        loading: true,
        changelog: [],
        toasts: [],
    }),
    async mounted() {
        window.addEventListener('add-toast', this.handleToastEvent);
        this.changelog = await fetchChangelog();
        this.loading = false;
    },
    beforeUnmount() {
        window.removeEventListener('add-toast', this.handleToastEvent);
    },
    methods: {
        handleToastEvent(e) {
            const toast = { id: Date.now() + Math.random(), message: e.detail.message };
            this.toasts.push(toast);
            setTimeout(() => this.removeToastById(toast.id), 4000);
        },
        removeToastById(id) { this.toasts = this.toasts.filter(t => t.id !== id); },
    },
    template: `
        <main v-if="loading"><Spinner/></main>
        <main v-else class="page-changelog-wrapper">
            <div class="page-changelog-content">
                <div class="page-changelog">
                    <h1>Changelog</h1>
                    <p class="changelog-subtitle">
                        Este es el registro de cambios de la lista. Para el registro de cambios del sitio web, 
                        <a href="https://discord.com/invite/JskKyjzmws" class="link-hover-underline" target="_blank">click aqui</a>.
                    </p>
                    <p class="changelog-subtitle">Las entradas debajo de cada fecha se enumeran de la más nueva a la más antigua.</p>
                    <template v-for="entry in changelog" :key="entry.date">
                        <p class="changelog-date">{{ entry.date }}</p>
                        <p v-for="(line, i) in entry.entries" :key="i">- {{ line }}</p>
                    </template>
                </div>
            </div>
            <div class="toast-container">
                <transition-group name="toast" tag="div" class="toast-stack">
                    <div v-for="toast in toasts" :key="toast.id" class="toast">
                        <button class="toast-close" @click="removeToastById(toast.id)">×</button>
                        {{ toast.message }}
                    </div>
                </transition-group>
            </div>
        </main>
    `
};
