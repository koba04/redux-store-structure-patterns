export interface User {
  id: number;
  name: string;
  todos: Todo[];
}

export interface Todo {
  id: number;
  body: string;
  memos: Memo[];
}

export interface Memo {
  id: number;
  body: string;
}

export type AllTodos = User[];

const mockApiResponse: User[] = [
  {
    id: 1,
    name: "Paul",
    todos: [
      {
        id: 1,
        body: "Write a blog",
        memos: [
          {
            id: 1,
            body: "start"
          },
          {
            id: 2,
            body: "pending"
          }
        ]
      }
    ]
  },
  {
    id: 2,
    name: "John",
    todos: [
      {
        id: 2,
        body: "Write a song",
        memos: [
          {
            id: 3,
            body: "start"
          },
          {
            id: 4,
            body: "completed"
          }
        ]
      }
    ]
  }
];

export const RECEIVE_ALL_TODOS = "RECEIVED_ALL_TODOS";
export const UPDATE_MEMO = "UPDATE_MEMO";
export const ADD_TODO = "ADD_TODO";

interface ReceiveAllTodosAction {
  type: "RECEIVED_ALL_TODOS";
  payload: {
    users: User[];
  };
}

interface UpdateMemoAction {
  type: "UPDATE_MEMO";
  payload: {
    memo: Memo;
  };
}

interface AddTodoAction {
  type: "ADD_TODO";
  payload: {
    userId: number;
    todo: string;
  };
}

export type Action = ReceiveAllTodosAction | UpdateMemoAction | AddTodoAction;

export const receiveAllTodos = (): ReceiveAllTodosAction => ({
  type: RECEIVE_ALL_TODOS,
  payload: {
    users: mockApiResponse
  }
});

export const updateMemo = (): UpdateMemoAction => ({
  type: UPDATE_MEMO,
  payload: {
    memo: {
      id: 4,
      body: "completed!!!"
    }
  }
});

export const addTodo = (): AddTodoAction => ({
  type: "ADD_TODO",
  payload: {
    userId: 2,
    todo: "Send a PR"
  }
});

export const createNextTodoId = () => 3;

export const getExpectedAllTodosResult = (): User[] => {
  return mockApiResponse;
};

export const getExpectedAllTodosByUserResult = (id: number): Todo[] => {
  return mockApiResponse[id - 1].todos;
};

export const getExpectedUpdateMemoResult = (): Memo => {
  return {
    id: 4,
    body: "completed!!!"
  };
};

export const getExpectedAllTodoResult = (id: number): Todo[] => {
  return mockApiResponse[id - 1].todos.concat({
    id: 3,
    body: "Send a PR",
    memos: []
  });
};
