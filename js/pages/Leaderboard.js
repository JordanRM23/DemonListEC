import { fetchLeaderboard } from '../content.js';
import { localize } from '../util.js';
import Spinner from '../components/Spinner.js';

export default {
    components: { Spinner },

    data: () => ({
        leaderboard: [],
        loading: true,
        selected: 0,
        err: [],
    }),

    template: `
        <main v-if="loading">
            <Spinner></Spinner>
        </main>

        <main v-else class="page-leaderboard-container">
            <div class="page-leaderboard">

                <div class="error-container">
                    <p class="error" v-if="err.length > 0">
                        La leaderboard quedó medio chueco, estos niveles no cargaron: {{ err.join(', ') }}
                    </p>
                </div>

                <div class="board-container">
                    <table class="board">
                        <tr v-for="(ientry, i) in leaderboard" :key="ientry.user">

                            <td class="rank">
                                <span class="player-name" :class="getNameClass(ientry.total)">
                                    #{{ i + 1 }}
                                </span>
                            </td>

                            <td class="total">
                                <span class="player-name" :class="getNameClass(ientry.total)">
                                    {{ localize(ientry.total) }}
                                </span>
                            </td>

                            <td class="user" :class="{ active: selected == i }">
                                <button @click="selected = i">
                                    <span class="player-name" :class="getNameClass(ientry.total)">
                                        {{ ientry.user }} ({{ getRankLabel(ientry.total) }})
                                    </span>
                                </button>
                            </td>

                        </tr>
                    </table>
                </div>

                <div class="player-container">

                    <div class="player" v-if="entry">

                        <h1>
                            <span class="player-name" :class="getNameClass(entry.total)">
                                #{{ selected + 1 }} {{ entry.user }}
                            </span>
                        </h1>

                        <!-- TAG -->
                        <div
                            v-if="role"
                            class="player-tag"
                            :class="role.class"
                            :style="role.style"
                        >
                            {{ role.name }}
                        </div>

                        <h3>
                            <span class="player-name" :class="getNameClass(entry.total)">
                                {{ localize(entry.total) }} puntos
                            </span>
                        </h3>

                    </div>
                </div>

            </div>
        </main>
    `,

    computed: {
        entry() {
            return this.leaderboard[this.selected];
        },

        role() {
            if (!this.entry) return null;

            const customRole = this.getPlayerRole(this.entry.user);

            if (customRole) return customRole;

            // Si no tiene rol custom, usa rango
            return this.getRankRole(this.entry.total);
        }
    },

    async mounted() {
        const [leaderboard, err] = await fetchLeaderboard();
        this.leaderboard = leaderboard;
        this.err = err;
        this.loading = false;
    },

    methods: {

        localize,

        /* ===== ROLES PERSONALIZADOS ===== */

        getPlayerRole(user) {

            const roles = {

                Zephyr: {
                    name: 'La cabra del six seven',
                    style: {
                        backgroundColor: '#ffaa00',
                        boxShadow: '0 0 8px rgba(255,170,0,0.7)'
                    }
                },

                venomioo: {
                    name: 'EX-ECDL',
                    style: {
                        backgroundColor: '#00c3ff',
                        boxShadow: '0 0 8px rgba(0,195,255,0.7)'
                    }
                },

                BeClan: {
                    name: 'Hijo del six seven',
                    style: {
                        backgroundColor: '#ff4444',
                        boxShadow: '0 0 8px rgba(255,68,68,0.7)'
                    }
                },

                milo: {
                    name: 'Furro',
                    style: {
                        backgroundColor: '#ff66cc',
                        boxShadow: '0 0 8px rgba(255,102,204,0.7)'
                    }
                },

                H3nkzx: {
                    name: 'Furro',
                    style: {
                        backgroundColor: '#ff66cc',
                        boxShadow: '0 0 8px rgba(255,102,204,0.7)'
                    }
                }

            };

            return roles[user] || null;
        },

        /* ===== ROLES POR RANGO ===== */

        getRankRole(total) {

            total = Number(total) || 0;

            if (total >= 7000) return { name: 'Rango X', class: 'rango-x' };
            if (total >= 6500) return { name: 'Rango IX', class: 'rango-ix' };
            if (total >= 5000) return { name: 'Rango VII', class: 'rango-vii' };
            if (total >= 3500) return { name: 'Rango V', class: 'rango-v' };
            if (total >= 2750) return { name: 'Rango IV', class: 'rango-iv' };
            if (total >= 1250) return { name: 'Rango II', class: 'rango-ii' };
            if (total >= 500) return { name: 'Rango I', class: 'rango-i' };

            return null;
        },

        /* ===== COLORES DE NOMBRE ===== */

        getNameClass(total) {
            total = Number(total) || 0;

            if (total >= 13000) return 'rank-13000';
            if (total >= 7000) return 'rank-7000';
            if (total >= 6500) return 'rank-6500';
            if (total >= 5750) return 'rank-5750';
            if (total >= 5000) return 'rank-5000';
            if (total >= 4250) return 'rank-4250';
            if (total >= 3500) return 'rank-3500';
            if (total >= 2750) return 'rank-2750';
            if (total >= 2000) return 'rank-2000';
            if (total >= 1250) return 'rank-1250';
            if (total >= 500) return 'rank-500';

            return 'rank-0';
        },

        getRankLabel(total) {
            total = Number(total) || 0;

            if (total >= 13000) return 'Rango X+';
            if (total >= 7000) return 'Rango X';
            if (total >= 6500) return 'Rango IX';
            if (total >= 5750) return 'Rango VIII';
            if (total >= 5000) return 'Rango VII';
            if (total >= 4250) return 'Rango VI';
            if (total >= 3500) return 'Rango V';
            if (total >= 2750) return 'Rango IV';
            if (total >= 2000) return 'Rango III';
            if (total >= 1250) return 'Rango II';
            if (total >= 500) return 'Rango I';

            return 'Sin Rango';
        }

    }
};
