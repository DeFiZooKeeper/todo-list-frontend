export default function TagFilter({ allTags, selectedTags, onTagClick, onClearFilters }) {
  if (allTags.length === 0) {
    return null;
  }

  const tagColors = [
    'bg-purple-100 text-purple-800 border-purple-300',
    'bg-indigo-100 text-indigo-800 border-indigo-300',
    'bg-pink-100 text-pink-800 border-pink-300',
    'bg-cyan-100 text-cyan-800 border-cyan-300',
    'bg-teal-100 text-teal-800 border-teal-300',
    'bg-lime-100 text-lime-800 border-lime-300',
  ];

  const getTagColor = (index) => tagColors[index % tagColors.length];

  return (
    <div className="mb-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs font-semibold text-gray-600 uppercase">Filter by tags</p>
        {selectedTags.length > 0 && (
          <button
            onClick={onClearFilters}
            className="text-xs text-blue-600 hover:text-blue-800 font-medium transition-colors"
          >
            Clear All
          </button>
        )}
      </div>
      <div className="flex flex-wrap gap-2">
        {allTags.map((tag, index) => {
          const isSelected = selectedTags.includes(tag);
          const baseColor = getTagColor(index);
          return (
            <button
              key={tag}
              onClick={() => onTagClick(tag)}
              className={`px-3 py-1 rounded-full text-xs font-medium border transition-all cursor-pointer ${
                isSelected
                  ? `${baseColor} border-current ring-2 ring-offset-1`
                  : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
              }`}
            >
              {tag}
            </button>
          );
        })}
      </div>
    </div>
  );
}
