/**
 * Calculate the next due date based on frequency
 * @param {Date|string} currentDate - The current date (usually today or the completed date)
 * @param {string} frequency - 'Daily', 'Weekly', 'Monthly', or 'Yearly'
 * @returns {string} ISO date string for the next due date
 */
export function calculateNextDueDate(currentDate, frequency) {
  const date = new Date(currentDate);
  
  switch (frequency) {
    case 'Daily':
      date.setDate(date.getDate() + 1);
      break;
    case 'Weekly':
      date.setDate(date.getDate() + 7);
      break;
    case 'Monthly': {
      // Handle month boundary (e.g., Jan 31 + 1 month = Feb 28/29)
      const originalDay = date.getDate();
      date.setMonth(date.getMonth() + 1);
      // If day overflowed, set to last day of month
      if (date.getDate() !== originalDay) {
        date.setDate(0); // Last day of previous month
      }
      break;
    }
    case 'Yearly':
      date.setFullYear(date.getFullYear() + 1);
      break;
    default:
      throw new Error(`Unknown frequency: ${frequency}`);
  }
  
  return date.toISOString().split('T')[0]; // Return YYYY-MM-DD format
}

/**
 * Debounce function to prevent rapid successive calls
 * @param {Function} func - Function to debounce
 * @param {number} delay - Delay in milliseconds
 * @returns {Function} Debounced function
 */
export function debounce(func, delay) {
  let timeoutId = null;

  return function debounced(...args) {
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
    }
    
    timeoutId = setTimeout(() => {
      func.apply(this, args);
      timeoutId = null;
    }, delay);
  };
}
