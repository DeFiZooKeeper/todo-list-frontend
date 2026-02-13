import TodoItem from './TodoItem';

export default function TodoList({ todos, onToggle, onRemove, onUpdate }) {
  if (todos.length === 0) {
    return (
      <div className="text-center text-gray-500 py-8">
        <p className="text-lg">No todos yet</p>
        <p className="text-sm">Add a todo to get started!</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          id={todo.id}
          text={todo.text}
          done={todo.done}
          priority={todo.priority}
          dueDate={todo.dueDate}
          onToggle={onToggle}
          onRemove={onRemove}
          onUpdate={onUpdate}
        />
      ))}
    </div>
  );
}
