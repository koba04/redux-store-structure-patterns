import { Action, AllTodos, RECEIVE_ALL_TODOS, Memo, UPDATE_MEMO } from "../app";
import { createStore, Store } from "redux";

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

const initialState: State = {
  users: []
};

const reducer = (state = initialState, action: Action): State => {
  switch (action.type) {
    case RECEIVE_ALL_TODOS: {
      return action.payload;
    }
    case UPDATE_MEMO: {
      return {
        ...state,
        users: state.users.map(user => ({
          ...user,
          todos: user.todos.map(todo => ({
            ...todo,
            memos: todo.memos.map(memo => {
              if (memo.id === action.payload.memo.id) {
                return {
                  ...memo,
                  body: action.payload.memo.body
                };
              } else {
                return memo;
              }
            })
          }))
        }))
      };
    }
    default:
      return state;
  }
};

const store: Store<State, Action> = createStore(reducer);

const getAllTodos = (): AllTodos => {
  return store.getState().users;
};

const getMemoById = (id: number): Memo | void => {
  for (let user of store.getState().users) {
    for (let todo of user.todos) {
      for (let memo of todo.memos) {
        if (memo.id === id) {
          return memo;
        }
      }
    }
  }
};

export { getAllTodos, getMemoById, store };
