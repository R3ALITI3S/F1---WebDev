import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  return (
    <div>

      <header>
        <h1>F1 Stats Dashboard</h1>
      </header>

      <main>

        <div onClick={() => navigate("/drivers")}>
          <h3>Drivers</h3>
          <p>Take a look at your favorite driver stats</p>
        </div>

        <div>
          <h2>F1 Dashboard</h2>
          <p>
            Experience live Formula 1 action with lap stats, race results,
            and fastest laps.
          </p>
        </div>

        <div onClick={() => navigate("/teams")}>
          <h4>Teams</h4>
        </div>

        <div onClick={() => navigate("/calendar")}>
          <h4>Schedule</h4>
        </div>

        <div onClick={() => navigate("/results")}>
          <h4>Standings & Race Session</h4>
        </div>

      </main>

    </div>
  );
}

export default Home;