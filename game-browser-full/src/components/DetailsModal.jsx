import { useEffect, useState, useMemo } from "react";
import { fetchGameDetails, fetchGameScreenshots } from "../api.js";
import Spinner from "./Spinner.jsx";
import ErrorMessage from "./ErrorMessage.jsx";

export default function DetailsModal({ gameId, onClose }) {
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(null);
  const [details, setDetails] = useState(null);
  const [shots, setShots] = useState([]);
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    if (!gameId) return;
    let ignore = false;

    async function load() {
      try {
        setLoading(true);
        setErr(null);
        const [d, s] = await Promise.all([
          fetchGameDetails(gameId),
          fetchGameScreenshots(gameId)
        ]);
        if (!ignore) {
          setDetails(d);
          setShots(s.results || []);
          setIdx(0);
        }
      } catch (e) {
        if (!ignore) setErr(e.message || "Unknown error");
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    load();
    return () => { ignore = true; };
  }, [gameId]);

  // build image list (prefer screenshots; fall back to cover)
  const images = useMemo(() => {
    const arr = [...(shots?.map(s => s.image) || [])];
    if (arr.length === 0 && details?.background_image) arr.push(details.background_image);
    return arr;
  }, [shots, details]);

  const prev = () => setIdx(i => (i - 1 + images.length) % images.length);
  const next = () => setIdx(i => (i + 1) % images.length);

  // arrow keys
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [images.length]);

  if (!gameId) return null;

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal" onClick={e => e.stopPropagation()}>
        <button className="close" onClick={onClose} aria-label="Close details">×</button>

        {loading && <Spinner />}
        {err && <ErrorMessage message={err} onRetry={null} />}

        {details && (
          <>
            <h2>{details.name}</h2>
            <p className="meta">Released: {details.released || "TBA"}</p>
            <p className="meta">Metacritic: {details.metacritic ?? "N/A"}</p>
            <p className="desc" dangerouslySetInnerHTML={{ __html: details.description || "" }} />

            {images.length > 0 && (
              <div className="carousel" aria-label="Screenshots carousel">
                <img src={images[idx]} alt="screenshot" loading="lazy" />
                {images.length > 1 && (
                  <>
                    <button className="nav-btn nav-prev" onClick={prev} aria-label="Previous screenshot">‹</button>
                    <button className="nav-btn nav-next" onClick={next} aria-label="Next screenshot">›</button>
                  </>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
