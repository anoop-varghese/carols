import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import Clarity from "@microsoft/clarity";
import "./App.css";
import songsData from "./data/songs/index.js";
import Header from "./components/Header";
import Forest from "./components/Forest";
import NightSky from "./components/NightSky";

const sortedSongs = [...songsData].sort((a, b) => a.title.localeCompare(b.title));
const lyricScales = [0.9, 1, 1.1, 1.2, 1.3, 1.4, 1.5, 1.6];
const FAVORITES_KEY = "carols-favourites";
const HOME_INTRO_KEY = "carols-home-intro-played";

function songSlug(title) {
  return title.toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function songIndexFromUrl() {
  const slug = new URLSearchParams(window.location.search).get("song");
  const index = sortedSongs.findIndex((song) => songSlug(song.title) === slug);
  return index >= 0 ? index : null;
}

function savedFavorites() {
  try {
    const saved = JSON.parse(window.localStorage.getItem(FAVORITES_KEY) || "[]");
    const knownSongs = new Set(sortedSongs.map((song) => songSlug(song.title)));
    return Array.isArray(saved) ? [...new Set(saved.filter((slug) => knownSongs.has(slug)))] : [];
  } catch {
    return [];
  }
}

function FavoriteButton({ song, active, onToggle, className = "" }) {
  return (
    <button
      type="button"
      className={`favorite-button ${className}${active ? " is-favorite" : ""}`}
      aria-label={`${active ? "Remove" : "Add"} ${song.title} ${active ? "from" : "to"} favourites`}
      aria-pressed={active}
      onClick={() => onToggle(song.title)}
    >
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="m12 2.5 3 6.2 6.8 1-4.9 4.8 1.2 6.8-6.1-3.2-6.1 3.2 1.2-6.8-4.9-4.8 6.8-1Z" />
      </svg>
    </button>
  );
}

function App() {
  useEffect(() => {
    Clarity.init("ub3q2e0is3");
  }, []);

  const [currentIndex, setCurrentIndex] = useState(songIndexFromUrl);
  const [search, setSearch] = useState("");
  const [favorites, setFavorites] = useState(savedFavorites);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [homeIntro, setHomeIntro] = useState(() => {
    if (songIndexFromUrl() != null) return false;
    try {
      return window.sessionStorage.getItem(HOME_INTRO_KEY) !== "1";
    } catch {
      return true;
    }
  });
  const [textSizeIndex, setTextSizeIndex] = useState(1);
  const [transitionTargetIndex, setTransitionTargetIndex] = useState(null);
  const [nativeTransitionSession, setNativeTransitionSession] = useState(false);
  const [fallbackDirection, setFallbackDirection] = useState(null);
  const [swipePreview, setSwipePreview] = useState(null);
  const appRef = useRef(null);
  const touchStart = useRef(null);
  const swipeTimer = useRef(null);
  const transitionId = useRef(0);
  const openedFrom = useRef(null);
  const returnToCard = useRef(null);

  useEffect(() => {
    if (!homeIntro) return;
    try {
      window.sessionStorage.setItem(HOME_INTRO_KEY, "1");
    } catch {
      // The opening still plays when session storage is unavailable.
    }
    const timer = window.setTimeout(() => setHomeIntro(false), 1500);
    return () => window.clearTimeout(timer);
  }, [homeIntro]);

  useLayoutEffect(() => {
    if (currentIndex != null) {
      if (appRef.current) appRef.current.scrollTop = 0;
      return;
    }

    const index = returnToCard.current;
    if (index == null) return;
    if (openedFrom.current?.index === index) {
      if (openedFrom.current.scrollY > 0) window.scrollTo(0, openedFrom.current.scrollY);
    } else {
      const card = document.querySelector(`[data-song-index="${index}"]`);
      if (card && typeof card.scrollIntoView === "function") card.scrollIntoView({ block: "center" });
    }
    returnToCard.current = null;
    openedFrom.current = null;
  }, [currentIndex]);

  useEffect(() => {
    function handlePopState() {
      if (swipeTimer.current) window.clearTimeout(swipeTimer.current);
      swipeTimer.current = null;
      touchStart.current = null;
      setSwipePreview(null);
      setCurrentIndex(songIndexFromUrl());
    }
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  useEffect(() => () => {
    if (swipeTimer.current) window.clearTimeout(swipeTimer.current);
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
    } catch {
      // Favourites still work for this page when storage is unavailable.
    }
  }, [favorites]);

  const matchingSongs = sortedSongs
    .map((song, index) => ({ song, index }))
    .filter(({ song }) =>
      song.title.toLocaleLowerCase().includes(search.trim().toLocaleLowerCase()) &&
      (!showFavoritesOnly || favorites.includes(songSlug(song.title)))
    );

  function toggleFavorite(title) {
    const slug = songSlug(title);
    setFavorites((current) => current.includes(slug)
      ? current.filter((favorite) => favorite !== slug)
      : [...current, slug]
    );
  }

  function openSong(index) {
    const url = new URL(window.location.href);
    if (index == null) url.searchParams.delete("song");
    else url.searchParams.set("song", songSlug(sortedSongs[index].title));
    if (url.href !== window.location.href) window.history.pushState({}, "", url.toString());
    setCurrentIndex(index);
  }

  function transitionToSong(index, direction = null) {
    if (swipeTimer.current) window.clearTimeout(swipeTimer.current);
    swipeTimer.current = null;
    touchStart.current = null;
    setSwipePreview(null);
    if (currentIndex == null && index != null) openedFrom.current = { index, scrollY: window.scrollY };
    if (index == null) returnToCard.current = currentIndex;
    if (!document.startViewTransition || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      document.documentElement.classList.remove("shared-card-morph", "song-next", "song-prev");
      setTransitionTargetIndex(null);
      setNativeTransitionSession(false);
      setFallbackDirection(direction);
      openSong(index);
      return;
    }

    const id = ++transitionId.current;
    const targetIndex = currentIndex == null ? index : index == null ? currentIndex : null;
    document.documentElement.classList.remove("shared-card-morph", "song-next", "song-prev");
    if (currentIndex == null || index == null) document.documentElement.classList.add("shared-card-morph");
    else if (direction) document.documentElement.classList.add(`song-${direction}`);
    flushSync(() => {
      setTransitionTargetIndex(targetIndex);
      setNativeTransitionSession(true);
      setFallbackDirection(null);
    });

    const transition = document.startViewTransition(() => {
      flushSync(() => openSong(index));
    });
    const cleanup = () => {
      if (id !== transitionId.current) return;
      document.documentElement.classList.remove("shared-card-morph", "song-next", "song-prev");
      setTransitionTargetIndex(null);
      if (index == null) setNativeTransitionSession(false);
    };
    transition.finished.then(cleanup, cleanup);
  }

  function goHome() {
    transitionToSong(null);
  }

  function nextSong() {
    if (currentIndex == null) return;
    const next = (currentIndex + 1) % sortedSongs.length;
    transitionToSong(next, "next");
  }

  function prevSong() {
    if (currentIndex == null) return;
    const prev = (currentIndex - 1 + sortedSongs.length) % sortedSongs.length;
    transitionToSong(prev, "prev");
  }

  function handleTouchStart(event) {
    if (currentIndex == null || swipePreview?.phase === "commit" || swipePreview?.phase === "cancel" || event.touches.length !== 1) {
      touchStart.current = null;
      return;
    }
    const touch = event.touches[0];
    touchStart.current = { x: touch.clientX, y: touch.clientY, active: false, blocked: false, preview: null };
  }

  function handleTouchMove(event) {
    const start = touchStart.current;
    if (currentIndex == null || !start || start.blocked || event.touches.length !== 1) return;
    const touch = event.touches[0];
    const deltaX = touch.clientX - start.x;
    const deltaY = touch.clientY - start.y;

    if (!start.active) {
      if (Math.abs(deltaX) < 12 && Math.abs(deltaY) < 12) return;
      if (Math.abs(deltaX) <= Math.abs(deltaY) * 1.2) {
        start.blocked = true;
        return;
      }
      start.active = true;
    }

    const direction = deltaX < 0 ? "next" : "prev";
    const targetIndex = (currentIndex + (direction === "next" ? 1 : -1) + sortedSongs.length) % sortedSongs.length;
    if (!start.geometry) {
      const contentRect = appRef.current.querySelector(".content").getBoundingClientRect();
      const toolbarBottom = appRef.current.querySelector(".controls").getBoundingClientRect().bottom;
      start.geometry = {
        left: contentRect.left,
        width: contentRect.width || window.innerWidth || 320,
        top: toolbarBottom + 16,
      };
    }
    const { left, width, top } = start.geometry;
    const preview = {
      direction,
      targetIndex,
      dx: Math.max(-width, Math.min(width, deltaX)),
      left,
      width,
      top,
      phase: "dragging",
    };
    start.preview = preview;
    setSwipePreview(preview);
  }

  function handleTouchEnd(event) {
    const start = touchStart.current;
    touchStart.current = null;
    if (currentIndex == null || !start || event.changedTouches.length !== 1) return;
    const touch = event.changedTouches[0];
    const deltaX = touch.clientX - start.x;
    const deltaY = touch.clientY - start.y;
    if (start.blocked || Math.abs(deltaX) <= Math.abs(deltaY) * 1.2) {
      if (start.preview) settleSwipe(start.preview, false);
      return;
    }
    if (!start.preview) {
      if (Math.abs(deltaX) >= 60) {
        if (deltaX < 0) nextSong();
        else prevSong();
      }
      return;
    }
    const threshold = Math.min(85, start.preview.width * .22);
    const commit = Math.abs(deltaX) >= threshold;
    const direction = deltaX < 0 ? "next" : "prev";
    if (commit && direction !== start.preview.direction) {
      const targetIndex = (currentIndex + (direction === "next" ? 1 : -1) + sortedSongs.length) % sortedSongs.length;
      transitionToSong(targetIndex, direction);
      return;
    }
    settleSwipe(start.preview, commit);
  }

  function settleSwipe(preview, commit) {
    setSwipePreview({ ...preview, phase: commit ? "commit" : "cancel" });
    const duration = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ? 0 : 300;
    swipeTimer.current = window.setTimeout(() => {
      swipeTimer.current = null;
      if (commit) {
        flushSync(() => {
          setNativeTransitionSession(true);
          setFallbackDirection(null);
          openSong(preview.targetIndex);
          setSwipePreview(null);
        });
      } else setSwipePreview(null);
    }, duration);
  }

  function handleTouchCancel() {
    const preview = touchStart.current?.preview;
    touchStart.current = null;
    if (preview) settleSwipe(preview, false);
  }

  return (
    <div
      ref={appRef}
      className={`carols-app${currentIndex != null ? " presentation-mode" : ""}${nativeTransitionSession ? " native-transition-session" : ""}${homeIntro && currentIndex == null ? " home-intro" : ""}`}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchCancel}
    >
      <NightSky active={currentIndex == null} />
      <Header />
      <Forest />
      <main className="content">
        {currentIndex == null && (
          <section className="songs">
            <div className="section-heading">
              <div>
                <p className="eyebrow">Sing along with us</p>
                <h2 className="section-title">The songbook</h2>
                <p className="subtitle">Choose a carol to read its lyrics.</p>
              </div>
              <span className="song-count">{sortedSongs.length} songs</span>
            </div>
            <div className="list-tools">
              <label className="search-field">
                <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="m16 16 5 5" /></svg>
                <span className="sr-only">Search songs</span>
                <input
                  type="search"
                  placeholder="Search for a song..."
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                />
              </label>
              <button
                className={`favorites-filter${showFavoritesOnly ? " is-active" : ""}`}
                type="button"
                aria-pressed={showFavoritesOnly}
                onClick={() => setShowFavoritesOnly((showing) => !showing)}
              >
                <span aria-hidden="true">★</span> Favourites <span className="favorites-count">{favorites.length}</span>
              </button>
            </div>
            {matchingSongs.length === 0 && (
              <p className="no-results">{showFavoritesOnly
                ? favorites.length === 0
                  ? "No favourites yet. Show all songs and tap a star to save one."
                  : "No matching favourites. Try a different title."
                : "No songs found. Try a different title."}</p>
            )}
            <ul className="song-list">
              {matchingSongs.map((songObj, position) => (
                <li
                  className={`song-tile${homeIntro && position < 6 ? " intro-card" : ""}`}
                  key={songObj.index}
                  style={homeIntro && position < 6 ? { "--card-order": position } : undefined}
                >
                  <button
                    className="song-card"
                    type="button"
                    data-song-index={songObj.index}
                    style={transitionTargetIndex === songObj.index ? { viewTransitionName: "song-card" } : undefined}
                    onClick={() => transitionToSong(songObj.index)}
                  >
                    <span className="song-index">{String(songObj.index + 1).padStart(2, "0")}</span>
                    <span className="song-name">{songObj.song.title}</span>
                  </button>
                  <FavoriteButton
                    song={songObj.song}
                    active={favorites.includes(songSlug(songObj.song.title))}
                    onToggle={toggleFavorite}
                    className="song-favorite"
                  />
                </li>
              ))}
            </ul>
          </section>
        )}

        {currentIndex != null && <section className="post-controls" aria-label="Song lyrics">
          <div className="controls">
            <div className="navigation-controls" role="group" aria-label="Song navigation">
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
            <div className="text-size-controls" role="group" aria-label="Lyrics text size">
              <span className="text-size-label">Text size</span>
              <button
                className="btn text-size-button"
                type="button"
                aria-label="Decrease lyrics text size"
                disabled={textSizeIndex === 0}
                onClick={() => setTextSizeIndex((index) => Math.max(0, index - 1))}
              >
                A−
              </button>
              <output className="text-size-value" aria-live="polite">
                {Math.round(lyricScales[textSizeIndex] * 100)}%
              </output>
              <button
                className="btn text-size-button"
                type="button"
                aria-label="Increase lyrics text size"
                disabled={textSizeIndex === lyricScales.length - 1}
                onClick={() => setTextSizeIndex((index) => Math.min(lyricScales.length - 1, index + 1))}
              >
                A+
              </button>
            </div>
          </div>

          <div key={currentIndex} className={`lyrics${fallbackDirection ? ` song-slide-${fallbackDirection}` : ""}`} style={{ "--lyrics-font-size": `${1.125 * lyricScales[textSizeIndex] * 1.25}rem`, viewTransitionName: "song-card" }}>
              <div className="lyrics-content">
                <FavoriteButton
                  song={sortedSongs[currentIndex]}
                  active={favorites.includes(songSlug(sortedSongs[currentIndex].title))}
                  onToggle={toggleFavorite}
                  className="lyrics-favorite"
                />
                <p className="eyebrow">Carol {String(currentIndex + 1).padStart(2, "0")} of {sortedSongs.length}</p>
                <h1 className="lyrics-title">
                  {(sortedSongs[currentIndex] || { title: "" }).title}
                </h1>
                <pre className="lyrics-body">
                  {(sortedSongs[currentIndex] || { lyrics: "" }).lyrics}
                </pre>
              </div>
          </div>
        </section>}
      </main>
      {swipePreview && currentIndex != null && (
        <div
          className={`swipe-preview swipe-preview--${swipePreview.phase}`}
          aria-hidden="true"
          style={{
            top: swipePreview.top,
            left: swipePreview.left,
            width: swipePreview.width,
            transform: `translate3d(${swipePreview.phase === "commit" ? 0 : (swipePreview.direction === "next" ? swipePreview.width + 16 : -swipePreview.width - 16) + (swipePreview.phase === "cancel" ? 0 : swipePreview.dx)}px, 0, 0)`,
            "--lyrics-font-size": `${1.125 * lyricScales[textSizeIndex] * 1.25}rem`,
          }}
        >
          <div className="lyrics-content">
            <p className="eyebrow">Carol {String(swipePreview.targetIndex + 1).padStart(2, "0")} of {sortedSongs.length}</p>
            <h3 className="lyrics-title">{sortedSongs[swipePreview.targetIndex].title}</h3>
            <pre className="lyrics-body">{sortedSongs[swipePreview.targetIndex].lyrics}</pre>
          </div>
        </div>
      )}
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
