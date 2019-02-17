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
        id: 3,
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

export type Action = ReceiveAllTodosAction | UpdateMemoAction;

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

export const getExpectedAllTodosResult = (): User[] => {
  return mockApiResponse;
};

export const getExpectedUpdateMemoResult = (): Memo => {
  return {
    id: 4,
    body: "completed!!!"
  };
};
