function formatDate(dateString) {
  const date = new Date(dateString);

  // "May-24"
  const formatted = date.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit"
  });

  return formatted.replace(" ", "-");
}

async function loadSchedule() {
  const response = await fetch("/api/schedule");
  const data = await response.json();

  const grid = document.getElementById("schedule-grid");
  grid.innerHTML = "";

  data.forEach(event => {
    const card = document.createElement("div");
    card.className = "race-card";

    card.onclick = () => {
      window.location.href = `/race/${event.round}`;
    };

    card.innerHTML = `
      <img 
        src="https://flagcdn.com/w40/${event.country_code}.png" 
        alt="${event.country} flag" 
        class="flag"
      >

      <h3>Round ${event.round}</h3>
      <p class="race-name">${event.name}</p>
      <p class="race-location">${event.location}, ${event.country}</p>
      <p class="race-date">${formatDate(event.date)}</p>
    `;

    grid.appendChild(card);
  });
}

window.onload = loadSchedule;