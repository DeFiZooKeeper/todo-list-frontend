import { useState, useEffect } from 'react';
import AddTodo from './AddTodo';
import KanbanBoard from './KanbanBoard';
import SearchBar from './SearchBar';
import TagFilter from './TagFilter';
import { sortByUrgency } from '../utils/urgencySort';

/** Migrate a todo that may still carry the old `done` boolean field. */
function migrateTodo(todo) {
  if (todo.status !== undefined) return todo;
  return { ...todo, status: todo.done ? 'done' : 'todo' };
}

export default function TodoApp() {
  const [todos, setTodos] = useState(() => {
    const saved = localStorage.getItem('todos');
    const raw = saved
      ? JSON.parse(saved)
      : [{ id: 1, text: 'Learn React', done: false, priority: 'Medium', dueDate: '', tags: [] }];
    return raw.map(migrateTodo);
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);

  // Save todos to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  const addTodo = (text, priority = 'Medium', dueDate = '', tags = []) => {
    setTodos([...todos, { id: Date.now(), text, status: 'todo', priority, dueDate, tags }]);
  };

  const moveTodo = (id, newStatus) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, status: newStatus } : todo
      )
    );
  };

  const removeTodo = (id) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const updateTodoTags = (id, newTags) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, tags: newTags } : todo
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

  // Sort todos by urgency within each column
  const sortedTodos = sortByUrgency(filteredTodos);

  // Status counts (always from the full todos list, not filtered)
  const todoCount = todos.filter((t) => t.status === 'todo').length;
  const activeCount = todos.filter((t) => t.status === 'active').length;
  const doneCount = todos.filter((t) => t.status === 'done').length;

  // Handle tag click to filter
  const handleTagClick = (tag) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 py-8 px-4">
      <div className="max-w-5xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2 text-center">
          My Todos
        </h1>
        <p className="text-gray-600 text-center mb-4">
          Stay organized and track your tasks
        </p>

        {/* Status summary */}
        <div className="flex justify-center gap-4 mb-6">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-100">
            <span className="w-2.5 h-2.5 rounded-full bg-gray-400 inline-block" />
            <span className="text-sm text-gray-600 font-medium">To Do: <strong>{todoCount}</strong></span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block" />
            <span className="text-sm text-blue-700 font-medium">In Progress: <strong>{activeCount}</strong></span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-50">
            <span className="w-2.5 h-2.5 rounded-full bg-green-500 inline-block" />
            <span className="text-sm text-green-700 font-medium">Done: <strong>{doneCount}</strong></span>
          </div>
        </div>

        <AddTodo onAdd={addTodo} />
        <SearchBar searchQuery={searchQuery} onSearchChange={setSearchQuery} />
        <TagFilter
          allTags={allTags}
          selectedTags={selectedTags}
          onTagClick={handleTagClick}
          onClearFilters={() => setSelectedTags([])}
        />

        {sortedTodos.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            {searchQuery || selectedTags.length > 0 ? (
              <>
                <p className="text-lg">No todos match your filters</p>
                <p className="text-sm">Try adjusting your search or tag filters</p>
              </>
            ) : (
              <>
                <p className="text-lg">No todos yet</p>
                <p className="text-sm">Add a todo to get started!</p>
              </>
            )}
          </div>
        ) : (
          <KanbanBoard
            todos={sortedTodos}
            onMove={moveTodo}
            onRemove={removeTodo}
            onTagClick={handleTagClick}
            onUpdateTags={updateTodoTags}
          />
        )}
      </div>
    </div>
  );
}
