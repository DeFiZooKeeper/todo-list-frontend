import { useState, useEffect } from 'react';
import AddTodo from './AddTodo';
import TodoList from './TodoList';

export default function TodoApp() {
  const [todos, setTodos] = useState(() => {
    const saved = localStorage.getItem('todos');
    return saved
      ? JSON.parse(saved)
      : [{ id: 1, text: 'Learn React', done: false, priority: 'Medium', dueDate: '' }];
  });

  // Save todos to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  const addTodo = (text, priority = 'Medium', dueDate = '') => {
    setTodos([...todos, { id: Date.now(), text, done: false, priority, dueDate }]);
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

  // Sort todos by due date (ascending, with empty dates at the end)
  const sortedTodos = [...todos].sort((a, b) => {
    if (!a.dueDate && !b.dueDate) return 0;
    if (!a.dueDate) return 1;
    if (!b.dueDate) return -1;
    return new Date(a.dueDate) - new Date(b.dueDate);
  });

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
        <TodoList
          todos={sortedTodos}
          onToggle={toggleTodo}
          onRemove={removeTodo}
          onUpdate={updateTodo}
        />
      </div>
    </div>
  );
}
