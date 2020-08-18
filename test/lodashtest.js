const fc = require("fast-check");
const _ = require("lodash");
const util = require("util");
fc.configureGlobal({ numRuns: 1 }); //  Vi kan kun have en global configuration af numRuns variablen, og der ligger allerede en i test

const getRandomIntInclusive = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive
};

const getArrayDepth = (arr) => {
  return Array.isArray(arr) ? 1 + Math.max(...arr.map(getArrayDepth)) : 0;
  // return 1 + Math.max(arr.map(getArrayDepth))
};

describe("Array", () => {
  describe("chunk()", () => {
    it("should return arrays of expected size", () => {
      fc.assert(
        fc.property(
          fc
            .array(fc.anything(), 10, 100),
          (array) => {
            const chunkSize = getRandomIntInclusive(1, array.length);
            const chunkedArray = _.chunk(array, chunkSize);

            const chunkedArraySizes = chunkedArray.map((chunk) => chunk.length);

            for (let i = 0; i < chunkedArraySizes.length; i++) {
              return chunkedArraySizes[i] % chunkSize === 0;
            }
          }
        )
      );
    });
    
    

    it("should return chunked arrays", () => {
      fc.assert(
        fc.property(fc.array(fc.string(), 10, 100), (array) => {
          const chunkSize = getRandomIntInclusive(1, array.length);
          const chunkedArray = _.chunk(array, chunkSize);
          return chunkedArray.length === Math.ceil(array.length / chunkSize);
        })
      );
    });

    it("should return the last chunk as remaining elements", () => {
      fc.assert(
        fc.property(fc.array(fc.string(), 10, 100), (array) => {
          const chunkSize = getRandomIntInclusive(1, array.length);
          const chunkedArray = _.chunk(array, chunkSize);
          const remainingElements = array.length % chunkSize;

          if (remainingElements !== 0) {
            return (
              chunkedArray[chunkedArray.length - 1].length === remainingElements
            );
          } else {
            return chunkedArray[chunkedArray.length - 1].length === chunkSize;
          }
        }),
        { verbose: true }
      );
    });
  });

  describe("invokeMap()", () => {
    it("should invoke a method on each element of the collection", () => {
      fc.assert(
        fc.property(fc.array(fc.string(), 10, 100), (array) => {
          const modifiedArray = _.invokeMap(array, "toUpperCase");
          const upperCasedArray = array.map((string) => string.toUpperCase());
          return (
            JSON.stringify(modifiedArray) === JSON.stringify(upperCasedArray)
          );
        })
      );
    });
  });
});

describe("flattenDepth()", () => {
  it("should flatten an array by x amount of times, or until depth is 1", () => {
    fc.assert(
      fc.property(
        fc.array(fc.array(fc.anything(), 1, 10), 10, 100),
        fc.nat(10),
        (array, depth) => {
          const flattenedArray = _.flattenDepth(array, depth);
          const arrayDepth = getArrayDepth(array);
          const flattenedArrayDepth = getArrayDepth(flattenedArray);
          return (
            flattenedArrayDepth === arrayDepth - depth ||
            flattenedArrayDepth === 1
          );
        }
      )
    );
  }).timeout(0);
});

const objectSettings = {
  Settings: {
    maxDepth: 1,
  },
};

const keyGenerator = fc.oneof(
  fc.constant("test"),
  fc.constant("test1"),
  fc.constant("test2"),
  fc.constant("test3"),
  fc.constant("test4"),
  fc.constant("test5"),
  fc.constant("test6"),
  fc.constant("test7"),
  fc.constant("test8"),
  fc.constant("test9"),
  fc.constant("test10"),
  fc.constant("test11"),
  fc.constant("test12"),
  fc.constant("test13"),
  fc.constant("test14"),
  fc.constant("test15"),
  fc.constant("test16"),
  fc.constant("test17"),
  fc.constant("test18"),
  fc.constant("test19"),
  fc.constant("test20")
);

const orderByArbitraries = fc.record({
  date: fc.date(),
  string: fc.oneof(
    fc.string(),
    fc.hexa(),
    fc.char(),
    fc.ascii(),
    fc.unicode(),
    fc.char16bits(),
    fc.fullUnicode()
  ),
  number: fc.oneof(fc.integer(), fc.float(), fc.double()),
  falsy: fc.falsy(),
});



const typeArray = ["date", "string", "number", "falsy"];

describe("test", () => {
  it("should return only strings", () => {
    fc.assert(
      fc.property(fc.string(), (strings) => {
        // console.log('strings: ', strings)
      })
    );
  });
});

const alphabetArr = [
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
  "L",
  "M",
  "N",
  "O",
  "P",
  "Q",
  "R",
  "S",
  "T",
  "U",
  "W",
  "X",
  "Y",
  "Z",
];

const orderByGen = fc.oneof(
  fc.array(
    fc.record({
      date: fc.date(),
      string: fc.oneof(
        fc.string(),
        fc.hexa(),
        fc.char(),
        fc.ascii(),
        fc.unicode(),
        fc.char16bits(),
        fc.fullUnicode(),
        fc.constantFrom(...alphabetArr)
      ),
      number: fc.oneof(fc.integer(), fc.float(), fc.double(), fc.nat(30)),
      falsy: fc.falsy(),
      nested: fc.record({ id: fc.nat(100) }),
    }),
    200,
    300
  )
);

Array.prototype.onlyHasType = function (type) {
  if (typeof type !== "string")
    throw new Error(`parameter must be of type 'string'`);
  return this.every((entry) => typeof entry === type);
};




const testArr = [
  {
    number: 1,
    child: {
      number: 2,
      letter: "b",
    },
  },
  {
    number: 3,
    child: {
      number: -1,
      letter: "a",
    },
  },
  {
    number: 3,
    child: {
      number: 10,
      letter: "b",
    },
  },
];
const props = ["number", "child.letter", "child.number"];
const orders = ["asc", "desc"];

const newProps = ["number", "child.letter"]
const newOrders = ["asc", "desc"]
const newTestArray = _.orderBy(testArr, newProps, newOrders)
console.log("testArr", testArr);
console.log("is sorted by: ", newTestArray.isSortedBy(newProps, newOrders));
// const encryptionAlgorithm = fc.oneof(
//   fc.array(fc.string(), fc.integer()),
//   fc.array(fc.)
// )
//  don't think orderBy can access nested arrays
//  will have to use arrays of objects with nested values to test
//  fc.property(fc.record({ number: oneof(...)})) etc.

describe("orderBy()", () => {
  it("should do something", () => {
    fc.assert(
      fc.property(orderByGen, (generated) => {
        // console.log('generated: ', JSON.stringify(generated))

        const ordered = _.orderBy(
          generated,
          [["number"], ["nested.id"]],
          ["asc", "desc"]
        );
  
      }),
      { numRuns: 10 }
    );
  });
});

const arrayForConcat = fc.array(
  fc.frequency(
    { weight: 10, arbitrary: fc.array(fc.anything()) },
    { weight: 11, arbitrary: fc.anything() }
  )
);

describe("Checking concat", () => {
  it("Starting with a large nested array and concatinating the contents, comparing with the original", () => {
    fc.assert(
      fc.property(arrayForConcat, (resultArray) => {
        var concated = [];
        var curIndex;
        for (curIndex of resultArray) {
          curIndex = [curIndex];
          concated = _.concat(concated, curIndex);
        }
        return JSON.stringify(concated) === JSON.stringify(resultArray);
      }),
      { verbose: true }
    );
  });
});
