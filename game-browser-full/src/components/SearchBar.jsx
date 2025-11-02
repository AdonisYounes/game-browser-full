import { useState } from "react";

export default function SearchBar({ onSearch }) {
  const [text, setText] = useState("");

  return (
    <form
      className="searchbar"
      onSubmit={e => {
        e.preventDefault();
        onSearch(text.trim());
      }}
    >
      <input
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="Search games (eg. Elden Ring)"
        aria-label="Search games"
      />
      <button type="submit">Search</button>
    </form>
  );
}