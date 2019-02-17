import assert from "assert";

import {
  getExpectedAllTodosResult,
  getExpectedUpdateMemoResult,
  receiveAllTodos,
  updateMemo
} from "./app";
import * as nestedStructure from "./patterns/nested-structured-store";

const patterns = [nestedStructure];

patterns.forEach(({ getAllTodos, getMemoById, store }, i) => {
  describe(`${i + 1}: receiveAllTodos`, () => {
    it("should return all todos", () => {
      store.dispatch(receiveAllTodos());
      assert.deepStrictEqual(getExpectedAllTodosResult(), getAllTodos());
    });
  });
  describe(`${i + 1}: updateMemo`, () => {
    it("shold return the specific memo", () => {
      store.dispatch(updateMemo());
      assert.deepStrictEqual(getExpectedUpdateMemoResult(), getMemoById(4));
    });
  });
});
