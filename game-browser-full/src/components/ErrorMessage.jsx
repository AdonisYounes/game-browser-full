export default function ErrorMessage({ message, onRetry }) {
  return (
    <div className="error" role="alert">
      <p>Failed to load data: {message}</p>
      {onRetry && (
        <button onClick={onRetry} aria-label="Retry fetching data">Retry</button>
      )}
    </div>
  );
}