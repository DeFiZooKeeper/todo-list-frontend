import { useState } from 'react';
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
  onUpdateTags,
  onTagClick,
  onMoveBack,
  onMoveNext,
}) {
  // Normalise: if status prop is provided use it, otherwise derive from done
  const resolvedStatus = status !== undefined ? status : (done ? 'done' : 'todo');
  const isDone = resolvedStatus === 'done';

  // State for tag editing
  const [isEditingTags, setIsEditingTags] = useState(false);
  const [tagInput, setTagInput] = useState('');

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

  const handleRemoveTag = (tagToRemove) => {
    const newTags = (tags || []).filter((tag) => tag !== tagToRemove);
    onUpdateTags(id, newTags);
  };

  const handleAddTags = () => {
    if (!tagInput.trim()) return;
    
    const newTags = tagInput
      .split(',')
      .map((tag) => tag.trim())
      .filter((tag) => tag && !(tags || []).includes(tag));
    
    if (newTags.length > 0) {
      onUpdateTags(id, [...(tags || []), ...newTags]);
    }
    setTagInput('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTags();
    }
  };

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
              <span
                key={tag}
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ${getTagColor(index)}`}
              >
                <button
                  onClick={() => onTagClick && onTagClick(tag)}
                  className="hover:opacity-80 transition-opacity cursor-pointer"
                >
                  {tag}
                </button>
                {isEditingTags && (
                  <button
                    onClick={() => handleRemoveTag(tag)}
                    className="ml-0.5 text-xs hover:text-red-600 transition-colors"
                    title="Remove tag"
                  >
                    ×
                  </button>
                )}
              </span>
            ))}
            {!isEditingTags && (
              <button
                onClick={() => setIsEditingTags(true)}
                className="inline-block px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
                title="Edit tags"
              >
                + Tags
              </button>
            )}
          </div>
          
          {/* Tag editing UI */}
          {isEditingTags && (
            <div className="mt-2 flex gap-2 items-center">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Add tags (comma separated)"
                className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-400"
                autoFocus
              />
              <button
                onClick={handleAddTags}
                className="px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors"
              >
                Add
              </button>
              <button
                onClick={() => {
                  setIsEditingTags(false);
                  setTagInput('');
                }}
                className="px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
              >
                Done
              </button>
            </div>
          )}
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
