async function loadSchedule() {
    try {
        const res = await fetch("/api/schedule");

        if (!res.ok) {
            throw new Error("Failed to fetch schedule");
        }

        const data = await res.json();
        console.log("Schedule data:", data); // debug

        const list = document.getElementById("schedule-list");
        list.innerHTML = "";

        data.forEach(event => {
            const li = document.createElement("li");
            li.innerHTML = `
                <strong>${event.name}</strong><br>
                ${event.country} - ${event.date}
            `;
            list.appendChild(li);
        });

    } catch (error) {
        console.error("Error loading schedule:", error);
    }
}

window.onload = loadSchedule;