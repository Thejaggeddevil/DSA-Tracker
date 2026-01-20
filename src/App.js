import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const today = new Date().toDateString();

  const [view, setView] = useState("home");
  const [score, setScore] = useState(Number(localStorage.getItem("score")) || 0);
  const [streak, setStreak] = useState(Number(localStorage.getItem("streak")) || 0);
 const [lastVisit] = useState(localStorage.getItem("lastVisit"));
  const [history, setHistory] = useState(
    JSON.parse(localStorage.getItem("history") || "[]")
  );

  const actions = [
    { label: "Solved 1 Problem", points: 10 },
    { label: "Solved Without Help", points: 5 },
    { label: "Under 30 Minutes", points: 5 },
    { label: "Wrote Pattern + Complexity", points: 10 },
    { label: "Explained Out Loud", points: 10 },
    { label: "Struggled but Didn’t Quit", points: 5 },
  ];

  useEffect(() => {
    let newScore = score;
    let newStreak = streak;

    if (!lastVisit) {
      newStreak = 1;
    } else if (lastVisit !== today) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);

      if (lastVisit === yesterday.toDateString()) {
        newStreak += 1;
      } else {
        newStreak = 1;
        newScore = Math.max(0, score - 20);
      }
    }

    setScore(newScore);
    setStreak(newStreak);

    localStorage.setItem("score", newScore);
    localStorage.setItem("streak", newStreak);
    localStorage.setItem("lastVisit", today);

    if (!history.find((h) => h.date === today)) {
      const updatedHistory = [...history, { date: today, score: newScore }];
      setHistory(updatedHistory);
      localStorage.setItem("history", JSON.stringify(updatedHistory));
    }
    // eslint-disable-next-line
  }, []);

  const addPoints = (p) => {
    const newScore = score + p;
    setScore(newScore);
    localStorage.setItem("score", newScore);
  };

  const skipDay = () => {
    const newScore = Math.max(0, score - 30);
    setScore(newScore);
    setStreak(0);
    localStorage.setItem("score", newScore);
    localStorage.setItem("streak", 0);
  };

  return (
    <div className="container">
      <h1>DSA Discipline Tracker</h1>

      <div className="nav">
        <button onClick={() => setView("home")}>Home</button>
        <button onClick={() => setView("history")}>History</button>
      </div>

      {view === "home" && (
        <>
          <div className="stats">
            <div className="card">
              <p>Today’s Score</p>
              <h2>{score}</h2>
            </div>

            <div className="card">
              <p>Streak</p>
              <h2>🔥 {streak}</h2>
            </div>

            <div className="card">
              <p>Penalty</p>
              <h2>-20 / missed day</h2>
            </div>
          </div>

          <h3>Earn Points</h3>
          <div className="actions">
            {actions.map((a, i) => (
              <button key={i} onClick={() => addPoints(a.points)}>
                {a.label} (+{a.points})
              </button>
            ))}
          </div>

          <div className="penalty">
            <button onClick={skipDay}>I skipped DSA today (-30)</button>
          </div>
        </>
      )}

      {view === "history" && (
        <>
          <h2>Your Consistency</h2>
          {history.length === 0 && <p>No history yet</p>}
          <div className="history-grid">
            {history.map((h, i) => (
              <div key={i} className="history-card">
                <p>Day {i + 1}</p>
                <strong>{h.score} pts</strong>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default App;
