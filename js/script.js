const players = [
  {
    position: "#1",
    name: "Zephyr",
    rank: "Rango X+",
    province: "guayas",
  }
];

const leaderboard = document.getElementById("leaderboard");

players.forEach(player => {

  const card = document.createElement("div");
  card.className = "player-card";

  // línea superior (bandera + nombre + rango)
  const nameRow = document.createElement("div");
  nameRow.className = "name-row";

  const flag = document.createElement("img");
  flag.src = `assets/flags/${player.province}.png`;
  flag.className = "province-flag";
  flag.title = player.province;
  flag.loading = "lazy";

  const nameText = document.createElement("span");
  nameText.className = "player-name-text";
  nameText.textContent = `${player.position} ${player.name} (${player.rank})`;

  nameRow.appendChild(flag);
  nameRow.appendChild(nameText);

  // badge
  const badge = document.createElement("div");
  badge.className = "player-badge";
  badge.textContent = player.title;

  // puntos
  const points = document.createElement("div");
  points.className = "player-points";
  points.textContent = player.points;

  card.appendChild(nameRow);
  card.appendChild(badge);
  card.appendChild(points);

  leaderboard.appendChild(card);
});
