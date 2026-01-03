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
                <table class="list" v-if="list">
                    <tbody>
                        <tr v-for="([level, err], i) in list" :key="i">
                            <!-- Celda de título de sección -->
                            <td v-if="i === 0" colspan="2" class="list-section-cell">
                                <span class="list-section-title level-pos-top50">
                                    Lista Principal
                                </span>
                            </td>
                            <td v-else-if="i === 50" colspan="2" class="list-section-cell">
                                <span class="list-section-title level-pos-51-100">
                                    Lista Secundaria
                                </span>
                            </td>
                            <td v-else-if="i === 100" colspan="2" class="list-section-cell">
                                <span class="list-section-title level-pos-101-150">
                                    Lista Extendida
                                </span>
                            </td>

                            <!-- Fila normal de la lista -->
                            <template v-else>
                                <td class="rank">
                                    <p class="type-label-lg">
                                        <span
                                            v-if="i + 1 <= 150"
                                            :class="getLevelPosClass(i + 1)"
                                        >
                                            #{{ i + 1 }}
                                        </span>
                                        <span v-else>Legacy</span>
                                    </p>
                                </td>
                                <td class="level" :class="{ 'active': selected == i, 'error': !level }">
                                    <button @click="selected = i">
                                        <span
                                            class="type-label-lg"
                                            :class="getLevelPosClass(i + 1)"
                                        >
                                            {{ level?.name || \`Error (\${err}.json)\` }}
                                        </span>
                                    </button>
                                </td>
                            </template>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div class="level-container">
                <div class="level" v-if="level">
                    <h1>{{ level.name }}</h1>
                    <LevelAuthors :author="level.author" :creators="level.creators" :verifier="level.verifier"></LevelAuthors>
                    <iframe class="video" id="videoframe" :src="video" frameborder="0"></iframe>
                    <ul class="stats">
                        <li>
                            <div class="type-title-sm">Puntos al completar</div>
                            <p>
                                {{
                                    selected + 1 <= 150
                                        ? score(selected + 1, 100, level.percentToQualify)
                                        : 0
                                }}
                            </p>
                        </li>
                        <li>
                            <div class="type-title-sm">ID</div>
                            <p>{{ level.id }}</p>
                        </li>
                        <li>
                            <div class="type-title-sm">password</div>
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
                    </p>
                    <p>
                        Ser Ecuatoriano
                    </p>
                    <p>
                        Para enviar un récord, el jugador necesita un vídeo para demostrar su legitimidad.
                    </p>
                    <p>
                        Los récords no serán aceptados si no tienen clics audibles claros en todo momento. Discutan cualquier discrepancia con un moderador.
                    </p>
                    <p>
                        Si se descubre que un jugador hace trampa, será eliminado de la lista y eventualmente podrá hablar con un moderador al respecto.
                    </p>
                    <p>
                        El porcentaje mínimo para tener un registro aceptado en cualquier nivel de la lista se refleja en cada nivel.
                    </p>
                    <p>
                        Si tu video fue grabado después del 1/1/2026, tu récord debe incluir los cheats indicator en la End Screen de forma OBLIGATORIA.
                    </p>
                    <p>
                        Si tu record ya está aceptado en Pointercrate, AREDL o Global Demonlist, te aceptaremos el record (aunque pueden haber excepciones).
                    </p>
                    <p>
                        No utilices secret way ni bugs que genere la completion de algun nivel.
                    </p>
                    <p>
                        Completar el nivel en una version más fácil, nerfeada, o con un LDM exagerado que haga el nivel mas fácil no está permitido.
                    </p>
                    <p>
                        Si tiene alguna pregunta, comuníquese con un miembro del staff de GDEC en Discord.
                    </p>
                    <p>
                    </p>
                    <div class="og">
                    <p class="type-label-md">Website layout made by <a href="https://tsl.pages.dev/" target="_blank">TheShittyList</a></p>
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
        store
    }),
    computed: {
        level() {
            return this.list[this.selected][0];
        },
        video() {
            if (!this.level.showcase) {
                return embed(this.level.verification);
            }

            return embed(
                this.toggledShowcase
                    ? this.level.showcase
                    : this.level.verification
            );
        },
    },
    async mounted() {
        // Hide loading spinner
        this.list = await fetchList();
        this.editors = await fetchEditors();

        // Error handling
        if (!this.list) {
            this.errors = [
                "No se pudo cargar la lista. Inténtalo de nuevo en unos minutos o avisa al staff de la lista.",
            ];
        } else {
            this.errors.push(
                ...this.list
                    .filter(([_, err]) => err)
                    .map(([_, err]) => {
                        return \`No se pudo cargar el nivel. (\${err}.json)\`;
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
        getLevelPosClass(pos) {
            if (pos >= 1 && pos <= 50)   return 'level-pos-top50';
            if (pos >= 51 && pos <= 100) return 'level-pos-51-100';
            if (pos >= 101 && pos <= 150) return 'level-pos-101-150';
            return 'level-pos-151plus';
        },
    },
};
