import React, { useState, useMemo } from "react";
import Clarity from "@microsoft/clarity";
import "./App.css";
import songsData from "./data/songs/index.js";
import Header from "./components/Header";
import Forest from "./components/Forest";

function App() {
  const projectId = "ub3q2e0is3";
  Clarity.init(projectId);

  const [currentIndex, setCurrentIndex] = useState(null);

  // sort songs after import by title
  const sortedSongs = useMemo(
    () => [...songsData].sort((a, b) => a.title.localeCompare(b.title)),
    [songsData]
  );

  function goHome() {
    setCurrentIndex(null);
  }

  function nextSong() {
    if (currentIndex == null) return;
    const next = (currentIndex + 1) % sortedSongs.length;
    setCurrentIndex(next);
  }

  function prevSong() {
    if (currentIndex == null) return;
    const prev = (currentIndex - 1 + sortedSongs.length) % sortedSongs.length;
    setCurrentIndex(prev);
  }

  return (
    <div className="carols-app">
      <Header />
      <Forest />
      <main className="content">
        {currentIndex == null && (
          <section className="songs">
            <h2 className="section-title">Song List</h2>
            <div className="subtitle">Select a song to view lyrics</div>
            <ul className="song-list">
              {sortedSongs.map((songObj, idx) => (
                <li
                  key={songObj.title}
                  className={`song-card ${
                    currentIndex === idx ? "selected" : ""
                  }`}
                  aria-posinset={idx + 1}
                  aria-setsize={sortedSongs.length}
                  tabIndex={0}
                  onClick={() => setCurrentIndex(idx)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ")
                      setCurrentIndex(idx);
                  }}
                >
                  <div className="song-index">{idx + 1}</div>
                  <div className="song-name">{songObj.title}</div>
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className="post-controls">
          <div className="controls">
            <button className="btn" onClick={goHome} aria-label="Home">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"
                  fill="currentColor"
                />
              </svg>
              <span className="btn-label">Home</span>
            </button>

            <button
              className="btn"
              onClick={prevSong}
              disabled={currentIndex == null}
              aria-label="Previous"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  d="M15.41 7.41 14 6l-6 6 6 6 1.41-1.41L10.83 12z"
                  fill="currentColor"
                />
              </svg>
              <span className="btn-label">Prev</span>
            </button>
            <button
              className="btn"
              onClick={nextSong}
              disabled={currentIndex == null}
              aria-label="Next"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  d="M8.59 16.59 13.17 12 8.59 7.41 10 6l6 6-6 6z"
                  fill="currentColor"
                />
              </svg>
              <span className="btn-label">Next</span>
            </button>
          </div>

          <div className="lyrics">
            {currentIndex == null ? (
              <div className="lyrics-empty">
                Nothing to display here 🙁. Please select any song from top
              </div>
            ) : (
              <div>
                <h3 className="lyrics-title">
                  {currentIndex + 1} -{" "}
                  {(sortedSongs[currentIndex] || { title: "" }).title}
                </h3>
                <pre className="lyrics-body">
                  {(sortedSongs[currentIndex] || { lyrics: "" }).lyrics}
                </pre>
              </div>
            )}
          </div>
        </section>
      </main>
      <div className="snow" aria-hidden="true" />
      <footer className="footer">
        <div className="copyright">
          &copy; {new Date().getFullYear()} St Marys OSC
        </div>
      </footer>
    </div>
  );
}

export default App;
