export default function GameCard({ game, onOpen }) {
  const img =
    game.background_image ||
    (game.short_screenshots && game.short_screenshots[0]?.image);

  return (
    <article className="card" tabIndex={0} aria-label={game.name}>
      {img && <img src={img} alt={game.name} loading="lazy" />}
      <div className="card-body">
        <h3 title={game.name}>{game.name}</h3>
        <p className="meta">{game.released ? `Released: ${game.released}` : "Release TBA"}</p>
        <p className="meta">
          Rating: {game.metacritic ?? "N/A"} | Platforms: {Array.isArray(game.parent_platforms)
            ? game.parent_platforms.map(p => p.platform.name).join(", ")
            : "N/A"}
        </p>
        <button className="ghost" onClick={() => onOpen(game.id)} aria-label={`Open details for ${game.name}`}>
          Details
        </button>
      </div>
    </article>
  );
}