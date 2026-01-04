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
First Victor ({{ entry.verified.length}})
</span>
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
<span
class="player-name"
:class="getNameClass(entry.total)"
>
Progreso ({{ entry.progressed.length}})
</span>
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

if (total >= 20000) return 'rank-20000'; // rojo gradiente
if (total >= 10000) return 'rank-10000';
if (total >= 9000) return 'rank-9000';
if (total >= 8000) return 'rank-8000';
if (total >= 7000) return 'rank-7000';
if (total >= 6000) return 'rank-6000';
if (total >= 5000) return 'rank-5000';
if (total >= 4000) return 'rank-4000';
if (total >= 3000) return 'rank-3000';
if (total >= 2000) return 'rank-2000';
if (total >= 1000) return 'rank-1000';
return 'rank-0';
},
getRankLabel(total) {
total = Number(total) || 0;

if (total >= 20000) return 'Rango X+';
if (total >= 10000) return 'Rango X';
if (total >= 9000) return 'Rango 9';
if (total >= 8000) return 'Rango 8';
if (total >= 7000) return 'Rango 7';
if (total >= 6000) return 'Rango 6';
if (total >= 5000) return 'Rango 5';
if (total >= 4000) return 'Rango 4';
if (total >= 3000) return 'Rango 3';
if (total >= 2000) return 'Rango 2';
if (total >= 1000) return 'Rango 1';
return 'Rango 0';
},
},
};
