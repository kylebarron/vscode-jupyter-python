import * as assert from "assert";
import { suite, test } from "mocha";

suite("Extension Tests", () => {
  // Defines a Mocha unit test
  test("Something 1", () => {
    assert.equal(-1, [1, 2, 3].indexOf(5));
    assert.equal(-1, [1, 2, 3].indexOf(0));
  });
});
