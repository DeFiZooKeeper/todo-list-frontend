export default function TodoItem({ id, text, done, onToggle, onRemove }) {
  return (
    <div className="flex items-center gap-3 p-3 bg-white border rounded-lg shadow-sm hover:shadow-md transition-shadow">
      <input
        type="checkbox"
        checked={done}
        onChange={() => onToggle(id)}
        className="w-5 h-5 cursor-pointer"
      />
      <span
        className={`flex-1 ${
          done ? 'line-through text-gray-400' : 'text-gray-800'
        }`}
      >
        {text}
      </span>
      <button
        onClick={() => onRemove(id)}
        className="text-red-500 hover:text-red-700 font-semibold transition-colors"
      >
        Delete
      </button>
    </div>
  );
}
