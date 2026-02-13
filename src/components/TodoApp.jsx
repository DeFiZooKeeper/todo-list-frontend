import { useState, useEffect } from 'react';
import TodoForm from './TodoForm';
import TodoList from './TodoList';

export default function TodoApp() {
  const [todos, setTodos] = useState(() => {
    const saved = localStorage.getItem('todos');
    return saved
      ? JSON.parse(saved)
      : [{ id: 1, text: 'Learn React', done: false, priority: 'Medium', dueDate: '' }];
  });

  const [searchText, setSearchText] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [priorityFilter, setPriorityFilter] = useState('');
  const [dateRangeStart, setDateRangeStart] = useState('');
  const [dateRangeEnd, setDateRangeEnd] = useState('');
  const [editingId, setEditingId] = useState(null);

  // Save todos to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  const addTodo = (formData) => {
    setTodos([...todos, { 
      id: Date.now(), 
      text: formData.text, 
      done: false, 
      priority: formData.priority, 
      dueDate: formData.dueDate 
    }]);
  };

  const toggleTodo = (id) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, done: !todo.done } : todo
      )
    );
  };

  const removeTodo = (id) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const updateTodo = (id, updates) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, ...updates } : todo
      )
    );
  };

  // Filter and sort logic
  const getFilteredAndSortedTodos = () => {
    let filtered = [...todos];

    // Apply text search filter (case-insensitive)
    if (searchText.trim()) {
      const searchLower = searchText.toLowerCase();
      filtered = filtered.filter(todo =>
        todo.text.toLowerCase().includes(searchLower)
      );
    }

    // Apply priority filter (AND logic)
    if (priorityFilter) {
      filtered = filtered.filter(todo => todo.priority === priorityFilter);
    }

    // Apply date range filter (AND logic)
    if (dateRangeStart || dateRangeEnd) {
      filtered = filtered.filter(todo => {
        if (!todo.dueDate) return false;
        const todoDueDate = new Date(todo.dueDate);
        
        if (dateRangeStart) {
          const startDate = new Date(dateRangeStart);
          if (todoDueDate < startDate) return false;
        }
        
        if (dateRangeEnd) {
          const endDate = new Date(dateRangeEnd);
          if (todoDueDate > endDate) return false;
        }
        
        return true;
      });
    }

    // Sort by due date (ascending, with empty dates at the end)
    filtered.sort((a, b) => {
      if (!a.dueDate && !b.dueDate) return 0;
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;
      return new Date(a.dueDate) - new Date(b.dueDate);
    });

    return filtered;
  };

  const filteredTodos = getFilteredAndSortedTodos();

  const clearFilters = () => {
    setSearchText('');
    setPriorityFilter('');
    setDateRangeStart('');
    setDateRangeEnd('');
  };

  const hasActiveFilters = searchText || priorityFilter || dateRangeStart || dateRangeEnd;

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 py-8 px-4">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2 text-center">
          My Todos
        </h1>
        <p className="text-gray-600 text-center mb-6">
          Stay organized and track your tasks
        </p>
        
        <TodoForm onSubmit={addTodo} />

        {/* Search Box */}
        <div className="mb-4">
          <input
            type="text"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="Search todos..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
        </div>

        {/* Filters Button */}
        <div className="mb-4 flex gap-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex-1 px-4 py-2 rounded-lg font-semibold transition-colors ${
              showFilters 
                ? 'bg-blue-500 hover:bg-blue-600 text-white' 
                : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
            }`}
          >
            Filters {hasActiveFilters && '✓'}
          </button>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg font-semibold transition-colors text-sm"
            >
              Clear
            </button>
          )}
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <div className="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200 space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Priority
              </label>
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              >
                <option value="">All Priorities</option>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date Range
              </label>
              <div className="flex gap-2">
                <input
                  type="date"
                  value={dateRangeStart}
                  onChange={(e) => setDateRangeStart(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  placeholder="From"
                />
                <input
                  type="date"
                  value={dateRangeEnd}
                  onChange={(e) => setDateRangeEnd(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  placeholder="To"
                />
              </div>
            </div>
          </div>
        )}

        <TodoList
          todos={filteredTodos}
          onToggle={toggleTodo}
          onRemove={removeTodo}
          onUpdate={updateTodo}
          editingId={editingId}
          onEditStart={(id) => setEditingId(id)}
          onEditEnd={() => setEditingId(null)}
        />
      </div>
    </div>
  );
}
