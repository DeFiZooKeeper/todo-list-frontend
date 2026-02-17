/**
 * @vitest
 * @jest
 */
import { getUrgencyCategory, sortByUrgency } from '../../utils/urgencySort';

describe('urgencySort', () => {
  let today;

  beforeEach(() => {
    // Set a fixed today for testing: February 17, 2026
    today = new Date('2026-02-17');
    today.setHours(0, 0, 0, 0);
  });

  describe('getUrgencyCategory', () => {
    it('should return "none" for todos without a due date', () => {
      const todo = { id: 1, text: 'Task', done: false, dueDate: '' };
      expect(getUrgencyCategory(todo, today)).toBe('none');
    });

    it('should return "none" for completed todos', () => {
      const todo = { id: 1, text: 'Task', done: true, dueDate: '2026-02-17' };
      expect(getUrgencyCategory(todo, today)).toBe('none');
    });

    it('should return "overdue" for past due dates', () => {
      const todo = { id: 1, text: 'Task', done: false, dueDate: '2026-02-16' };
      expect(getUrgencyCategory(todo, today)).toBe('overdue');
    });

    it('should return "overdue" for dates far in the past', () => {
      const todo = { id: 1, text: 'Task', done: false, dueDate: '2026-01-01' };
      expect(getUrgencyCategory(todo, today)).toBe('overdue');
    });

    it('should return "today" for today\'s date', () => {
      const todo = { id: 1, text: 'Task', done: false, dueDate: '2026-02-17' };
      expect(getUrgencyCategory(todo, today)).toBe('today');
    });

    it('should return "thisWeek" for dates 1-6 days in the future', () => {
      // Tomorrow
      let todo = { id: 1, text: 'Task', done: false, dueDate: '2026-02-18' };
      expect(getUrgencyCategory(todo, today)).toBe('thisWeek');

      // 3 days from now
      todo = { id: 2, text: 'Task', done: false, dueDate: '2026-02-20' };
      expect(getUrgencyCategory(todo, today)).toBe('thisWeek');

      // 6 days from now (Wednesday of next week)
      todo = { id: 3, text: 'Task', done: false, dueDate: '2026-02-23' };
      expect(getUrgencyCategory(todo, today)).toBe('thisWeek');
    });

    it('should return "later" for dates 7 or more days in the future', () => {
      // 7 days from now
      let todo = { id: 1, text: 'Task', done: false, dueDate: '2026-02-24' };
      expect(getUrgencyCategory(todo, today)).toBe('later');

      // 30 days from now
      todo = { id: 2, text: 'Task', done: false, dueDate: '2026-03-19' };
      expect(getUrgencyCategory(todo, today)).toBe('later');

      // Next year
      todo = { id: 3, text: 'Task', done: false, dueDate: '2027-02-17' };
      expect(getUrgencyCategory(todo, today)).toBe('later');
    });

    it('should handle week boundary correctly (6 days boundary)', () => {
      // 6 days is still thisWeek
      let todo = { id: 1, text: 'Task', done: false, dueDate: '2026-02-23' };
      expect(getUrgencyCategory(todo, today)).toBe('thisWeek');

      // 7 days is later
      todo = { id: 2, text: 'Task', done: false, dueDate: '2026-02-24' };
      expect(getUrgencyCategory(todo, today)).toBe('later');
    });

    it('should handle timezone-agnostic date comparison', () => {
      // Create a todo with time information in the dueDate
      const todo = { id: 1, text: 'Task', done: false, dueDate: '2026-02-17T15:30:00Z' };
      expect(getUrgencyCategory(todo, today)).toBe('today');
    });
  });

  describe('sortByUrgency', () => {
    it('should sort todos by urgency order: overdue > today > thisWeek > later > none', () => {
      const todos = [
        { id: 1, text: 'Later', done: false, dueDate: '2026-03-01' },
        { id: 2, text: 'No date', done: false, dueDate: '' },
        { id: 3, text: 'Overdue', done: false, dueDate: '2026-02-10' },
        { id: 4, text: 'Today', done: false, dueDate: '2026-02-17' },
        { id: 5, text: 'This week', done: false, dueDate: '2026-02-20' },
      ];

      const sorted = sortByUrgency(todos, today);
      const order = sorted.map(t => t.text);

      expect(order[0]).toBe('Overdue');
      expect(order[1]).toBe('Today');
      expect(order[2]).toBe('This week');
      expect(order[3]).toBe('Later');
      expect(order[4]).toBe('No date');
    });

    it('should sort within same category by due date (earliest first)', () => {
      const todos = [
        { id: 1, text: 'Feb 23', done: false, dueDate: '2026-02-23' },
        { id: 2, text: 'Feb 18', done: false, dueDate: '2026-02-18' },
        { id: 3, text: 'Feb 20', done: false, dueDate: '2026-02-20' },
      ];

      const sorted = sortByUrgency(todos, today);
      const dates = sorted.map(t => t.dueDate);

      expect(dates).toEqual(['2026-02-18', '2026-02-20', '2026-02-23']);
    });

    it('should sort overdue items by date (earliest first)', () => {
      const todos = [
        { id: 1, text: 'Feb 15', done: false, dueDate: '2026-02-15' },
        { id: 2, text: 'Feb 10', done: false, dueDate: '2026-02-10' },
        { id: 3, text: 'Feb 16', done: false, dueDate: '2026-02-16' },
      ];

      const sorted = sortByUrgency(todos, today);
      const dates = sorted.map(t => t.dueDate);

      expect(dates).toEqual(['2026-02-10', '2026-02-15', '2026-02-16']);
    });

    it('should not mutate the original array', () => {
      const todos = [
        { id: 1, text: 'Task 1', done: false, dueDate: '2026-03-01' },
        { id: 2, text: 'Task 2', done: false, dueDate: '2026-02-17' },
      ];

      const original = JSON.stringify(todos);
      sortByUrgency(todos, today);

      expect(JSON.stringify(todos)).toBe(original);
    });

    it('should handle mixed completed and incomplete todos', () => {
      const todos = [
        { id: 1, text: 'Completed overdue', done: true, dueDate: '2026-02-10' },
        { id: 2, text: 'Overdue', done: false, dueDate: '2026-02-10' },
        { id: 3, text: 'Completed today', done: true, dueDate: '2026-02-17' },
        { id: 4, text: 'Today', done: false, dueDate: '2026-02-17' },
      ];

      const sorted = sortByUrgency(todos, today);
      const order = sorted.map(t => t.text);

      // Completed items should be pushed to the end (none category)
      expect(order[0]).toBe('Overdue');
      expect(order[1]).toBe('Today');
      expect(order).toContain('Completed overdue');
      expect(order).toContain('Completed today');
    });

    it('should handle empty array', () => {
      const todos = [];
      const sorted = sortByUrgency(todos, today);
      expect(sorted).toEqual([]);
    });

    it('should handle array with only items without due dates', () => {
      const todos = [
        { id: 1, text: 'Task 1', done: false, dueDate: '' },
        { id: 2, text: 'Task 2', done: false, dueDate: '' },
        { id: 3, text: 'Task 3', done: false, dueDate: '' },
      ];

      const sorted = sortByUrgency(todos, today);
      expect(sorted.length).toBe(3);
      expect(sorted.every(t => getUrgencyCategory(t, today) === 'none')).toBe(true);
    });
  });

  describe('edge cases', () => {
    it('should handle leap year dates correctly', () => {
      // Feb 29, 2024 is a valid leap year date
      const leapToday = new Date('2024-02-29');
      const todo = { id: 1, text: 'Leap day task', done: false, dueDate: '2024-02-29' };
      expect(getUrgencyCategory(todo, leapToday)).toBe('today');
    });

    it('should handle year boundaries', () => {
      const newYearsEve = new Date('2025-12-31');
      const newYearsDay = new Date('2026-01-01');

      const todo = { id: 1, text: 'New years task', done: false, dueDate: '2026-01-01' };
      expect(getUrgencyCategory(todo, newYearsEve)).toBe('thisWeek');
    });

    it('should handle month boundaries', () => {
      const endOfMonth = new Date('2026-02-28');
      const nextMonth = new Date('2026-03-01');

      const todo = { id: 1, text: 'Next month task', done: false, dueDate: '2026-03-01' };
      expect(getUrgencyCategory(todo, endOfMonth)).toBe('thisWeek');
    });
  });
});
