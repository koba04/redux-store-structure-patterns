import {
  Action,
  RECEIVE_ALL_TODOS,
  UPDATE_MEMO,
  AllTodos,
  Memo,
  Todo,
  User,
  createNextTodoId,
  ADD_TODO
} from "../app";
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
    case ADD_TODO: {
      const todoId = createNextTodoId();
      const user = state.users[action.payload.userId];
      return {
        ...state,
        users: {
          ...state.users,
          [user.id]: {
            ...user,
            todoIds: user.todoIds.concat(todoId)
          }
        },
        todos: {
          ...state.todos,
          [todoId]: {
            id: todoId,
            body: action.payload.todo,
            memoIds: []
          }
        }
      };
    }
    default:
      return state;
  }
};

const store: Store<State, Action> = createStore(reducer);

const getAllTodos = (state: State): AllTodos => {
  return state.userIds.map(userId => getUser(state, userId));
};

const getUser = (state: State, id: number): User => {
  const { todoIds, ...userProps } = state.users[id];
  return {
    ...userProps,
    todos: todoIds.map(todoId => getTodo(state, todoId))
  };
};

const getTodo = (state: State, id: number): Todo => {
  const { memoIds, ...todoProps } = state.todos[id];
  return {
    ...todoProps,
    memos: memoIds.map(memoId => getMemo(state, memoId))
  };
};

const getMemo = (state: State, id: number): Memo => {
  return state.memos[id];
};

const getMemoById = (state: State, id: number): Memo | void => {
  return state.memos[id];
};

const getTodosByUser = (state: State, id: number): Todo[] | void => {
  if (!state.users[id]) {
    return undefined;
  }
  return getUser(state, id).todos;
};

export { getAllTodos, getMemoById, getTodosByUser, store };
