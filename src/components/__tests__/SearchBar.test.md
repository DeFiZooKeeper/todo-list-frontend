# SearchBar Component Tests

## Test Cases

### 1. Search filters todos by text
- Given: A list of todos with text "Learn React", "Buy groceries", "Call mom"
- When: User types "react" in the search bar
- Then: Only "Learn React" todo is shown
- Implementation: Uses case-insensitive `includes()` matching on todo.text

### 2. Clear button resets search
- Given: User has typed a search query
- When: User clicks the "Clear" button
- Then: searchQuery state is reset to empty string
- And: All todos are shown again
- Implementation: `onClick` handler calls `onSearchChange('')`

### 3. Case-insensitive matching
- Given: A todo with text "Learn REACT"
- When: User types "react" (lowercase)
- Then: The todo is matched and shown
- Implementation: Uses `.toLowerCase()` on both query and todo.text

### 4. No results state
- Given: User has searched but no todos match
- When: filteredTodos.length === 0 && hasSearch === true
- Then: Message "No todos match your search" is shown instead of "No todos yet"
- Implementation: TodoList checks hasSearch prop and totalTodos prop

### 5. Clear button only shows when searching
- Given: Search query is empty
- When: Component renders
- Then: The Clear button is not visible
- Implementation: Conditional render `{searchQuery && <button>Clear</button>}`

### 6. Search query indicator
- Given: User has typed a search query
- When: Component renders
- Then: Display shows 'Search: "[query]"' below the input
- Implementation: Conditional render with template literal

## Note
To run automated tests with React Testing Library or Vitest, install:
```bash
npm install -D vitest @testing-library/react @testing-library/user-event jsdom
```

Then add to package.json:
```json
"test": "vitest"
```

Example test structure:
```javascript
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SearchBar from '../SearchBar';

describe('SearchBar', () => {
  it('filters todos by text', () => {
    // Render SearchBar with mock state
    // Type in search input
    // Verify filtered results
  });
  
  it('clears search on clear button click', () => {
    // Render SearchBar with search query
    // Click clear button
    // Verify onSearchChange('') was called
  });
  
  // ... more tests
});
```
