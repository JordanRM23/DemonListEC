import { fetchLeaderboard } from '../content.js';
import { localize } from '../util.js';

import Spinner from '../components/Spinner.js';

export default {
    components: {
        Spinner,
    },
    data: () => ({
        leaderboard: [],
        loading: true,
        selected: 0,
        err: [],
        searchQuery: '',
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

                <div class="search-box">
                    <input 
                        type="text" 
                        v-model="searchQuery" 
                        placeholder="Buscar jugador..." 
                    />
                </div>

                <div class="board-container">
                    <div v-if="filteredLeaderboard.length === 0" class="no-results">
                        No se encontraron jugadores
                    </div>
                    <table class="board" v-else>
                        <tr v-for="(ientry, i) in filteredLeaderboard" :key="ientry.user" @click="selected = getOriginalIndex(ientry.user)">
                            <td class="rank">
                                <p class="type-label-lg">
                                    <span
                                        class="player-name"
                                        :class="getNameClass(ientry.total)"
                                    >
                                        #{{ getOriginalIndex(ientry.user) + 1 }}
                                    </span>
                                </p>
                            </td>
                            <td class="total">
                                <p class="type-label-lg">
                                    <span
                                        class="player-name"
                                        :class="getNameClass(ientry.total)"
                                    >
                                        {{ localize(ientry.total) }}
                                    </span>
                                </p>
                            </td>
                            <td class="user" :class="{ 'active': selected == getOriginalIndex(ientry.user) }">
                                <button @click="selected = getOriginalIndex(ientry.user)">
                                 <span
                                    class="type-label-lg player-name"
                                        :class="getNameClass(ientry.total)"
                                    >
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
                            <span
                                class="player-name"
                                :class="getNameClass(entry.total)"
                            >
                                #{{ selected + 1 }} {{ entry.user }} ({{ getRankLabel(entry.total) }})
                            </span>
                        </h1>

                        <div
                            v-if="getPlayerTags(entry.user).length"
                            class="player-tags"
                        >
                            <span
                                v-for="(tag, index) in getPlayerTags(entry.user)"
                                :key="index"
                                class="player-tag"
                                :class="tag.class"
                            >
                                {{ tag.text }}
                            </span>
                        </div>

                        <h3>
                            <span
                                class="player-name"
                                :class="getNameClass(entry.total)"
                            >
                                {{ localize(entry.total) }} puntos
                            </span>
                        </h3>

                        <h2 v-if="entry.verified.length > 0">
                            <span
                                class="player-name"
                                :class="getNameClass(entry.total)"
                            >
                                First Victor ({{ entry.verified.length }})
                            </span>
                        </h2>

                        <table class="table" v-if="entry.verified.length > 0">
                            <tr v-for="score in entry.verified" :key="'v-' + score.level + score.rank">
                                <td class="rank">
                                    <p :class="getLevelPosClass(score.rank)">
                                        #{{ score.rank }}
                                    </p>
                                </td>
                                <td class="level">
                                    <a
                                        class="type-label-lg"
                                        :class="getLevelPosClass(score.rank)"
                                        target="_blank"
                                        :href="score.link"
                                    >
                                        {{ score.level }}
                                    </a>
                                </td>
                                <td class="score">
                                    <p :class="getLevelPosClass(score.rank)">
                                        +{{ localize(score.score) }}
                                    </p>
                                </td>
                            </tr>
                        </table>

                        <h2 v-if="entry.completed.length > 0">
                            <span
                                class="player-name"
                                :class="getNameClass(entry.total)"
                            >
                                Completado ({{ entry.completed.length }})
                            </span>
                        </h2>

                        <table class="table" v-if="entry.completed.length > 0">
                            <tr v-for="score in entry.completed" :key="'c-' + score.level + score.rank">
                                <td class="rank">
                                    <p :class="getLevelPosClass(score.rank)">
                                        #{{ score.rank }}
                                    </p>
                                </td>
                                <td class="level">
                                    <a
                                        class="type-label-lg"
                                        :class="getLevelPosClass(score.rank)"
                                        target="_blank"
                                        :href="score.link"
                                    >
                                        {{ score.level }}
                                    </a>
                                </td>
                                <td class="score">
                                    <p :class="getLevelPosClass(score.rank)">
                                        +{{ localize(score.score) }}
                                    </p>
                                </td>
                            </tr>
                        </table>

                        <h2 v-if="entry.progressed.length > 0">
                            <span
                                class="player-name"
                                :class="getNameClass(entry.total)"
                            >
                                Progreso ({{ entry.progressed.length }})
                            </span>
                        </h2>

                        <table class="table" v-if="entry.progressed.length > 0">
                            <tr v-for="score in entry.progressed" :key="'p-' + score.level + score.rank">
                                <td class="rank">
                                    <p :class="getLevelPosClass(score.rank)">
                                        #{{ score.rank }}
                                    </p>
                                </td>
                                <td class="level">
                                   <a
                                        class="type-label-lg"
                                        :class="getLevelPosClass(score.rank)"
                                        target="_blank"
                                        :href="score.link"
                                    >
                                        {{ score.percent }}% {{ score.level }}
                                    </a>
                                </td>
                                <td class="score">
                                    <p :class="getLevelPosClass(score.rank)">
                                        +{{ localize(score.score) }}
                                    </p>
                                </td>
                            </tr>
                        </table>
                    </div>
                </div>
            </div>
        </main>
    `,
    computed: {
        entry() {
            if (!this.leaderboard[this.selected]) {
                return this.leaderboard[0] || null;
            }
            return this.leaderboard[this.selected];
        },
        filteredLeaderboard() {
            if (!this.searchQuery) return this.leaderboard;
            const query = this.searchQuery.toLowerCase();
            return this.leaderboard.filter(entry => 
                entry.user.toLowerCase().includes(query)
            );
        },
    },
    async mounted() {
        const [leaderboard, err] = await fetchLeaderboard();
        this.leaderboard = leaderboard;
        this.err = err;
        this.loading = false;
    },
    methods: {
        localize,

        getOriginalIndex(user) {
            return this.leaderboard.findIndex(entry => entry.user === user);
        },

        getLevelPosClass(rank) {
            rank = Number(rank) || 0;

            if (rank >= 1 && rank <= 75) return 'level-pos-top75';
            if (rank >= 76 && rank <= 150) return 'level-pos-76-150';
            return 'level-pos-151plus';
        },

        getNameClass(total) {
            total = Number(total) || 0;

            if (total >= 11000) return 'rank-11000';
            if (total >= 7000)  return 'rank-7000';
            if (total >= 6500)  return 'rank-6500';
            if (total >= 5750)  return 'rank-5750';
            if (total >= 5000)  return 'rank-5000';
            if (total >= 4250)  return 'rank-4250';
            if (total >= 3500)  return 'rank-3500';
            if (total >= 2750)  return 'rank-2750';
            if (total >= 2000)  return 'rank-2000';
            if (total >= 1250)  return 'rank-1250';
            if (total >= 500)   return 'rank-500';

            return 'rank-0';
        },

        getRankLabel(total) {
            total = Number(total) || 0;

            if (total >= 11000) return 'Rango X+';
            if (total >= 7000)  return 'Rango X';
            if (total >= 6500)  return 'Rango IX';
            if (total >= 5750)  return 'Rango VIII';
            if (total >= 5000)  return 'Rango VII';
            if (total >= 4250)  return 'Rango VI';
            if (total >= 3500)  return 'Rango V';
            if (total >= 2750)  return 'Rango IV';
            if (total >= 2000)  return 'Rango III';
            if (total >= 1250)  return 'Rango II';
            if (total >= 500)   return 'Rango I';

            return 'Sin Rango';
        },
    },
};
