import { useState, useEffect, useRef, useCallback } from 'react';
import TodoForm from './TodoForm';

export default function TodoItem({ 
  id, 
  text, 
  done, 
  priority = 'Medium', 
  dueDate = '', 
  isEditing = false,
  onToggle, 
  onRemove, 
  onUpdate,
  onEditStart,
  onEditEnd
}) {
  const [isEditMode, setIsEditMode] = useState(isEditing);
  const itemRef = useRef(null);

  useEffect(() => {
    setIsEditMode(isEditing);
  }, [isEditing]);

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

  const handleEditSubmit = useCallback((updates) => {
    onUpdate(id, updates);
    setIsEditMode(false);
    if (onEditEnd) {
      onEditEnd();
    }
  }, [id, onUpdate, onEditEnd]);

  const handleEditCancel = useCallback(() => {
    setIsEditMode(false);
    if (onEditEnd) {
      onEditEnd();
    }
  }, [onEditEnd]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isEditMode) {
        handleEditCancel();
      }
    };

    const handleClickOutside = (e) => {
      if (isEditMode && itemRef.current && !itemRef.current.contains(e.target)) {
        handleEditCancel();
      }
    };

    if (isEditMode) {
      document.addEventListener('keydown', handleKeyDown);
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('keydown', handleKeyDown);
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
    return undefined;
  }, [isEditMode, handleEditCancel]);

  if (isEditMode) {
    return (
      <div ref={itemRef} className="p-3 border rounded-lg shadow-sm bg-white">
        <TodoForm
          initialText={text}
          initialPriority={priority}
          initialDueDate={dueDate}
          onSubmit={handleEditSubmit}
          onCancel={handleEditCancel}
          isEditMode={true}
        />
      </div>
    );
  }

  // Display mode
  return (
    <div 
      ref={itemRef}
      className={`flex items-center gap-3 p-3 border rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer group ${
        isOverdue() ? 'bg-red-50 border-red-200' : 'bg-white'
      }`}
      onClick={() => {
        setIsEditMode(true);
        if (onEditStart) {
          onEditStart();
        }
      }}
    >
      <input
        type="checkbox"
        checked={done}
        onChange={() => onToggle(id)}
        onClick={(e) => e.stopPropagation()}
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
        onClick={(e) => {
          e.stopPropagation();
          onRemove(id);
        }}
        className="text-red-500 hover:text-red-700 font-semibold transition-colors opacity-0 group-hover:opacity-100"
      >
        Delete
      </button>
    </div>
  );
}
