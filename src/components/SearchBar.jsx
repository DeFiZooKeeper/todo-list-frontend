export default function SearchBar({ searchQuery, onSearchChange }) {
  const handleClear = () => {
    onSearchChange('');
  };

  return (
    <div className="mb-6">
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Search todos..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          aria-label="Search todos"
        />
        {searchQuery && (
          <button
            onClick={handleClear}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors font-medium"
            aria-label="Clear search"
          >
            Clear
          </button>
        )}
      </div>
      {searchQuery && (
        <p className="text-sm text-gray-600 mt-2">
          Search: "{searchQuery}"
        </p>
      )}
    </div>
  );
}
