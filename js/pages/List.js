import { store } from "../main.js";
import { embed } from "../util.js";
import { score } from "../score.js";
import { fetchEditors, fetchList } from "../content.js";

import Spinner from "../components/Spinner.js";
import LevelAuthors from "../components/List/LevelAuthors.js";

const roleIconMap = {
    owner: "crown",
    admin: "user-gear",
    helper: "user-shield",
    dev: "code",
    trial: "user-lock",
};

export default {
    components: { Spinner, LevelAuthors },
    template: `
        <main v-if="loading">
            <Spinner></Spinner>
        </main>
        <main v-else class="page-list">
            <div class="list-container">
                <!-- Sistema de Búsqueda y Filtros -->
                <div class="search-filter-container">
                    <div class="search-box">
                        <input 
                            type="text" 
                            v-model="searchQuery" 
                            placeholder="Buscar nivel"
                            class="type-body search-input"
                        />
                        <span class="search-icon"></span>
                    </div>
                    
                    <div class="filters">
                        <select v-model="filterType" class="type-label-md filter-select">
                            <option value="all">Todos los niveles</option>
                            <option value="main">Main List (1-75)</option>
                            <option value="extended">Extended (76-150)</option>
                            <option value="legacy">Legacy (150+)</option>
                        </select>
                        
                        <select v-model="sortBy" class="type-label-md filter-select">
                            <option value="rank">Ordenar por Ranking</option>
                            <option value="name">Ordenar por Nombre</option>
                            <option value="records">Más Records</option>
                        </select>
                    </div>
                    
                    <div class="results-info type-label-sm">
                        Mostrando {{ filteredList.length }} de {{ list.length }} niveles
                    </div>
                </div>

                <table class="list" v-if="filteredList.length > 0">
                    <tr v-for="([level, err], i) in filteredList" :key="level?.path || i">
                        <td class="rank">
                            <p v-if="getOriginalRank(level) <= 150" class="type-label-lg">#{{ getOriginalRank(level) }}</p>
                            <p v-else class="type-label-lg">Legacy</p>
                        </td>
                        <td class="level" :class="{ 'active': selected == getOriginalIndex(level), 'error': !level }">
                            <button @click="selected = getOriginalIndex(level)">
                                <span class="type-label-lg">{{ level?.name || \`Error (\${err}.json)\` }}</span>
                                <span v-if="level && hasManyRecords(level)" class="record-badge">🔥</span>
                            </button>
                        </td>
                    </tr>
                </table>
                
                <div v-else class="no-results type-body">
                    <p>No se encontraron niveles que coincidan con tu búsqueda.</p>
                    <button @click="resetFilters" class="btn-reset type-label-md">Limpiar filtros</button>
                </div>
            </div>
            
            <div class="level-container">
                <div class="level" v-if="level">
                    <h1>{{ level.name }}</h1>
                    <LevelAuthors :author="level.author" :creators="level.creators" :verifier="level.verifier"></LevelAuthors>
                    <iframe class="video" id="videoframe" :src="video" frameborder="0"></iframe>
                    <ul class="stats">
                        <li>
                            <div class="type-title-sm">Puntos al completar</div>
                            <p>{{ score(selected + 1, 100, level.percentToQualify) }}</p>
                        </li>
                        <li>
                            <div class="type-title-sm">ID</div>
                            <p>{{ level.id }}</p>
                        </li>
                        <li>
                            <div class="type-title-sm">Password</div>
                            <p>{{ level.password || 'Free to Copy' }}</p>
                        </li>
                    </ul>
                    <h2>Records</h2>
                    <p v-if="selected + 1 <= 75"><strong>{{ level.percentToQualify }}%</strong> o mas para calificar</p>
                    <p v-else-if="selected +1 <= 150"><strong>100%</strong> o mas para calificar</p>
                    <p v-else>Este nivel no acepta nuevos records.</p>
                    <table class="records">
                        <tr v-for="record in level.records" class="record">
                            <td class="percent">
                                <p>{{ record.percent }}%</p>
                            </td>
                            <td class="user">
                                <a :href="record.link" target="_blank" class="type-label-lg">{{ record.user }}</a>
                            </td>
                            <td class="mobile">
                                <img v-if="record.mobile" :src="\`/assets/phone-landscape\${store.dark ? '-dark' : ''}.svg\`" alt="Mobile">
                            </td>
                            <td class="hz">
                                <p>{{ record.hz }}Hz</p>
                            </td>
                        </tr>
                    </table>
                </div>
                <div v-else class="level" style="height: 100%; justify-content: center; align-items: center;">
                    <p>Ñaño, aquí no hay nada… parece que te fuiste por otro camino</p>
                </div>
            </div>
            
            <div class="meta-container">
                <div class="meta">
                    <div class="errors" v-show="errors.length > 0">
                        <p class="error" v-for="error of errors">{{ error }}</p>
                    </div>
                    <div class="og">
                        <p class="type-label-md">Ranking ECUADOR en la <a href="https://aredl.net/profile/country/218" target="_blank">The All Rated Extreme Demons List </a></p>
                    </div>
                    <template v-if="editors">
                        <h3>List Editors</h3>
                        <ol class="editors">
                            <li v-for="editor in editors">
                                <img :src="\`/assets/\${roleIconMap[editor.role]}\${store.dark ? '-dark' : ''}.svg\`" :alt="editor.role">
                                <a v-if="editor.link" class="type-label-lg link" target="_blank" :href="editor.link">{{ editor.name }}</a>
                                <p v-else>{{ editor.name }}</p>
                            </li>
                        </ol>
                    </template>
                    <h3>Reglas para los Records</h3>
                    <p>Ser Ecuatoriano</p>
                    <p>Para enviar un récord, el jugador necesita un vídeo para demostrar su legitimidad.</p>
                    <p>Los récords no serán aceptados si no tienen clics audibles claros en todo momento.</p>
                    <p>Si se descubre que un jugador hace trampa, será eliminado de la lista.</p>
                    <p>El porcentaje mínimo se refleja en cada nivel.</p>
                    <p>Videos después del 1/1/2026 deben incluir cheats indicator obligatorio.</p>
                    <p>Records ya aceptados en Pointercrate, AREDL o GDL pueden aceptarse.</p>
                    <p>No utilices secret way ni bugs.</p>
                    <p>No completar versiones nerfeadas o LDM exagerado.</p>
                    <p>Para dudas, contacta al staff de GDEC en Discord.</p>
                    <h3>Leaderboard</h3>
                    <p>#1 - EduChavez | 277,461 Stars</p>
                    <div class="og">
                        <p class="type-label-md">Website layout made by <a href="https://tsl.pages.dev/" target="_blank">TheShittyList</a></p>
                    </div>
                </div>
            </div>
        </main>
    `,
    data: () => ({
        list: [],
        editors: [],
        loading: true,
        selected: 0,
        errors: [],
        roleIconMap,
        store,
        // Nuevos datos para búsqueda y filtros
        searchQuery: '',
        filterType: 'all',
        sortBy: 'rank'
    }),
    computed: {
        level() {
            return this.list[this.selected]?.[0];
        },
        video() {
            if (!this.level) return '';
            if (!this.level.showcase) {
                return embed(this.level.verification);
            }
            return embed(
                this.toggledShowcase
                    ? this.level.showcase
                    : this.level.verification
            );
        },
        // Lista filtrada y ordenada
        filteredList() {
            let result = [...this.list];
            
            // Filtro por tipo (main/extended/legacy)
            if (this.filterType !== 'all') {
                result = result.filter(([level, err], index) => {
                    const rank = index + 1;
                    if (this.filterType === 'main') return rank <= 75;
                    if (this.filterType === 'extended') return rank > 75 && rank <= 150;
                    if (this.filterType === 'legacy') return rank > 150;
                    return true;
                });
            }
            
            // Filtro por búsqueda
            if (this.searchQuery.trim()) {
                const query = this.searchQuery.toLowerCase().trim();
                result = result.filter(([level, err]) => {
                    if (!level) return false;
                    const nameMatch = level.name.toLowerCase().includes(query);
                    const creatorMatch = level.author.toLowerCase().includes(query);
                    const verifierMatch = level.verifier.toLowerCase().includes(query);
                    const creatorsMatch = level.creators.some(c => c.toLowerCase().includes(query));
                    return nameMatch || creatorMatch || verifierMatch || creatorsMatch;
                });
            }
            
            // Ordenamiento
            if (this.sortBy === 'name') {
                result.sort((a, b) => {
                    const nameA = a[0]?.name?.toLowerCase() || '';
                    const nameB = b[0]?.name?.toLowerCase() || '';
                    return nameA.localeCompare(nameB);
                });
            } else if (this.sortBy === 'records') {
                result.sort((a, b) => {
                    const recordsA = a[0]?.records?.length || 0;
                    const recordsB = b[0]?.records?.length || 0;
                    return recordsB - recordsA; // Mayor a menor
                });
            }
            // Si es por rank, mantener el orden original
            
            return result;
        }
    },
    async mounted() {
        this.list = await fetchList();
        this.editors = await fetchEditors();

        if (!this.list) {
            this.errors = [
                "No se pudo cargar la lista. Inténtalo de nuevo en unos minutos o avisa al staff de la lista.",
            ];
        } else {
            this.errors.push(
                ...this.list
                    .filter(([_, err]) => err)
                    .map(([_, err]) => {
                        return `No se pudo cargar el nivel. (${err}.json)`;
                    })
            );
            if (!this.editors) {
                this.errors.push("No se pudo cargar los editores de la lista.");
            }
        }

        this.loading = false;
    },
    methods: {
        embed,
        score,
        // Obtener el ranking original del nivel (no el filtrado)
        getOriginalRank(level) {
            if (!level) return 0;
            const index = this.list.findIndex(([l]) => l?.path === level.path);
            return index + 1;
        },
        // Obtener el índice original para mantener selección correcta
        getOriginalIndex(level) {
            if (!level) return 0;
            return this.list.findIndex(([l]) => l?.path === level.path);
        },
        // Verificar si un nivel tiene muchos records (indicador visual)
        hasManyRecords(level) {
            return level.records && level.records.length >= 5;
        },
        // Resetear filtros
        resetFilters() {
            this.searchQuery = '';
            this.filterType = 'all';
            this.sortBy = 'rank';
        }
    }
};