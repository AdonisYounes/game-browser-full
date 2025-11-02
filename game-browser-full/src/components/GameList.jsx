import GameCard from "./GameCard.jsx";

export default function GameList({ games, onOpen }) {
  if (!games?.length) return <p>No results.</p>;
  return (
    <section className="grid">
      {games.map(g => (
        <GameCard key={g.id} game={g} onOpen={onOpen} />
      ))}
    </section>
  );
}