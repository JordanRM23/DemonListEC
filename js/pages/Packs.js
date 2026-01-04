function mostrarPack(id) {
    // Oculta todos los packs
    const packs = document.querySelectorAll('.niveles');
    packs.forEach(pack => pack.classList.add('oculto'));

    // Muestra el pack seleccionado
    document.getElementById(id).classList.remove('oculto');
}
