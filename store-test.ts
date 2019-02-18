import assert from "assert";

import {
  getExpectedAllTodosResult,
  getExpectedUpdateMemoResult,
  getExpectedAllTodoResult,
  getExpectedAllTodosByUserResult,
  receiveAllTodos,
  updateMemo,
  addTodo
} from "./app";
import * as nestedStore from "./patterns/nested-store";
import * as separetedListStore from "./patterns/separated-list-store";
import * as normalizedStore from "./patterns/normalized-store";
import * as usingMapStore from "./patterns/using-map-store";

const patterns = [
  nestedStore,
  separetedListStore,
  normalizedStore,
  usingMapStore
];

patterns.forEach(({ getAllTodos, getMemoById, getTodosByUser, store }, i) => {
  beforeEach(() => {
    store.dispatch(receiveAllTodos());
  });
  describe(`${i + 1}: receiveAllTodos`, () => {
    it("should return all todos", () => {
      store.dispatch(receiveAllTodos());
      assert.deepStrictEqual(
        getExpectedAllTodosResult(),
        getAllTodos(store.getState() as any)
      );
    });
  });
  describe(`${i + 1}: updateMemo`, () => {
    it("shold return the specific memo", () => {
      store.dispatch(updateMemo());
      assert.deepStrictEqual(
        getExpectedUpdateMemoResult(),
        getMemoById(store.getState() as any, 4)
      );
    });
  });
  describe(`${i + 1}: addTodo`, () => {
    it("should return todos by user", () => {
      const userId = 2;
      assert.deepStrictEqual(
        getExpectedAllTodosByUserResult(userId),
        getTodosByUser(store.getState() as any, userId)
      );
      store.dispatch(addTodo());
      assert.deepStrictEqual(
        getExpectedAllTodoResult(userId),
        getTodosByUser(store.getState() as any, userId)
      );
    });
  });
});
