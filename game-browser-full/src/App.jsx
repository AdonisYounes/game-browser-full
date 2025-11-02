import { useEffect, useState, useCallback } from "react";
import { fetchGames } from "./api.js";
import SearchBar from "./components/SearchBar.jsx";
import Spinner from "./components/Spinner.jsx";
import ErrorMessage from "./components/ErrorMessage.jsx";
import GameList from "./components/GameList.jsx";
import DetailsModal from "./components/DetailsModal.jsx";
import "./styles.css";

export default function App() {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [openId, setOpenId] = useState(null);

  // Matte-black reactive background: update CSS vars with the mouse
  useEffect(() => {
    let raf = 0;
    const onMove = (e) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const root = document.documentElement;
        root.style.setProperty("--mx", e.clientX + "px");
        root.style.setProperty("--my", e.clientY + "px");
      });
    };
    window.addEventListener("mousemove", onMove);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
    };
  }, []);

  const load = useCallback(
    async ({ reset = false } = {}) => {
      try {
        setLoading(true);
        setErr(null);
        const nextPage = reset ? 1 : page;
        const data = await fetchGames({ query, page: nextPage });
        const newGames = reset ? data.results : [...games, ...data.results];
        setGames(newGames);
        setHasMore(Boolean(data.next));
        setPage(nextPage + 1);
      } catch (e) {
        setErr(e.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    },
    [query, page, games]
  );

  // Initial load
  useEffect(() => {
    load({ reset: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSearch = async (q) => {
    setQuery(q);
    setPage(1);
    setGames([]);
    await load({ reset: true });
  };

  return (
    <main className="container">

    <div className="ps3-bg">
  <div className="ps3-wave"></div>
  <div className="ps3-wave"></div>
  <div className="ps3-wave"></div>
</div>

      <header>
        <h1>Game Browser</h1>
        <p>Browse and search videogames via RAWG</p>
      </header>

      <SearchBar onSearch={onSearch} />

      {err && <ErrorMessage message={err} onRetry={() => load({ reset: true })} />}

      {!err && <GameList games={games} onOpen={setOpenId} />}

      <div className="controls">
        {hasMore && !loading && !err && (
          <button className="btn" onClick={() => load()}>
            Load more
          </button>
        )}
        {loading && <Spinner />}
      </div>

      <footer>
        <small>Data from RAWG. Student project.</small>
      </footer>

      {openId && <DetailsModal gameId={openId} onClose={() => setOpenId(null)} />}
    </main>
  );

}
