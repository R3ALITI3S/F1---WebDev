async function loadSchedule() {
    const list = document.getElementById("schedule-grid");
    if (!list) return;

    try {
        // Updated to match the blueprint prefix to the /Calendar + route /data
        const res = await fetch("/Calendar/data");

        if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
        const data = await res.json();

        list.innerHTML = "";

        data.forEach(event => {
            const card = document.createElement("div");
            card.className = "race-card";

            // Using a public flag API for visual appeal :)
            const flagUrl = `https://flagcdn.com/w80/${event.country_code}.png`;

            card.innerHTML = `
                <img src="${flagUrl}" class="flag" alt="${event.country}">
                <div class="race-name">${event.name}</div>
                <div class="race-location">${event.location}</div>
                <div class="race-date">${event.date}</div>
            `;

            // Click to go to details zz made i thinks? a newer version
            // card.onclick = () => window.location.href = `/Calendar/race/${event.round}`;
            list.appendChild(card);
        });

    } catch (err) {
        console.error("Failed to load schedule:", err);
        list.innerHTML = "<p>Failed to load race calendar.</p>";
    }
}

window.addEventListener("DOMContentLoaded", loadSchedule);