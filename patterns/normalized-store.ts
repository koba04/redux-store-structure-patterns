import { Action, RECEIVE_ALL_TODOS, UPDATE_MEMO, AllTodos, Memo } from "../app";
import { Store, createStore } from "redux";
import flatMap from "array.prototype.flatmap";

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

const initialState: State = {
  userIds: [],
  users: {},
  todos: {},
  memos: {}
};

const reducer = (state = initialState, action: Action): State => {
  switch (action.type) {
    case RECEIVE_ALL_TODOS: {
      const users = action.payload.users;
      const todos = flatMap(users, user => user.todos);
      const memos = flatMap(todos, todo => todo.memos);
      return {
        userIds: users.map(user => user.id),
        users: users.reduce((acc, user) => {
          const { todos, ...rest } = user;
          return {
            ...acc,
            [user.id]: {
              ...rest,
              todoIds: todos.map(todo => todo.id)
            }
          };
        }, {}),
        todos: todos.reduce((acc, todo) => {
          const { memos, ...rest } = todo;
          return {
            ...acc,
            [todo.id]: {
              ...rest,
              memoIds: memos.map(memo => memo.id)
            }
          };
        }, {}),
        memos: memos.reduce((acc, memo) => {
          return {
            ...acc,
            [memo.id]: memo
          };
        }, {})
      };
    }
    case UPDATE_MEMO: {
      const { memo } = action.payload;
      return {
        ...state,
        memos: {
          ...state.memos,
          [memo.id]: {
            ...state.memos[memo.id],
            body: memo.body
          }
        }
      };
    }
    default:
      return state;
  }
};

const store: Store<State, Action> = createStore(reducer);

const getAllTodos = (): AllTodos => {
  const { userIds, users, todos, memos } = store.getState();
  return userIds.map(userId => {
    const { todoIds, ...userProps } = users[userId];
    return {
      ...userProps,
      todos: todoIds.map(todoId => {
        const { memoIds, ...todoProps } = todos[todoId];
        return {
          ...todoProps,
          memos: memoIds.map(memoId => memos[memoId])
        };
      })
    };
  });
};

const getMemoById = (id: number): Memo | void => {
  return store.getState().memos[id];
};

export { getAllTodos, getMemoById, store };
