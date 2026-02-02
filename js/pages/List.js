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
                    <tr v-for="([level, err], i) in list">
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
                    </tr>
                </table>
            </div>

            <div class="level-container">
                <div
                    class="level"
                    v-if="level"
                    :class="getLevelPosClass(selected + 1)"
                >
                    <h1>{{ level.name }}</h1>
                    <LevelAuthors
                        :author="level.author"
                        :creators="level.creators"
                        :verifier="level.verifier"
                        :rate="level.rate"
                    ></LevelAuthors>

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

                    <p v-if="selected + 1 <= 75">
                        <strong>{{ level.percentToQualify }}%</strong> o mas para calificar
                    </p>
                    <p v-else-if="selected + 1 <= 150">
                        <strong>100%</strong> o mas para calificar
                    </p>
                    <p v-else>
                        Este nivel no acepta nuevos records.
                    </p>

                    <table class="records">
                        <tr v-for="record in level.records" class="record">
                            <td class="percent">
                                <p>{{ record.percent }}%</p>
                            </td>
                            <td class="user">
                                <a
                                    :href="record.link"
                                    target="_blank"
                                    class="type-label-lg"
                                    :class="getLevelPosClass(selected + 1)"
                                >
                                    {{ record.user }}
                                </a>
                            </td>
                            <td class="mobile">
                                <img
                                    v-if="record.mobile"
                                    :src="\`/assets/phone-landscape\${store.dark ? '-dark' : ''}.svg\`"
                                    alt="Mobile"
                                >
                            </td>
                            <td class="hz">
                                <p>{{ record.hz }}Hz</p>
                            </td>
                        </tr>
                    </table>
                </div>

                <div
                    v-else
                    class="level"
                    style="height: 100%; justify-content: center; align-items: center;"
                >
                    <p>Ñaño, aquí no hay nada… parece que te fuiste por otro camino</p>
                </div>
            </div>

            <div class="meta-container">
                <div class="meta">
                    <div class="errors" v-show="errors.length > 0">
                        <p class="error" v-for="error of errors">{{ error }}</p>
                    </div>

                    <div class="og">
                        <p class="type-label-md">
                            Ranking ECUADOR en la
                            <a href="https://aredl.net/profile/country/218" target="_blank">
                                The All Rated Extreme Demons List
                            </a>
                        </p>
                    </div>

                    <template v-if="editors">
                        <h3>List Editors</h3>
                        <ol class="editors">
                            <li v-for="editor in editors">
                                <img
                                    :src="\`/assets/\${roleIconMap[editor.role]}\${store.dark ? '-dark' : ''}.svg\`"
                                    :alt="editor.role"
                                >
                                <a
                                    v-if="editor.link"
                                    class="type-label-lg link"
                                    target="_blank"
                                    :href="editor.link"
                                >
                                    {{ editor.name }}
                                </a>
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

                    <div class="og">
                        <p class="type-label-md">
                            Website layout made by
                            <a href="https://tsl.pages.dev/" target="_blank">TheShittyList</a>
                        </p>
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
        this.list = await fetchList();
        this.editors = await fetchEditors();

        if (!this.list) {
            this.errors = [
                "No se pudo cargar la lista. Inténtalo de nuevo o avisa al staff.",
            ];
        } else {
            this.errors.push(
                ...this.list
                    .filter(([_, err]) => err)
                    .map(([_, err]) => `No se pudo cargar el nivel. (${err}.json)`)
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
            if (pos >= 1 && pos <= 50) return 'level-pos-top50';
            if (pos >= 51 && pos <= 100) return 'level-pos-51-100';
            if (pos >= 101 && pos <= 150) return 'level-pos-101-150';
            return 'level-pos-151plus';
        },
    },
};
