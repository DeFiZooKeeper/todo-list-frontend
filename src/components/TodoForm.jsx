import { useState } from 'react';

export default function TodoForm({ 
  initialText = '', 
  initialPriority = 'Medium', 
  initialDueDate = '', 
  onSubmit, 
  onCancel,
  isEditMode = false 
}) {
  // Use initialText/Priority/DueDate directly for controlled inputs instead of separate state
  const [text, setText] = useState(isEditMode ? initialText : '');
  const [priority, setPriority] = useState(isEditMode ? initialPriority : 'Medium');
  const [dueDate, setDueDate] = useState(isEditMode ? initialDueDate : '');

  const handleSubmit = () => {
    if (text.trim()) {
      onSubmit({ text, priority, dueDate });
      if (!isEditMode) {
        setText('');
        setPriority('Medium');
        setDueDate('');
      }
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      handleSubmit();
    }
  };

  const handleCancel = () => {
    setText(initialText);
    setPriority(initialPriority);
    setDueDate(initialDueDate);
    if (onCancel) {
      onCancel();
    }
  };

  if (isEditMode) {
    return (
      <div className="space-y-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyPress={handleKeyPress}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          autoFocus
        />
        <div className="flex gap-2">
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          >
            <option value="Low">Low Priority</option>
            <option value="Medium">Medium Priority</option>
            <option value="High">High Priority</option>
          </select>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleSubmit}
            className="flex-1 bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded-lg font-semibold transition-colors text-sm"
          >
            Done
          </button>
          <button
            onClick={handleCancel}
            className="flex-1 bg-gray-400 hover:bg-gray-500 text-white px-3 py-2 rounded-lg font-semibold transition-colors text-sm"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  // Add mode
  return (
    <div className="mb-6">
      <div className="flex gap-2 mb-3">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Add a new todo..."
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleSubmit}
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
        >
          Add
        </button>
      </div>
      <div className="flex gap-2">
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
        >
          <option value="Low">Low Priority</option>
          <option value="Medium">Medium Priority</option>
          <option value="High">High Priority</option>
        </select>
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
        />
      </div>
    </div>
  );
}
