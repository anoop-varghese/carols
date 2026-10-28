import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import App from "./App";
import songsData from "./data/songs";

jest.mock("@microsoft/clarity", () => ({ init: jest.fn() }));

const originalMatchMedia = window.matchMedia;

function setReducedMotion(matches) {
  window.matchMedia = jest.fn().mockImplementation((query) => ({
    matches: query.includes("prefers-reduced-motion") && matches,
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
  }));
}

beforeEach(() => {
  window.history.replaceState({}, "", "/");
  window.localStorage.clear();
  setReducedMotion(true);
});

afterEach(() => {
  window.matchMedia = originalMatchMedia;
});

test("searches songs and opens the selected lyrics", () => {
  const firstSong = [...songsData].sort((a, b) => a.title.localeCompare(b.title))[0];
  render(<App />);

  const search = screen.getByRole("searchbox", { name: "Search songs" });
  fireEvent.change(search, { target: { value: "a title that does not exist" } });
  expect(screen.getByText("No songs found. Try a different title.")).toBeInTheDocument();

  fireEvent.change(search, { target: { value: firstSong.title } });
  fireEvent.click(screen.getByText(firstSong.title));
  expect(document.querySelector(".carols-app")).toHaveClass("presentation-mode");
  const firstSlug = new URLSearchParams(window.location.search).get("song");
  expect(firstSlug).toBeTruthy();
  expect(screen.getByRole("heading", { name: firstSong.title, level: 1 })).toBeInTheDocument();
  expect(document.querySelector(".lyrics-body").textContent).toBe(firstSong.lyrics);
  const initialSize = document.querySelector(".lyrics").style.getPropertyValue("--lyrics-font-size");
  fireEvent.click(screen.getByRole("button", { name: "Increase lyrics text size" }));
  expect(screen.getByText("110%")).toBeInTheDocument();
  expect(document.querySelector(".lyrics").style.getPropertyValue("--lyrics-font-size")).not.toBe(initialSize);
  document.querySelector(".carols-app").scrollTop = 400;
  fireEvent.click(screen.getByRole("button", { name: "Next" }));
  expect(document.querySelector(".carols-app").scrollTop).toBe(0);
  expect(new URLSearchParams(window.location.search).get("song")).not.toBe(firstSlug);
  expect(screen.getByText("110%")).toBeInTheDocument();

  fireEvent.click(screen.getByRole("button", { name: "Home" }));
  expect(document.querySelector(".carols-app")).not.toHaveClass("presentation-mode");
  expect(window.location.search).toBe("");
  expect(screen.getByRole("searchbox", { name: "Search songs" })).toHaveValue(firstSong.title);
});

test("opens a shared song directly in the lyrics view", () => {
  const firstSong = [...songsData].sort((a, b) => a.title.localeCompare(b.title))[0];
  window.history.replaceState({}, "", "/?song=aanandhame-daiva");
  render(<App />);

  expect(screen.getByRole("heading", { name: firstSong.title, level: 1 })).toBeInTheDocument();
  expect(document.querySelector(".carols-app")).toHaveClass("presentation-mode");
  expect(screen.queryByRole("button", { name: "Copy link" })).not.toBeInTheDocument();
  expect(screen.queryByRole("button", { name: "Presentation mode" })).not.toBeInTheDocument();

  window.history.replaceState({}, "", "/");
  fireEvent.popState(window);
  expect(document.querySelector(".carols-app")).not.toHaveClass("presentation-mode");
  expect(screen.getByRole("searchbox", { name: "Search songs" })).toBeInTheDocument();
});

test("replays the opening on reload and returns to the top when it finishes", () => {
  setReducedMotion(false);
  jest.useFakeTimers();
  const scrollTo = jest.spyOn(window, "scrollTo").mockImplementation(() => {});
  const originalScrollY = Object.getOwnPropertyDescriptor(window, "scrollY");
  Object.defineProperty(window, "scrollY", { configurable: true, value: 350 });
  try {
    const firstLoad = render(<App />);
    expect(document.querySelector(".carols-app")).toHaveClass("home-intro");
    expect(scrollTo).toHaveBeenCalledWith(0, 0);
    expect(document.querySelector("main")).toHaveAttribute("inert");
    expect(document.querySelector("main")).toHaveAttribute("aria-hidden", "true");
    firstLoad.unmount();

    render(<App />);
    expect(document.querySelector(".carols-app")).toHaveClass("home-intro");
    expect(document.querySelector(".intro-backdrop")).toBeInTheDocument();

    act(() => jest.advanceTimersByTime(1600));
    expect(scrollTo).toHaveBeenCalledWith(0, 0);
    expect(document.querySelector(".carols-app")).not.toHaveClass("home-intro");
    expect(document.querySelector("main")).not.toHaveAttribute("inert");
  } finally {
    if (originalScrollY) Object.defineProperty(window, "scrollY", originalScrollY);
    scrollTo.mockRestore();
    jest.useRealTimers();
  }
});

