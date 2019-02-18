import {
  Action,
  RECEIVE_ALL_TODOS,
  UPDATE_MEMO,
  ADD_TODO,
  AllTodos,
  Memo,
  Todo,
  User,
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
      const users = action.payload.users;
      const todos = flatMap(users, user => user.todos);
      const memos = flatMap(todos, todo => todo.memos);
      return {
        users: new Map(
          users.map(user => {
            const { todos, ...rest } = user;
            return [
              user.id,
              {
                ...rest,
                todoIds: todos.map(todo => todo.id)
              }
            ] as [number, UserState];
          })
        ),
        todos: new Map(
          todos.map(todo => {
            const { memos, ...rest } = todo;
            return [
              todo.id,
              {
                ...rest,
                memoIds: memos.map(memo => memo.id)
              }
            ] as [number, TodoState];
          })
        ),
        memos: new Map(
          memos.map(memo => [memo.id, memo] as [number, MemoState])
        )
      };
    }
    case UPDATE_MEMO: {
      const memo = state.memos.get(action.payload.memo.id);
      if (typeof memo === "undefined") {
        throw new Error("something went wrong");
      }
      return {
        ...state,
        memos: new Map(state.memos).set(memo.id, {
          ...memo,
          body: action.payload.memo.body
        })
      };
    }
    case ADD_TODO: {
      const todoId = createNextTodoId();
      const user = state.users.get(action.payload.userId)!;
      return {
        ...state,
        users: new Map(state.users).set(user.id, {
          ...user,
          todoIds: user.todoIds.concat(todoId)
        }),
        todos: new Map(state.todos).set(todoId, {
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
  return Array.from(state.users.keys()).map(userId => getUser(state, userId));
};

const getUser = (state: State, id: number): User => {
  const { todoIds, ...userProps } = state.users.get(id)!;
  return {
    ...userProps,
    todos: todoIds.map(todoId => getTodo(state, todoId))
  };
};

const getTodo = (state: State, id: number): Todo => {
  const { memoIds, ...todoProps } = state.todos.get(id)!;
  return {
    ...todoProps,
    memos: memoIds.map(memoId => getMemo(state, memoId))
  };
};

const getMemo = (state: State, id: number): Memo => {
  return state.memos.get(id)!;
};

const getMemoById = (state: State, id: number): Memo | void => {
  return state.memos.get(id);
};

const getTodosByUser = (state: State, id: number): Todo[] | void => {
  if (!state.users.has(id)) {
    return undefined;
  }
  return getUser(state, id).todos;
};

export { getAllTodos, getMemoById, getTodosByUser, store };
