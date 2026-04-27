function submitTime() {
    const data = {
        season: document.getElementById("seasonInput").value,
        race: document.getElementById("raceInput").value,
        name: document.getElementById("userName").value,
        team: document.getElementById("userTeam").value,
        time: document.getElementById("userTime").value
    };

    fetch('/data/add_entry', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data)
    })
    .then(() => {
        loadResults();
        loadData();
        alert("Added!");

        document.getElementById("userName").value = "";
        document.getElementById("userTeam").value = "";
        document.getElementById("userTime").value = "";
    });
}


function deleteEntry(id) {
    if (confirm("Are you sure you want to delete this entry?")) {
        fetch('/data/delete_entry', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ id: id })
        }).then(() => {
            loadResults();
            loadData();
        });
    }
}

async function searchSession() {
    const season = document.getElementById('season').value;
    const race = document.getElementById('race').value;
    const resultsDiv = document.getElementById('results');

    resultsDiv.innerHTML = "Loading data... (This can take a minute for new races)";

    try {
        // Note the /data prefix!
        const response = await fetch(`/data/results?season=${season}&race=${race}`);
        const data = await response.json();

        if (data.error) {
            resultsDiv.innerHTML = `<p style="color:red">Error: ${data.error}</p>`;
            return;
        }

        // Build your table/list here
        resultsDiv.innerHTML = JSON.stringify(data, null, 2);
    } catch (err) {
        console.error(err);
        resultsDiv.innerHTML = "Failed to connect to server.";
    }
}


function loadResults() {
    const season = document.getElementById("seasonInput").value;
    const race = document.getElementById("raceInput").value;

    const finishBody = document.querySelector("#finishTable tbody");
    const fastestBody = document.querySelector("#fastestTable tbody");

    finishBody.innerHTML = "<tr><td colspan='4'>Loading...</td></tr>";
    fastestBody.innerHTML = "<tr><td colspan='6'>Loading...</td></tr>";

    fetch(`/data/results?season=${season}&race=${race}`)
        .then(res => res.json())
        .then(data => {

            if (data.error) {
                finishBody.innerHTML = "<tr><td colspan='4'>Data not found.</td></tr>";
                fastestBody.innerHTML = "<tr><td colspan='6'>Data not found.</td></tr>";
                return;
            }

            finishBody.innerHTML = "";
            data.finish_order.forEach(d => {
                const row = `
                    <tr class="${d.isUser ? 'user-row' : ''}">
                        <td>${d.Position}</td>
                        <td>${d.Abbreviation}</td>
                        <td>${d.TeamName}</td>
                        <td>${d.Time}</td>
                        <td style="font-weight:bold;">${d.Gap}</td>
                    </tr>`;
                finishBody.insertAdjacentHTML('beforeend', row);
            });

            fastestBody.innerHTML = "";
            data.fastest_laps.forEach(d => {
                const row = `
                    <tr class="${d.id !== null ? 'user-row' : ''}">
                        <td>${d.Position}</td>
                        <td>${d.Abbreviation}</td>
                        <td>${d.TeamName}</td>
                        <td>${d.LapTime}</td>
                        <td>${d.Gap}</td>
                        <td>${d.id !== null ? `<button onclick="deleteEntry(${d.id})">Delete</button>` : ''}</td>
                    </tr>`;
                fastestBody.insertAdjacentHTML('beforeend', row);
            });
        })
        .catch(err => {
            console.error("Error:", err);
        });
}


async function loadData() {
    const season = document.getElementById("seasonInput").value;
    const race = document.getElementById("raceInput").value;

    try {
        const res = await fetch(`/data/results?season=${season}&race=${race}`);
        const data = await res.json();

        console.log("DEBUG DATA:", data);

        // optional debug view
        let debugBox = document.getElementById("debugBox");

        if (!debugBox) {
            debugBox = document.createElement("pre");
            debugBox.id = "debugBox";
            document.body.appendChild(debugBox);
        }

        debugBox.textContent = JSON.stringify(data, null, 2);

    } catch (err) {
        console.error("loadData error:", err);
    }
}


document.addEventListener('DOMContentLoaded', () => {
    loadResults();
    loadData();
});