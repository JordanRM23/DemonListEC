.page-leaderboard-container {
    display: block;
}

.page-leaderboard {
    height: 100%;
    display: grid;
    grid-template-columns: minmax(24rem, 2fr) 3fr;
    grid-template-rows: max-content 1fr;
    column-gap: 2rem;
    max-width: 80rem;
    margin: 0 auto;
}

.page-leaderboard > div {
    overflow-y: auto;
}

.page-leaderboard .error-container {
    grid-row: 1;
    grid-column: 1 / span 2;
}

.page-leaderboard .error-container .error {
    padding: 1rem;
    background-color: var(--color-error);
    color: var(--color-on-error);
}

.page-leaderboard .board-container,
.page-leaderboard .player-container {
    grid-row: 2;
    padding-block: 2rem;
}

.page-leaderboard .board-container {
    padding-inline: 1rem;
}

.page-leaderboard .board {
    table-layout: auto;
    display: block;
    width: 100%;
}

.page-leaderboard .board .rank {
    padding-block: 1rem;
    text-align: end;
}

.page-leaderboard .board .total {
    padding: 1rem;
    text-align: end;
}

.page-leaderboard .board .user {
    width: 100%;
}

.page-leaderboard .board .user button {
    background-color: var(--color-background);
    color: inherit;
    border: none;
    border-radius: 0.5rem;
    padding: 1rem;
    text-align: start;
    overflow-wrap: anywhere;
}

.page-leaderboard .board .user button:hover {
    background-color: var(--color-background-hover);
    cursor: pointer;
}

.page-leaderboard .board .user.active button {
    background-color: var(--color-primary);
    color: var(--color-on-primary);
}

.page-leaderboard .player {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    padding-right: 2rem;
}

/* ========================= */
/*        PLAYER NAME        */
/* ========================= */

.player-name {
    color: inherit !important;
    transition: transform 0.2s ease;
}

.player-name:hover {
    transform: scale(1.03);
}

/* ========================= */
/*        ANIMATIONS         */
/* ========================= */

@keyframes fireGradient {
    0%   { background-position: 0% 50%; }
    50%  { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
}

/* ========================= */
/*          RANGOS           */
/* ========================= */

/* Rango 0 */
.rank-0 {
    color: #9E9E9E !important;
}

/* Rango 1 */
.rank-500 {
    color: #BDBDBD !important;
}

/* Rango 2 */
.rank-1250 {
    color: #8D6E63 !important;
}

/* Rango 3 */
.rank-2000 {
    color: #616161 !important;
}

/* Rango 4 */
.rank-2750 {
    color: #4CAF50 !important;
}

/* Rango 5 */
.rank-3500 {
    color: #2E7D32 !important;
    -webkit-text-stroke: 1px #1B5E20;
}

/* Rango 6 */
.rank-4250 {
    color: #2196F3 !important;
    -webkit-text-stroke: 1px #0D47A1;
}

/* Rango 7 */
.rank-5000 {
    color: #00B0FF !important;
}

/* Rango 8 */
.rank-5750 {
    color: #9C27B0 !important;
}

/* Rango 9 */
.rank-6500 {
    color: #FFD700 !important;
    -webkit-text-stroke: 1px #B8860B;
}

/* ========================= */
/*      👑 RANGO X 👑        */
/*  MISMO DORADO TOP-50 GD   */
/* ========================= */

.rank-7000 {
    background: linear-gradient(
        #FFD700,
        #FFFFFF,
        #FFD700,
        #FFFFFF,
        #FFD700
    );
    background-size: 400% 400%;
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
}

/* ========================= */
/*      🔥 RANGO X+ 🔥       */
/* ========================= */

.rank-14000 {
    background: linear-gradient(
        -45deg,
        #ff0000,
        #ff3333,
        #ff0000
    );
    background-size: 300% 300%;
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    animation: fireGradient 1.2s linear infinite;
    /* ===== FIX GLOBAL VISIBILIDAD ===== */

/* Garantiza color base si el gradiente falla */
.player-name {
    color: #e0e0e0;
}

/* En botones activos fuerza contraste */
.page-leaderboard .board .user.active .player-name {
    color: var(--color-on-primary) !important;
    -webkit-text-fill-color: initial;
}

/* Evita texto invisible en spans con gradiente */
.player-name[class*="rank-"] {
    display: inline-block;
}
}
