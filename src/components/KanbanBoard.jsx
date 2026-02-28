import TodoItem from './TodoItem';

const COLUMNS = [
  {
    key: 'todo',
    title: 'To Do',
    bg: 'bg-gray-100',
    headerBg: 'bg-gray-200',
    countBg: 'bg-gray-400 text-white',
  },
  {
    key: 'active',
    title: 'In Progress',
    bg: 'bg-blue-50',
    headerBg: 'bg-blue-200',
    countBg: 'bg-blue-500 text-white',
  },
  {
    key: 'done',
    title: 'Done',
    bg: 'bg-green-50',
    headerBg: 'bg-green-200',
    countBg: 'bg-green-500 text-white',
  },
];

export default function KanbanBoard({ todos, onMove, onRemove, onUpdateTags, onTagClick }) {
  const getTodosForColumn = (columnKey) =>
    todos.filter((todo) => todo.status === columnKey);

  const getPrevStatus = (currentStatus) => {
    const order = ['todo', 'active', 'done'];
    const idx = order.indexOf(currentStatus);
    return idx > 0 ? order[idx - 1] : null;
  };

  const getNextStatus = (currentStatus) => {
    const order = ['todo', 'active', 'done'];
    const idx = order.indexOf(currentStatus);
    return idx < order.length - 1 ? order[idx + 1] : null;
  };

  return (
    <div className="flex gap-4 items-start">
      {COLUMNS.map((col) => {
        const colTodos = getTodosForColumn(col.key);
        return (
          <div key={col.key} className={`flex-1 min-w-0 rounded-lg ${col.bg} p-3`}>
            <div className={`flex items-center justify-between mb-3 px-2 py-1 rounded ${col.headerBg}`}>
              <h2 className="font-semibold text-gray-700 text-sm">{col.title}</h2>
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${col.countBg}`}>
                {colTodos.length}
              </span>
            </div>
            <div className="space-y-2">
              {colTodos.length === 0 ? (
                <p className="text-center text-gray-400 text-xs py-4">No items</p>
              ) : (
                colTodos.map((todo) => (
                  <TodoItem
                    key={todo.id}
                    id={todo.id}
                    text={todo.text}
                    status={todo.status}
                    priority={todo.priority}
                    dueDate={todo.dueDate}
                    tags={todo.tags}
                    onRemove={onRemove}
                    onUpdateTags={onUpdateTags}
                    onTagClick={onTagClick}
                    onMoveBack={
                      getPrevStatus(todo.status)
                        ? () => onMove(todo.id, getPrevStatus(todo.status))
                        : null
                    }
                    onMoveNext={
                      getNextStatus(todo.status)
                        ? () => onMove(todo.id, getNextStatus(todo.status))
                        : null
                    }
                  />
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
