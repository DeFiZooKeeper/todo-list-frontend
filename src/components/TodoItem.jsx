export default function TodoItem({ id, text, done, priority = 'Medium', dueDate = '', onToggle, onRemove, onUpdate }) {
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'Low':
        return 'bg-green-100 text-green-800 border-green-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const isOverdue = () => {
    if (!dueDate) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const due = new Date(dueDate);
    due.setHours(0, 0, 0, 0);
    return due < today && !done;
  };

  return (
    <div className={`flex items-center gap-3 p-3 border rounded-lg shadow-sm hover:shadow-md transition-shadow ${
      isOverdue() ? 'bg-red-50 border-red-200' : 'bg-white'
    }`}>
      <input
        type="checkbox"
        checked={done}
        onChange={() => onToggle(id)}
        className="w-5 h-5 cursor-pointer"
      />
      <div className="flex-1 min-w-0">
        <span
          className={`block ${
            done ? 'line-through text-gray-400' : 'text-gray-800'
          }`}
        >
          {text}
        </span>
        <div className="flex gap-2 mt-1 flex-wrap">
          <span className={`inline-block px-2 py-1 rounded text-xs font-medium border ${getPriorityColor(priority)}`}>
            {priority}
          </span>
          {dueDate && (
            <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
              isOverdue() ? 'bg-red-200 text-red-900' : 'bg-blue-100 text-blue-800'
            }`}>
              {formatDate(dueDate)}
            </span>
          )}
        </div>
      </div>
      <button
        onClick={() => onRemove(id)}
        className="text-red-500 hover:text-red-700 font-semibold transition-colors"
      >
        Delete
      </button>
    </div>
  );
}
