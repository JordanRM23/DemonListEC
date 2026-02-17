import { store } from '../main.js';
import { fetchList } from '../content.js';

export default {
    template: `
        <main class="page-submit">
            <div class="submit-container">
                <div class="submit-form">
                    <h2 class="type-headline-md"> Enviar Record</h2>
                    <p class="type-body" style="color: var(--color-on-background); opacity: 0.7; margin-bottom: 2rem;">
                        Envía tu progreso en los niveles de la lista
                    </p>
                    
                    <div v-if="success" class="success-message type-body">
                        ¡Record enviado correctamente! Será revisado por los moderadores.
                    </div>
                    
                    <form @submit.prevent="handleSubmit">
                        <div class="form-group">
                            <label class="type-label-lg">Nivel *</label>
                            <select v-model="form.level" class="type-body" required>
                                <option value="">Selecciona un nivel</option>
                                <option v-for="level in availableLevels" :key="level.path" :value="level.name">
                                    #{{ level.rank }} - {{ level.name }}
                                </option>
                            </select>
                        </div>
                        
                        <div class="form-group">
                            <label class="type-label-lg">Progreso (%) *</label>
                            <input 
                                type="number" 
                                v-model.number="form.progress" 
                                min="0" 
                                max="100" 
                                placeholder="Ej: 100"
                                class="type-body"
                                required
                            />
                        </div>
                        
                        <div class="form-group">
                            <label class="type-label-lg">Link del Video *</label>
                            <input 
                                type="url" 
                                v-model="form.videoUrl" 
                                placeholder="https://youtube.com/watch?v=..."
                                class="type-body"
                                required
                            />
                            <small class="type-label-sm" style="color: var(--color-on-background); opacity: 0.6; display: block; margin-top: 0.5rem;">
                                Debe ser un video de YouTube o Twitch no editable
                            </small>
                        </div>
                        
                        <div class="form-group">
                            <label class="type-label-lg">Notas adicionales (opcional)</label>
                            <textarea 
                                v-model="form.notes" 
                                rows="3" 
                                placeholder="Detalles sobre el intento, clicks, etc."
                                class="type-body"
                            ></textarea>
                        </div>
                        
                        <div class="form-group checkbox-group">
                            <label class="type-body">
                                <input type="checkbox" v-model="form.verified" required />
                                Confirmo que este record es legítimo y el video es completo
                            </label>
                        </div>
                        
                        <button type="submit" class="btn btn-primary" :disabled="loading">
                            <span class="type-label-lg">
                                {{ loading ? 'Enviando...' : 'Enviar Record' }}
                            </span>
                        </button>
                    </form>
                </div>

                <div class="records-history">
                    <h3 class="type-headline-sm" style="margin-bottom: 1.5rem;">Mis Records Enviados</h3>
                    
                    <div v-if="store.myRecords.length === 0" class="no-records type-body" style="text-align: center; opacity: 0.6; padding: 2rem;">
                        No has enviado ningún record aún
                    </div>
                    
                    <div v-else class="records-list">
                        <div 
                            v-for="record in store.myRecords" 
                            :key="record.id"
                            class="record-item"
                            :class="'status-' + record.status"
                        >
                            <div class="record-info">
                                <h4 class="type-label-lg">{{ record.level }}</h4>
                                <p class="type-label-md">{{ record.progress }}% • {{ formatDate(record.date) }}</p>
                            </div>
                            <span class="record-status type-label-sm" :class="'badge-' + record.status">
                                {{ statusText(record.status) }}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    `,
    data() {
        return {
            form: {
                level: '',
                progress: 100,
                videoUrl: '',
                notes: '',
                verified: false
            },
            loading: false,
            success: false,
            availableLevels: []
        };
    },
    async mounted() {
        // Cargar niveles disponibles de la lista
        const list = await fetchList();
        if (list) {
            this.availableLevels = list.map(([level, err], index) => ({
                rank: index + 1,
                name: level?.name || `Error #${index + 1}`,
                path: level?.path || `level-${index + 1}`
            })).filter(l => !l.name.includes('Error'));
        }
    },
    methods: {
        async handleSubmit() {
            this.loading = true;
            this.success = false;
            
            try {
                await store.submitRecord({...this.form});
                this.success = true;
                this.form = {
                    level: '',
                    progress: 100,
                    videoUrl: '',
                    notes: '',
                    verified: false
                };
                setTimeout(() => this.success = false, 5000);
            } catch (err) {
                alert('Error al enviar el record');
            } finally {
                this.loading = false;
            }
        },
        formatDate(dateStr) {
            return new Date(dateStr).toLocaleDateString('es-EC');
        },
        statusText(status) {
            const map = {
                'pending': 'Pendiente',
                'approved': 'Aprobado',
                'rejected': 'Rechazado'
            };
            return map[status] || status;
        }
    }
};