test("swipes between songs without treating vertical scroll as navigation", () => {
  const songs = [...songsData].sort((a, b) => a.title.localeCompare(b.title));
  window.history.replaceState({}, "", "/?song=aanandhame-daiva");
  render(<App />);

  function swipe(fromX, fromY, toX, toY) {
    const lyrics = document.querySelector(".lyrics");
    fireEvent.touchStart(lyrics, { touches: [{ clientX: fromX, clientY: fromY }] });
    fireEvent.touchEnd(lyrics, { changedTouches: [{ clientX: toX, clientY: toY }] });
  }

  swipe(260, 100, 100, 110);
  expect(screen.getByRole("heading", { name: songs[1].title })).toBeInTheDocument();
  expect(new URLSearchParams(window.location.search).get("song")).toBe("anaswara-sneha-swaroopanayi");

  swipe(100, 100, 260, 110);
  expect(screen.getByRole("heading", { name: songs[0].title })).toBeInTheDocument();

  swipe(260, 100, 100, 400);
  swipe(260, 100, 220, 105);
  expect(screen.getByRole("heading", { name: songs[0].title })).toBeInTheDocument();
});

test("holds an adjacent song in view and settles or opens it on release", async () => {
  const songs = [...songsData].sort((a, b) => a.title.localeCompare(b.title));
  window.history.replaceState({}, "", "/?song=aanandhame-daiva");
  render(<App />);

  const lyrics = document.querySelector(".lyrics");
  fireEvent.touchStart(lyrics, { touches: [{ clientX: 300, clientY: 200 }] });
  fireEvent.touchMove(lyrics, { touches: [{ clientX: 250, clientY: 205 }] });
  expect(document.querySelector(".swipe-preview .lyrics-title").textContent).toBe(songs[1].title);
  fireEvent.touchEnd(lyrics, { changedTouches: [{ clientX: 250, clientY: 205 }] });
  await waitFor(() => expect(document.querySelector(".swipe-preview")).toBeNull());
  expect(screen.getByRole("heading", { name: songs[0].title })).toBeInTheDocument();

  fireEvent.touchStart(lyrics, { touches: [{ clientX: 300, clientY: 200 }] });
  fireEvent.touchMove(lyrics, { touches: [{ clientX: 120, clientY: 205 }] });
  fireEvent.touchEnd(lyrics, { changedTouches: [{ clientX: 120, clientY: 205 }] });
  await waitFor(() => expect(screen.getByRole("heading", { name: songs[1].title })).toBeInTheDocument());
  expect(document.querySelector(".swipe-preview")).toBeNull();
  expect(new URLSearchParams(window.location.search).get("song")).toBe("anaswara-sneha-swaroopanayi");
});

test("uses the release direction when a swipe reverses", () => {
  const songs = [...songsData].sort((a, b) => a.title.localeCompare(b.title));
  window.history.replaceState({}, "", "/?song=aanandhame-daiva");
  render(<App />);

  const lyrics = document.querySelector(".lyrics");
  fireEvent.touchStart(lyrics, { touches: [{ clientX: 300, clientY: 200 }] });
  fireEvent.touchMove(lyrics, { touches: [{ clientX: 100, clientY: 200 }] });
  expect(document.querySelector(".swipe-preview .lyrics-title").textContent).toBe(songs[1].title);

  fireEvent.touchEnd(lyrics, { changedTouches: [{ clientX: 420, clientY: 200 }] });
  expect(screen.getByRole("heading", { name: songs[songs.length - 1].title, level: 1 })).toBeInTheDocument();
  expect(document.querySelector(".swipe-preview")).toBeNull();
});

test("saves favourites and filters the songbook after a reload", () => {
  const songs = [...songsData].sort((a, b) => a.title.localeCompare(b.title));
  const firstSong = songs[0];
  const { unmount } = render(<App />);

  fireEvent.click(screen.getByRole("button", { name: `Add ${firstSong.title} to favourites` }));
  expect(screen.getByRole("button", { name: `Remove ${firstSong.title} from favourites` })).toHaveAttribute("aria-pressed", "true");
  unmount();

  render(<App />);
  fireEvent.click(screen.getByRole("button", { name: /Favourites 1/ }));
  expect(screen.getByText(firstSong.title)).toBeInTheDocument();
  expect(screen.queryByText(songs[1].title)).not.toBeInTheDocument();

  fireEvent.click(screen.getByText(firstSong.title));
  fireEvent.click(screen.getByRole("button", { name: `Remove ${firstSong.title} from favourites` }));
  fireEvent.click(screen.getByRole("button", { name: "Home" }));
  expect(screen.getByText(/No favourites yet/)).toBeInTheDocument();
});
