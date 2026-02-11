import { fetchList } from '../content.js';
import Spinner from '../components/Spinner.js';

export default {
    components: { Spinner },
    template: `
        <main class="surface">
            <div class="center-col surface">
                <div v-if="loading" class="submit-container">
                    <Spinner></Spinner>
                </div>
                <div v-else class="submit-container">
                    <h2 style="margin-bottom: 15px;">Submit a Record</h2>
                    <form @submit.prevent="handleSubmit" class="submit-form">
                        <div class="form-group">
                            <label for="username">Username</label>
                            <input type="text" v-model="username" id="username" required placeholder="Your username" />
                        </div>
                        <div class="form-group">
                            <label for="level">Level</label>
                            <select v-model="selectedLevelPath" id="level" required>
                                <option value="" disabled selected>Select a level...</option>
                                <option v-for="item in levels" :key="item.level.path" :value="item.level.path">
                                    {{ item.level.name }}
                                </option>
                            </select>
                        </div>
                        
                        
                        <div class="form-group">
                            <label for="link">Record Link</label>
                            <input type="url" v-model="link" id="link" required placeholder="https://..." />
                        </div>
                        <div class="form-group">
                            <label for="rawlink">Raw Footage Link<span v-if="isExtreme">*</span></label>
                            <input type="url" v-model="rawlink" id="rawlink" :required="isExtreme" placeholder="https://..." />
                        </div>
                        <div class="form-group">
                            <label for="notes">Notes:</label>
                            <input type="text" v-model="notes" id="notes" placeholder="Any additional notes..." />
                        </div>
                        <div class="form-group">
                            <label>Platform</label>
                            <div style="display: flex; gap: 1rem; align-items: center;">
                                <label>
                                    <input type="radio" v-model="mobile" :value="true" name="platform" /> Mobile
                                </label>
                                <label>
                                    <input type="radio" v-model="mobile" :value="false" name="platform" /> PC
                                </label>
                            </div>
                        </div>
                        <div class="form-group">
                            <span>Please read the <a href="https://docs.google.com/document/d/1VEc9-tw4ONnuBRxiuP9NA5q6aJnyZg2-UKyu54VhHIQ/edit?usp=sharing">Submission Guidelines</a> before submitting.</span>
                        </div>
                        <button type="submit" :disabled="!isFormValid" class="submit-btn btn">Submit</button>
                    </form>
                    <div v-if="message" :class="{'success-message': success, 'error-message': !success}">{{ message }}</div>
                </div>
            </div>
        </main>
    `,
    data: () => ({
        levels: [],
        loading: true,
        username: '',
        selectedLevelPath: '',
        link: '',
        rawlink: '',
        mobile: false,
        notes: '', // default to Desktop
        message: '',
        success: false
    }),
    computed: {
        selectedLevel() {
            return this.levels.find(item => item.level.path === this.selectedLevelPath)?.level || null;
        },
        isExtreme() {
            // difficulty 4 = extreme demon
            return this.selectedLevel && this.selectedLevel.difficulty === 4;
        },
        isFormValid() {
            if (!this.username || !this.selectedLevelPath || !this.link) {
                return false;
            }
            if (this.isExtreme && !this.rawlink) {
                return false;
            }
            if(!this.notes){
                this.notes = '';
            }
            return true;
        }
    },
    methods: {
        async handleSubmit() {
            this.message = '';
            this.success = false;
            if (this.isExtreme && !this.rawlink) {
                this.message = 'Raw footage is required for extreme demons.';
                return;
            }
            
            
            try {
                const res = await fetch(`${apiBase}/submit`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        user: this.username,
                        level: this.selectedLevelPath,
                        link: this.link,
                        rawlink: this.rawlink,
                        mobile: this.mobile,
                        notes: this.notes
                    })
                });
                const data = await res.json();
                if (res.ok) {
                    this.message = 'Submission received!';
                    this.success = true;
                    this.link = '';

                } else {
                    this.message = data.error || 'Submission failed.';
                }
            } catch (err) {
                this.message = 'Network or server error.';
            }
        }
    },
    async mounted() {
        this.loading = true;
        const list = await fetchList();
        this.levels = (list || []).map(([level, err]) => ({ level, err })).filter(item => item.level && !item.err);
        this.loading = false;
    }
};