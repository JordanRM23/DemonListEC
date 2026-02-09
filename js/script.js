const players = [
  { name: "Jordan", province: "pichincha" },
  { name: "Player2", province: "guayas" },
  { name: "Player3", province: "azuay" },
  { name: "Invitado", province: null }
];

const leaderboard = document.getElementById("leaderboard");

players.forEach(player => {

  // contenedor del jugador
  const row = document.createElement("div");
  row.className = "player-name";

  // bandera
  const flag = document.createElement("img");
  flag.className = "province-flag";

  if (player.province) {
    flag.src = `assets/flags/${player.province}.png`;
    flag.title = player.province;
  } else {
    flag.src = "assets/flags/ecuador.png";
    flag.title = "Ecuador";
  }

  flag.loading = "lazy";

  // nombre
  const name = document.createElement("span");
  name.className = "username";
  name.textContent = player.name;

  // unir todo
  row.appendChild(flag);
  row.appendChild(name);
  leaderboard.appendChild(row);

});
