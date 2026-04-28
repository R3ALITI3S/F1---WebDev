import { useEffect, useState } from "react";

function Calendar() {
  const [races, setRaces] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:5000/Calendar")
      .then(res => res.json())
      .then(data => setRaces(data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div>
      <h1>Calendar</h1>

      {races.map((race, i) => (
        <p key={i}>{race.name} - {race.date}</p>
      ))}
    </div>
  );
}

export default Calendar;