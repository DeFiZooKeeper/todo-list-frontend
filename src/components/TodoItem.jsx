import { getUrgencyCategory } from '../utils/urgencySort';

export default function TodoItem({
  id,
  text,
  status,
  // legacy support: if status is not provided, fall back to done
  done,
  priority = 'Medium',
  dueDate = '',
  tags = [],
  onToggle,
  onRemove,
  onTagClick,
  onMoveBack,
  onMoveNext,
}) {
  // Normalise: if status prop is provided use it, otherwise derive from done
  const resolvedStatus = status !== undefined ? status : (done ? 'done' : 'todo');
  const isDone = resolvedStatus === 'done';

  const tagColors = [
    'bg-purple-100 text-purple-800',
    'bg-indigo-100 text-indigo-800',
    'bg-pink-100 text-pink-800',
    'bg-cyan-100 text-cyan-800',
    'bg-teal-100 text-teal-800',
    'bg-lime-100 text-lime-800',
  ];

  const getTagColor = (index) => tagColors[index % tagColors.length];

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

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case 'overdue':
        return 'bg-red-100 text-red-800';
      case 'today':
        return 'bg-orange-100 text-orange-800';
      case 'thisWeek':
        return 'bg-blue-100 text-blue-800';
      case 'later':
        return 'bg-gray-100 text-gray-800';
      case 'none':
        return 'bg-gray-50 text-gray-700';
      default:
        return 'bg-gray-50 text-gray-700';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const urgency = getUrgencyCategory({ dueDate, done: isDone });

  return (
    <div className={`flex flex-col gap-2 p-3 border rounded-lg shadow-sm hover:shadow-md transition-shadow ${
      urgency === 'overdue' ? 'border-red-200' : 'border-gray-200'
    } bg-white`}>
      <div className="flex items-start gap-2">
        {onToggle && (
          <input
            type="checkbox"
            checked={isDone}
            onChange={() => onToggle(id)}
            className="w-5 h-5 cursor-pointer mt-0.5"
          />
        )}
        <div className="flex-1 min-w-0">
          <span
            className={`block text-sm ${
              isDone ? 'line-through text-gray-400' : 'text-gray-800'
            }`}
          >
            {text}
          </span>
          <div className="flex gap-1 mt-1 flex-wrap">
            <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium border ${getPriorityColor(priority)}`}>
              {priority}
            </span>
            {dueDate && (
              <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${getUrgencyColor(urgency)}`}>
                {formatDate(dueDate)}
              </span>
            )}
            {tags && tags.map((tag, index) => (
              <button
                key={tag}
                onClick={() => onTagClick && onTagClick(tag)}
                className={`inline-block px-2 py-0.5 rounded text-xs font-medium cursor-pointer hover:opacity-80 transition-opacity ${getTagColor(index)}`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
        <button
          onClick={() => onRemove(id)}
          className="text-red-400 hover:text-red-600 text-xs font-semibold transition-colors shrink-0"
        >
          Delete
        </button>
      </div>

      {/* Move buttons — only rendered in kanban context */}
      {(onMoveBack || onMoveNext) && (
        <div className="flex gap-1 justify-between pt-1 border-t border-gray-100">
          {onMoveBack ? (
            <button
              onClick={onMoveBack}
              className="text-xs px-2 py-0.5 rounded bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors"
            >
              ← Back
            </button>
          ) : (
            <span />
          )}
          {onMoveNext ? (
            <button
              onClick={onMoveNext}
              className="text-xs px-2 py-0.5 rounded bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors"
            >
              Next →
            </button>
          ) : (
            <span />
          )}
        </div>
      )}
    </div>
  );
}
