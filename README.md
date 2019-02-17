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

## How to Use

```
npm install
npm test
```
