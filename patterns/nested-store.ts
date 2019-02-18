import {
  Action,
  AllTodos,
  RECEIVE_ALL_TODOS,
  Memo,
  UPDATE_MEMO,
  Todo,
  ADD_TODO,
  createNextTodoId
} from "../app";
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
    case ADD_TODO: {
      return {
        ...state,
        users: state.users.map(user => {
          if (user.id !== action.payload.userId) {
            return user;
          }
          return {
            ...user,
            todos: user.todos.concat({
              id: createNextTodoId(),
              body: action.payload.todo,
              memos: []
            })
          };
        })
      };
    }
    default:
      return state;
  }
};

const store: Store<State, Action> = createStore(reducer);

const getAllTodos = (state: State): AllTodos => {
  return state.users;
};

const getMemoById = (state: State, id: number): Memo | void => {
  for (let user of state.users) {
    for (let todo of user.todos) {
      for (let memo of todo.memos) {
        if (memo.id === id) {
          return memo;
        }
      }
    }
  }
};

const getTodosByUser = (state: State, id: number): Todo[] | void => {
  const user = state.users.find(user => user.id === id);
  return user ? user.todos : undefined;
};

export { getAllTodos, getMemoById, getTodosByUser, store };
