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
                                <p class="type-label-lg">
                                    <span
                                        class="player-name"
                                        :class="getNameClass(ientry.total)"
                                    >
                                        #{{ i + 1 }}
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
                            <td class="user" :class="{ 'active': selected == i }">
                                <button @click="selected = i">
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
    v-if="getPlayerRole(entry.user)"
    class="player-tag"
>
    {{ getPlayerRole(entry.user) }}
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

     getPlayerRole(user) {
    const roles = {
        'Zephyr': 'La cabra del six seven',
        'venomioo': 'EX-ECDL',
        'Locked': 'EX-ECDL',
        'RaymanNinja': 'EX-ECDL',
        'Victor71GD': 'EX-ECDL',
        'Edgar214': 'EX-ECDL',
        'Stevensitos999': 'EX-ECDL',
    };

    return roles[user] || null;
},

        getLevelPosClass(rank) {
            rank = Number(rank) || 0;

            if (rank >= 1 && rank <= 50) return 'level-pos-top50';
            if (rank >= 51 && rank <= 100) return 'level-pos-51-100';
            if (rank >= 101 && rank <= 150) return 'level-pos-101-150';
            return 'level-pos-151plus';
        },

        getNameClass(total) {
            total = Number(total) || 0;

            if (total >= 13000) return 'rank-13000';
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

            if (total >= 13000) return 'Rango X+';
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
