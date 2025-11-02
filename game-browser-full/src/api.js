const BASE = "https://api.rawg.io/api";

export async function fetchGames({ query = "", page = 1 }) {
  const key = import.meta.env.VITE_RAWG_KEY;
  const url = new URL(`${BASE}/games`);
  url.searchParams.set("key", key);
  if (query) url.searchParams.set("search", query);
  url.searchParams.set("page", String(page));
  url.searchParams.set("page_size", "12");
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

export async function fetchGameDetails(id) {
  const key = import.meta.env.VITE_RAWG_KEY;
  const url = new URL(`${BASE}/games/${id}`);
  url.searchParams.set("key", key);
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

export async function fetchGameScreenshots(id) {
  const key = import.meta.env.VITE_RAWG_KEY;
  const url = new URL(`${BASE}/games/${id}/screenshots`);
  url.searchParams.set("key", key);
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}