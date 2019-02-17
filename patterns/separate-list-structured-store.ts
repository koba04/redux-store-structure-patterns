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
      const newState: State = {
        users: [],
        todos: [],
        memos: []
      };
      action.payload.users.forEach(user => {
        const { todos, ...userProps } = user;
        newState.users.push({
          ...userProps,
          todoIds: todos.map(todo => {
            const { memos, ...todoProps } = todo;
            newState.todos.push({
              ...todoProps,
              memoIds: memos.map(memo => {
                newState.memos.push(memo);
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
    default:
      return state;
  }
};

const store: Store<State, Action> = createStore(reducer);

const getAllTodos = (): AllTodos => {
  const { users, todos, memos } = store.getState();
  return users.map(user => {
    const { todoIds, ...userProps } = user;
    return {
      ...userProps,
      todos: todoIds.map(todoId => {
        const todo = todos.find(todo => todo.id === todoId)!;
        const { memoIds, ...todoProps } = todo;
        return {
          ...todoProps,
          memos: memoIds.map(memoId => memos.find(memo => memo.id === memoId)!)
        };
      })
    };
  });
};

const getMemoById = (id: number): Memo | void => {
  return store.getState().memos.find(memo => memo.id === id);
};

export { getAllTodos, getMemoById, store };
