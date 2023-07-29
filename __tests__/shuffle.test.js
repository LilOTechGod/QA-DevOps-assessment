const shuffle = require("../src/shuffle");

describe("shuffle should...", () => {
  // CODE HERE

    test("shuffle should return true if it is an array", () => {
      const arr = [2, 3, 3, 4, 4];
      expect(shuffle(arr) instanceof Array).toBe(true);
    });

    test("check that it returns an array of the same length as the argument sent in", () => {
      const arr = ["second", "to", "last", "assessment"];
  
      expect(shuffle(arr).length).toBe(arr.length);
    });
  })
