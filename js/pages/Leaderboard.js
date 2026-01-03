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
                                <p class="type-label-lg">#{{ i + 1 }}</p>
                            </td>
                            <td class="total">
                                <p class="type-label-lg">{{ localize(ientry.total) }}</p>
                            </td>
                            <td class="user" :class="{ 'active': selected == i }">
                                <button @click="selected = i">
                                    <span
                                        class="type-label-lg player-name"
                                        :class="getNameClass(ientry.total)"
                                    >
                                        {{ ientry.user }}
                                    </span>
                                </button>
                            </td>
                        </tr>
                    </table>
                </div>
                <div class="player-container">
                    <div class="player" v-if="entry">
                        <h1 v-if="entry">
    <span
        class="player-name"
        :class="getNameClass(entry.total)"
    >
        #{{ selected + 1 }} {{ entry.user }}
    </span>
</h1>
                        <h3 v-if="entry">
    <span
        class="player-name"
        :class="getNameClass(entry.total)"
    >
        {{ localize(entry.total) }} puntos
    </span>
</h3>

                        <h2 v-if="entry.verified.length > 0">
                            First Victor ({{ entry.verified.length}})
                        </h2>
                        <table class="table" v-if="entry.verified.length > 0">
                            <tr v-for="score in entry.verified" :key="'v-' + score.level + score.rank">
                                <td class="rank">
                                    <p>#{{ score.rank }}</p>
                                </td>
                                <td class="level">
                                    <a class="type-label-lg" target="_blank" :href="score.link">
                                        {{ score.level }}
                                    </a>
                                </td>
                                <td class="score">
                                    <p>+{{ localize(score.score) }}</p>
                                </td>
                            </tr>
                        </table>

                        <h2 v-if="entry.completed.length > 0">
                            Completado ({{ entry.completed.length }})
                        </h2>
                        <table class="table" v-if="entry.completed.length > 0">
                            <tr v-for="score in entry.completed" :key="'c-' + score.level + score.rank">
                                <td class="rank">
                                    <p>#{{ score.rank }}</p>
                                </td>
                                <td class="level">
                                    <a class="type-label-lg" target="_blank" :href="score.link">
                                        {{ score.level }}
                                    </a>
                                </td>
                                <td class="score">
                                    <p>+{{ localize(score.score) }}</p>
                                </td>
                            </tr>
                        </table>

                        <h2 v-if="entry.progressed.length > 0">
                            Progreso ({{ entry.progressed.length}})
                        </h2>
                        <table class="table" v-if="entry.progressed.length > 0">
                            <tr v-for="score in entry.progressed" :key="'p-' + score.level + score.rank">
                                <td class="rank">
                                    <p>#{{ score.rank }}</p>
                                </td>
                                <td class="level">
                                    <a class="type-label-lg" target="_blank" :href="score.link">
                                        {{ score.percent }}% {{ score.level }}
                                    </a>
                                </td>
                                <td class="score">
                                    <p>+{{ localize(score.score) }}</p>
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
            return this.leaderboard[this.selected];
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
        getNameClass(total) {
            total = Number(total) || 0;
            if (total >= 10000) return 'rank-10000';   // 10 000+
            if (total >= 9000)  return 'rank-9000';    // 9000 – 9999
            if (total >= 8000)  return 'rank-8000';    // 8000 – 8999
            if (total >= 7000)  return 'rank-7000';    // 7000 – 7999
            if (total >= 6000)  return 'rank-6000';    // 6000 – 6999
            if (total >= 5000)  return 'rank-5000';    // 5000 – 5999
            if (total >= 4000)  return 'rank-4000';    // 4000 – 4999
            if (total >= 3000)  return 'rank-3000';    // 3000 – 3999
            if (total >= 2000)  return 'rank-2000';    // 2000 – 2999
            if (total >= 1000)  return 'rank-1000';    // 1000 – 1999
            return 'rank-0';                           // 0 – 999
        },
    },
};
