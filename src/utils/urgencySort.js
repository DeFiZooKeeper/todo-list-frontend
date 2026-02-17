/**
 * Determines the urgency category for a todo item
 * @param {Object} todo - The todo item
 * @param {string} todo.dueDate - Due date in YYYY-MM-DD format
 * @param {boolean} todo.done - Whether the todo is completed
 * @param {Date} today - Today's date (for testing)
 * @returns {string} One of: 'overdue', 'today', 'thisWeek', 'later', 'none'
 */
export function getUrgencyCategory(todo, today = new Date()) {
  // If no due date, it has no urgency
  if (!todo.dueDate) {
    return 'none';
  }

  // Completed todos don't have urgency
  if (todo.done) {
    return 'none';
  }

  // Normalize dates to midnight UTC for fair comparison
  const todayNormalized = new Date(today);
  todayNormalized.setHours(0, 0, 0, 0);

  const dueDate = new Date(todo.dueDate);
  dueDate.setHours(0, 0, 0, 0);

  // Calculate day difference
  const timeDiff = dueDate - todayNormalized;
  const dayDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

  if (dayDiff < 0) {
    return 'overdue';
  }

  if (dayDiff === 0) {
    return 'today';
  }

  // This week: 1-6 days from today
  if (dayDiff > 0 && dayDiff <= 6) {
    return 'thisWeek';
  }

  // Everything else is later
  return 'later';
}

/**
 * Sorts todos by urgency, with overdue items first, followed by today,
 * this week, later, and finally items with no due date.
 * @param {Array} todos - Array of todo items
 * @param {Date} today - Today's date (for testing)
 * @returns {Array} Sorted array of todos
 */
export function sortByUrgency(todos, today = new Date()) {
  const urgencyOrder = {
    overdue: 0,
    today: 1,
    thisWeek: 2,
    later: 3,
    none: 4,
  };

  return [...todos].sort((a, b) => {
    const categoryA = getUrgencyCategory(a, today);
    const categoryB = getUrgencyCategory(b, today);

    const orderA = urgencyOrder[categoryA];
    const orderB = urgencyOrder[categoryB];

    // If categories are different, sort by category
    if (orderA !== orderB) {
      return orderA - orderB;
    }

    // If same category, sort by due date (closest first for time-based categories)
    if (a.dueDate && b.dueDate) {
      return new Date(a.dueDate) - new Date(b.dueDate);
    }

    // Items without due date stay in original order
    return 0;
  });
}
