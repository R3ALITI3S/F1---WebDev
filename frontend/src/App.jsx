import React, { useState, useEffect } from 'react';
import './DataStyle.css';

function App() {
  const [results, setResults] = useState([]);
  const [season, setSeason] = useState(2026);
  const [race, setRace] = useState('Australia');

  // Form State
  const [formData, setFormData] = useState({ name: '', team: '', time: '' });

  const loadResults = async () => {
    const res = await fetch(`http://localhost:5000/api/results?season=${season}&race=${race}`);
    const data = await res.json();
    setResults(data.finish_order);
  };

  const submitTime = async () => {
    await fetch('http://localhost:5000/api/add_entry', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...formData, season, race })
    });
    setFormData({ name: '', team: '', time: '' }); // Clear form
    loadResults(); // Refresh table
  };

  useEffect(() => { loadResults(); }, []);

  return (
    <div className="container">
      <header className="navbar">
        <div className="logo"><img src="/F1.avif" alt="Logo" /></div>
        <nav>
          <a href="#">New Race Session</a>
          <a href="#">Drivers</a>
          <a href="#">Calendar</a>
        </nav>
      </header>

      <h1>F1 Leaderboard 🏁</h1>

      <section className="input-section">
        <h3>Add Your Entry</h3>
        <input placeholder="Your Name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
        <input placeholder="Your Team" value={formData.team} onChange={e => setFormData({...formData, team: e.target.value})} />
        <input placeholder="Lap Time (1:32.450)" value={formData.time} onChange={e => setFormData({...formData, time: e.target.value})} />
        <button onClick={submitTime}>Submit Result</button>
      </section>

      <div className="search-bar">
        <input type="number" value={season} onChange={e => setSeason(e.target.value)} id="seasonInput" />
        <select value={race} onChange={e => setRace(e.target.value)}>
          <option value="Australia">1. Australia</option>
          <option value="China">2. China</option>
          <option value="Bahrain">4. Bahrain</option>
        </select>
        <button onClick={loadResults}>Search Session</button>
      </div>

      <h2 className="section-title">Race leaderboard 🏆</h2>
      <table>
        <thead>
          <tr><th>Pos</th><th>Driver</th><th>Team</th><th>Time</th><th>Gap</th></tr>
        </thead>
        <tbody>
          {results.map((row, index) => (
            <tr key={index} className={row.isUser ? 'user-row' : ''}>
              <td>{row.Position}</td>
              <td>{row.Abbreviation}</td>
              <td>{row.TeamName}</td>
              <td>{row.Time}</td>
              <td>{row.Gap}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;