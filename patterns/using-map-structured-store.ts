import { Action, RECEIVE_ALL_TODOS, UPDATE_MEMO, AllTodos, Memo } from "../app";
import { Store, createStore } from "redux";

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

const initialState: State = {
  users: new Map(),
  todos: new Map(),
  memos: new Map()
};

const reducer = (state = initialState, action: Action): State => {
  switch (action.type) {
    case RECEIVE_ALL_TODOS: {
      const newState: State = {
        users: new Map(),
        todos: new Map(),
        memos: new Map()
      };
      action.payload.users.forEach(user => {
        const { todos, ...userProps } = user;
        newState.users.set(user.id, {
          ...userProps,
          todoIds: todos.map(todo => {
            const { memos, ...todoProps } = todo;
            newState.todos.set(todo.id, {
              ...todoProps,
              memoIds: memos.map(memo => {
                newState.memos.set(memo.id, memo);
                return memo.id;
              })
            });
            return todo.id;
          })
        });
      });
      return newState;
    }
    case UPDATE_MEMO: {
      const memo = state.memos.get(action.payload.memo.id);
      if (typeof memo === "undefined") {
        throw new Error("something went wrong");
      }
      return {
        ...state,
        memos: new Map(
          state.memos.set(memo.id, {
            ...memo,
            body: action.payload.memo.body
          })
        )
      };
    }
    default:
      return state;
  }
};

const store: Store<State, Action> = createStore(reducer);

const getAllTodos = (): AllTodos => {
  const { users, todos, memos } = store.getState();
  return Array.from(users.values()).map(user => {
    const { todoIds, ...userProps } = user;
    return {
      ...userProps,
      todos: todoIds.map(todoId => {
        const todo = todos.get(todoId)!;
        const { memoIds, ...todoProps } = todo;
        return {
          ...todoProps,
          memos: memoIds.map(memoId => memos.get(memoId)!)
        };
      })
    };
  });
};

const getMemoById = (id: number): Memo | void => {
  return store.getState().memos.get(id);
};

export { getAllTodos, getMemoById, store };
