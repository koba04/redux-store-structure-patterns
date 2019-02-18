import {
  Action,
  RECEIVE_ALL_TODOS,
  UPDATE_MEMO,
  AllTodos,
  Memo,
  Todo,
  User,
  ADD_TODO,
  createNextTodoId
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
  users: UserState[];
  todos: TodoState[];
  memos: MemoState[];
}

const initialState: State = {
  users: [],
  todos: [],
  memos: []
};

const reducer = (state = initialState, action: Action): State => {
  switch (action.type) {
    case RECEIVE_ALL_TODOS: {
      const users = action.payload.users;
      const todos = flatMap(users, user => user.todos);
      const memos = flatMap(todos, todo => todo.memos);
      return {
        users: users.map(user => {
          const { todos, ...rest } = user;
          return {
            ...rest,
            todoIds: todos.map(todo => todo.id)
          };
        }),
        todos: todos.map(todo => {
          const { memos, ...rest } = todo;
          return {
            ...rest,
            memoIds: memos.map(memo => memo.id)
          };
        }),
        memos
      };
    }
    case UPDATE_MEMO: {
      return {
        ...state,
        memos: state.memos.map(memo => {
          if (memo.id === action.payload.memo.id) {
            return {
              ...memo,
              body: action.payload.memo.body
            };
          }
          return memo;
        })
      };
    }
    case ADD_TODO: {
      const todoId = createNextTodoId();
      const user = state.users[action.payload.userId];
      return {
        ...state,
        users: state.users.map(user => {
          if (user.id === action.payload.userId) {
            return {
              ...user,
              todoIds: user.todoIds.concat(todoId)
            };
          }
          return user;
        }),
        todos: state.todos.concat({
          id: todoId,
          body: action.payload.todo,
          memoIds: []
        })
      };
    }
    default:
      return state;
  }
};

const store: Store<State, Action> = createStore(reducer);

const getAllTodos = (state: State): AllTodos => {
  const { users, todos, memos } = state;
  return users.map(user => getUser(state, user.id));
};

const getUser = (state: State, id: number): User => {
  const user = state.users.find(user => user.id === id)!;
  const { todoIds, ...userProps } = user;
  return {
    ...userProps,
    todos: todoIds.map(todoId => getTodo(state, todoId))
  };
};

const getTodo = (state: State, id: number): Todo => {
  const todo = state.todos.find(todo => todo.id === id)!;
  const { memoIds, ...todoProps } = todo;
  return {
    ...todoProps,
    memos: memoIds.map(memoId => getMemo(state, memoId))
  };
};

const getMemo = (state: State, id: number): Memo => {
  return state.memos.find(memo => memo.id === id)!;
};

const getMemoById = (state: State, id: number): Memo | void => {
  return state.memos.find(memo => memo.id === id);
};

const getTodosByUser = (state: State, id: number): Todo[] | void => {
  if (!state.users.some(user => user.id === id)) {
    return undefined;
  }
  return getUser(state, id).todos;
};

export { getAllTodos, getMemoById, getTodosByUser, store };
