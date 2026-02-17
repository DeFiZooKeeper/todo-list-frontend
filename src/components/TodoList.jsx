import TodoItem from './TodoItem';

export default function TodoList({ todos, onToggle, onRemove, onUpdate, hasSearch = false, totalTodos = 0 }) {
  if (todos.length === 0) {
    return (
      <div className="text-center text-gray-500 py-8">
        {hasSearch ? (
          <>
            <p className="text-lg">No todos match your search</p>
            <p className="text-sm">Try adjusting your search query</p>
          </>
        ) : (
          <>
            <p className="text-lg">No todos yet</p>
            <p className="text-sm">Add a todo to get started!</p>
          </>
        )}
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
