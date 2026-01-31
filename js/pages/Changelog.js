export default {
    template: `
        <main v-if="loading">
            <Changelog></Changelog>
        </main>
        <div v-else class="page-changelog">
            <div class="change">
                <h2>31/01/2026</h2>
                <p>Se añadió la pestaña de registro de cambios. Los registros de cambios anteriores no están disponibles.</p>
                <p>Esta página mostrará todos los cambios futuros en las listas, así como los cambios en el formato o las reglas de la lista.</p>
            </div>
        </div>
    `,
};