# redux-store-structure-patterns

Patterns for Redux Store with a data structure that has nested relationships.
How do you structure your Redux Store with this?

```ts
interface User {
  id: number;
  name: string;
  todos: Todo[];
}

interface Todo {
  id: number;
  body: string;
  memos: Memo[];
}

interface Memo {
  id: number;
  body: string;
}
```

## Patterns

### Nested Structure

```ts
interface UserState {
  id: number;
  name: string;
  todos: TodoState[];
}

interface TodoState {
  id: number;
  body: string;
  memos: MemoState[];
}

interface MemoState {
  id: number;
  body: string;
}

interface State {
  users: UserState[];
}
```

- https://github.com/koba04/redux-store-structure-patterns/blob/master/patterns/nested-store.ts

### Separated List Structure

```ts
interface UserState {
  id: number;
  name: string;
  todoIds: number[];
}

interface TodoState {
  id: number;
  body: string;
  memoIds: number[];
}

interface MemoState {
  id: number;
  body: string;
}

interface State {
  users: UserState[];
  todos: TodoState[];
  memos: MemoState[];
}
```

- https://github.com/koba04/redux-store-structure-patterns/blob/master/patterns/separated-list-store.ts

### Normalized Structure

```ts
interface UserState {
  id: number;
  name: string;
  todoIds: number[];
}

interface TodoState {
  id: number;
  body: string;
  memoIds: number[];
}

interface MemoState {
  id: number;
  body: string;
}

interface State {
  userIds: number[];
  users: {
    [id: number]: UserState;
  };
  todos: {
    [id: number]: TodoState;
  };
  memos: {
    [id: number]: MemoState;
  };
}
```

- https://github.com/koba04/redux-store-structure-patterns/blob/master/patterns/normalized-store.ts

### Normalized Structure with ES2015 Map

```ts
interface UserState {
  id: number;
  name: string;
  todoIds: number[];
}

interface TodoState {
  id: number;
  body: string;
  memoIds: number[];
}

interface MemoState {
  id: number;
  body: string;
}

interface State {
  users: Map<number, UserState>;
  todos: Map<number, TodoState>;
  memos: Map<number, MemoState>;
}
```

- https://github.com/koba04/redux-store-structure-patterns/blob/master/patterns/using-map-store.ts

## Development

```
npm install
npm test
```
