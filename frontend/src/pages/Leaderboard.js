import { useEffect, useState } from "react";
import "../styles/DataStyle.css";

function Leaderboard() {
  const [season, setSeason] = useState(2026);
  const [race, setRace] = useState("Australia");

  const [finish, setFinish] = useState([]);
  const [fastest, setFastest] = useState([]);

  // INPUT STATE (FIX)
  const [name, setName] = useState("");
  const [team, setTeam] = useState("");
  const [time, setTime] = useState("");

  // LOAD RESULTS
  const loadResults = async () => {
    const res = await fetch(
      `http://127.0.0.1:5000/data/results?season=${season}&race=${race}`
    );
    const data = await res.json();

    setFinish(data.finish_order || []);
    setFastest(data.fastest_laps || []);
  };

  // SUBMIT TIME
  const submitTime = async () => {
    const data = {
      season,
      race,
      name,
      team,
      time,
    };

    await fetch("http://127.0.0.1:5000/data/add_entry", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    // clear inputs
    setName("");
    setTeam("");
    setTime("");

    loadResults();
  };

  // LOAD ON START
  useEffect(() => {
    loadResults();
  }, []);

  return (
    <div>

      {/* HEADER */}
      <header className="navbar">
        <h1>F1 Leaderboard 🏁</h1>
      </header>

      {/* INPUT SECTION */}
      <section className="input-section">
        <h3>Add Your Entry</h3>

        <input
          placeholder="Your Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          placeholder="Your Team"
          value={team}
          onChange={(e) => setTeam(e.target.value)}
        />

        <input
          placeholder="Lap Time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
        />

        <button onClick={submitTime}>Submit Result</button>
      </section>

      {/* SEARCH */}
      <div className="search-bar">
        <input
          type="number"
          value={season}
          onChange={(e) => setSeason(e.target.value)}
        />

        <select
          value={race}
          onChange={(e) => setRace(e.target.value)}
        >
          <option value="Australia">Australia</option>
          <option value="China">China</option>
          <option value="Japan">Japan</option>
          <option value="Bahrain">Bahrain</option>
        </select>

        <button onClick={loadResults}>Search Session</button>
      </div>

      {/* FINISH TABLE */}
      <h2>Race leaderboard 🏆</h2>
      <table>
        <tbody>
          {finish.map((d, i) => (
            <tr key={i}>
              <td>{d.Position}</td>
              <td>{d.Abbreviation}</td>
              <td>{d.TeamName}</td>
              <td>{d.Time}</td>
              <td>{d.Gap}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* FASTEST TABLE */}
      <h2>Fastest Laps ⚡</h2>
      <table>
        <tbody>
          {fastest.map((d, i) => (
            <tr key={i}>
              <td>{d.Position}</td>
              <td>{d.Abbreviation}</td>
              <td>{d.TeamName}</td>
              <td>{d.LapTime}</td>
              <td>{d.Gap}</td>

              <td>
                {d.id && (
                  <button
                    onClick={() =>
                      fetch("http://127.0.0.1:5000/data/delete_entry", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ id: d.id }),
                      }).then(loadResults)
                    }
                  >
                    Delete
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

    </div>
  );
}

export default Leaderboard;