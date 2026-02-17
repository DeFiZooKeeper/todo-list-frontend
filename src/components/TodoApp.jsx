import { useState, useEffect } from 'react';
import AddTodo from './AddTodo';
import TodoList from './TodoList';
import SearchBar from './SearchBar';
import TagFilter from './TagFilter';
import { sortByUrgency } from '../utils/urgencySort';

export default function TodoApp() {
  const [todos, setTodos] = useState(() => {
    const saved = localStorage.getItem('todos');
    return saved
      ? JSON.parse(saved)
      : [{ id: 1, text: 'Learn React', done: false, priority: 'Medium', dueDate: '', tags: [] }];
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);

  // Save todos to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  const addTodo = (text, priority = 'Medium', dueDate = '', tags = []) => {
    setTodos([...todos, { id: Date.now(), text, done: false, priority, dueDate, tags }]);
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

  // Get all unique tags
  const allTags = [...new Set(todos.flatMap((todo) => todo.tags || []))].sort();

  // Filter todos by search query (case-insensitive)
  let filteredTodos = todos.filter((todo) =>
    todo.text.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Filter by selected tags (show todos matching ANY selected tag)
  if (selectedTags.length > 0) {
    filteredTodos = filteredTodos.filter((todo) =>
      selectedTags.some((tag) => (todo.tags || []).includes(tag))
    );
  }

  // Sort todos by urgency
  const sortedTodos = sortByUrgency(filteredTodos);

  // Handle tag click to filter
  const handleTagClick = (tag) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 py-8 px-4">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2 text-center">
          My Todos
        </h1>
        <p className="text-gray-600 text-center mb-6">
          Stay organized and track your tasks
        </p>
        <AddTodo onAdd={addTodo} />
        <SearchBar searchQuery={searchQuery} onSearchChange={setSearchQuery} />
        <TagFilter
          allTags={allTags}
          selectedTags={selectedTags}
          onTagClick={handleTagClick}
          onClearFilters={() => setSelectedTags([])}
        />
        <TodoList
          todos={sortedTodos}
          onToggle={toggleTodo}
          onRemove={removeTodo}
          onUpdate={updateTodo}
          onTagClick={handleTagClick}
          hasSearch={searchQuery.length > 0}
          totalTodos={todos.length}
        />
      </div>
    </div>
  );
}
