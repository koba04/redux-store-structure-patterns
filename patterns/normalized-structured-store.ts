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
      const newState: State = {
        userIds: action.payload.users.map(user => user.id),
        users: {},
        todos: {},
        memos: {}
      };
      action.payload.users.forEach(user => {
        const { todos, ...userProps } = user;
        newState.users[user.id] = {
          ...userProps,
          todoIds: todos.map(todo => {
            const { memos, ...todoProps } = todo;
            newState.todos[todo.id] = {
              ...todoProps,
              memoIds: memos.map(memo => {
                newState.memos[memo.id] = memo;
                return memo.id;
              })
            };
            return todo.id;
          })
        };
      });
      return newState;
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
        const todo = todos[todoId];
        const { memoIds, ...todoProps } = todo;
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
