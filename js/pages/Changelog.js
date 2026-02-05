export default {
    template: `
        <main v-if="Cargando">
            <Changelog></Changelog>
        </main>
        <div v-else class="page-changelog">
            <div class="change">
            </div>
            <div class="change">
                <h2>05/02/2026</h2>
                <p>Se añadio etiquetas en los nombres, esta etiquetas solamente la tienen algunos jugadores selecionados.</p>
            </div>
            <div class="change">
                <h2>02/02/2026</h2>
                <p>Se añadio descripción a los niveles</p>
                <p>Se mejoro la visualizacion de la pestañas "Ruleta", ahora se ve mas limpio al momento de usarla</p>
            </div>
            <div class="change">
                <h2>01/02/2026</h2>
                <p>Manic Machine has been placed at #91, above Libertas and below Niflheim, This Pushes Insaction into the Legacy List</p>
                <p>Stellaluna has been placed at #115, above Tech Manifestation and below Broken Signal, This Pushes The Lost Existence into the Legacy List</p>
                <p>EKO has been placed at #80, above cytokinesis and below Triple Six, This Pushes Forbidden Isle into the Legacy List</p>
                <p>Untitled has been placed at #68, above Epsilon and below Carcano, This Pushes 8o X into the Legacy List</p>
                <p>Conical Depression has been placed at #77, above Goldcrest Palace and below Auroral Valhalla, This Pushes Dark Odyssey into the Legacy List</p>
            </div>
            <div class="change">
                <h2>31/01/2026</h2>
                <p>Se añadió la pestaña "Changelog". Los registros de cambios anteriores no están disponibles.</p>
                <p>Esta página mostrará todos los cambios futuros en las listas, así como los cambios en el formato o las reglas de la lista.</p>
            </div>
        </div>
    `,
};