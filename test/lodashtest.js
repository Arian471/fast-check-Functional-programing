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

Array.prototype.equals = function (array) {
  // if the other array is a falsy value, return
  if (!array)
      return false;

  // compare lengths - can save a lot of time 
  if (this.length != array.length)
      return false;

  for (var i = 0, l=this.length; i < l; i++) {
      // Check if we have nested arrays
      if (this[i] instanceof Array && array[i] instanceof Array) {
          // recurse into the nested arrays
          if (!this[i].equals(array[i]))
              return false;       
      }           
      else if (this[i] != array[i]) { 
          // Warning - two different object instances will never be equal: {x:20} != {x:20}
          return false;   
      }           
  }       
  return true;
}


describe("Array", () => {
  describe("chunk()", () => {
    it("should return arrays of expected size", () => {
      fc.assert(
        fc.property(
          fc
            .array(fc.string(), 10, 100)
            .chain((array) => fc.integer(array.length)),
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

    it("should not alter any elements of the array", () => {
      fc.assert(
        fc.property(
          fc.array(fc.anything(), 1, 15), (array) => {
            const chunkSize = getRandomIntInclusive(1, array.length);
            const chunkedArray = _.chunk(array, chunkSize);
            console.log('array: ', array)
            console.log('flattened: ', _.flattenDeep(chunkedArray))
            console.log('arrays equal:', array.equals(_.flattenDeep(chunkedArray)))

            return _.flattenDeep(chunkedArray) === array
          }
        )
      )
    })

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

//  const x = [
//   fc.object({key: fc.constant('date'), values: [fc.date()]}),
//   fc.object({key: fc.constant('string'), values: [fc.string(), fc.hexa(), fc.char(), fc.ascii(), fc.unicode(), fc.char16bits(), fc.fullUnicode()]}),
//   fc.object({key: fc.constant('number'), values: [fc.integer(), fc.float(), fc.double(), fc.bigInt()]}),
//   fc.object({key: fc.constant('falsy'), values: [fc.falsy()]}),
//   fc.object({key: fc.constant('object'), values: [fc.object()]})
// ]
// const orderByGenerator = fc.record(
//   fc.object({key: fc.constant('date'), values: [fc.date()]}),
//   fc.object({key: fc.constant('string'), values: [fc.string(), fc.hexa(), fc.char(), fc.ascii(), fc.unicode(), fc.char16bits(), fc.fullUnicode()]}),
//   fc.object({key: fc.constant('number'), values: [fc.integer(), fc.float(), fc.double()]}),
//   fc.object({key: fc.constant('falsy'), values: [fc.falsy()]}),
//   fc.object({key: fc.constant('object'), values: [fc.object()]})
// )

// const { tree } = fc.letrec(tie => ({
//   tree: fc.oneof(tie('node'), tie('leaf'), tie('leaf')),
//   node: fc.tuple(tie('tree'), tie('tree')),
//   leaf: fc.nat()
// }))
// console.log('tree', tree())

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

const treeDepth = 5;
const tree = fc.memo((n) => node(n));
const node = fc.memo((n) => {
  console.log("n = ", n);

  if (n === treeDepth) {
    return fc.array(
      fc.record({
        child: tree(),
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
      })
    );
  } else if (n > 1) {
    return fc.record({
      child: tree(),
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
  } else {
    return fc.record({
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
  }

  if (n <= treeDepth) {
    return;
  }
  return fc.record({
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
    child: tree(),
  });

  return fc.object({
    key: keyGenerator,
    values: [
      fc.record({
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
      }),
    ],
  }); //fc.object({key: keyGenerator, values: [orderByArbitraries], withBoxedValues: false})
  //fc.object({key: keyGenerator, values: [tree(), orderByArbitraries]}) //fc.nat(2,2) //fc.object({key: keyGenerator, values: [tree()]})//fc.object({key: keyGenerator, value: tree()}); // tree() is equivalent to tree(n-1)
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
Array.prototype.isSortedBy = function (properties, orders) {
  if (!Array.isArray(properties) || !Array.isArray(orders))
    throw new Error("parameters must be of type array");
  if (!_.every(properties, _.isString || !_.every(orders, _.isString)))
    throw new Error("arrays must only contain strings");
  const separatedProps = properties.map((propstring) => propstring.split("."));
  // console.log('length: ', this.length)
  // console.log('separatedProps: ', separatedProps)
  const outerArray = [];
  console.log("this", this);
  const compareObject = {
    values: [],
    orders: orders,
  };

  this.forEach((e) => {
    //  for every object entry in the array
    //  the property in question should be checked
    //  if it is ordered correctly comparatively
    const element = e;
    console.log("e", e);
    const innerArr = []; //  array which will contain arrays of the values that should be sorted
    let values = []; //  array of the values which will be added to innerArr

    for (let i = 0; i < separatedProps.length; i++) {
      compareObject.orders[i] = compareObject.orders[i] === undefined ? 'asc' : compareObject.orders[i]
      const property = separatedProps[i]; //  property which shall be sorted, can be array of length > 1 if it is a nested property
      // orders.push(order);
      if (property.length > 1) {
        //  loop through the properties of the array to access the nested value
        let tempElement = element;
        for (let j = 0; j < property.length; j++) {
          tempElement = tempElement[property[j]];
        }
        values.push(tempElement);
      } else {
        values.push(element[separatedProps[0]]);
      }
      compareObject.values.push(values);
      outerArray.push(values);
    }

    console.log("outerArr", compareObject);
    
    return true;
  });

  for(let i = 0; i < compareObject.orders.length; i++) {
    const orders = compareObject.orders[i]
    const value = compareObject.values[i]
    console.log('value: ', value)
    console.log('order: ', orders)
    console.log('i + 1  = ', i+1)
    const nextValue = i+1 < compareObject.values.length ? compareObject.values[i+1] : null

    for(let k = 0; k < orders.length; k++) {
      if(nextValue !== null){
        
      }
    }
    console.log('values.length = ', compareObject.values.length)
    if(i+1 < compareObject.values.length) {
      console.log('asd', compareObject.values[i+1])
    }

    // console.log('order', order)
    // console.log('order === asc', order === 'asc')
    // console.log('order === desc', order === 'desc')


    // if(nextValue !== null){
    //   if(order === 'asc'){
    //     if(value < nextValue){
    //     } else {
    //       return false
    //     }
    //   } else if (order === 'desc') {
    //     if(value > nextValue){
    //       console.log(`${value} is less than ${nextValue}`)
    //       console.log(`true`)
    //     } else {
    //       console.log('desc else')
    //       return false
    //     }
    //     console.log('order is desc')
        
    //   }
    // }
    return true
  }
  
  compareObject.orders.forEach((order, i) => {
    console.log("order: ", order);
  });
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
        // console.log('ordered: ', ordered)
        // // const x = generated.map( key => key)
        //  console.log('generated', JSON.stringify(generated))
        //  const newA = _.orderBy(generated, [['number', 'child.number', 'child.child.number', 'child.child.child.number']], 'asc')
        //  console.log('new: ', JSON.stringify(newA))
        // // if(Array.isArray(generated)){

        // //   console.log('mapped', generated.map( key => key))
        // // }

        // console.log('test')

        // const testArrayNew = [
        //   {
        //     number: 0,
        //     children: [
        //       {
        //         number: 0,
        //         children: [
        //           {
        //             number: 0
        //           },
        //           {
        //             number: 1
        //           },
        //           {
        //             number: -2
        //           }
        //         ]
        //       },
        //       {
        //         number: 1,
        //         children: [
        //           {
        //             number: 0
        //           },
        //           {
        //             number: 1
        //           },
        //           {
        //             number: -2
        //           }
        //         ]
        //       },
        //       {
        //         number: -2,
        //         children: [
        //           {
        //             number: 0
        //           },
        //           {
        //             number: 1
        //           },
        //           {
        //             number: -2
        //           }
        //         ]
        //       },
        //     ]
        //   },
        //   {
        //     number: 1,
        //     children: [
        //       {
        //         number: 0,
        //         children: [
        //           {
        //             number: 0
        //           },
        //           {
        //             number: 1
        //           },
        //           {
        //             number: -2
        //           }
        //         ]
        //       },
        //       {
        //         number: 1,
        //         children: [
        //           {
        //             number: 0
        //           },
        //           {
        //             number: 1
        //           },
        //           {
        //             number: -2
        //           }
        //         ]
        //       },
        //       {
        //         number: -2,
        //         children: [
        //           {
        //             number: 0
        //           },
        //           {
        //             number: 1
        //           },
        //           {
        //             number: -2
        //           }
        //         ]
        //       },
        //     ]
        //   },
        //   {
        //     number: -2,
        //     children: [
        //       {
        //         number: 0,
        //         children: [
        //           {
        //             number: 0
        //           },
        //           {
        //             number: 1
        //           },
        //           {
        //             number: -2
        //           }
        //         ]
        //       },
        //       {
        //         number: 1,
        //         children: [
        //           {
        //             number: 0
        //           },
        //           {
        //             number: 1
        //           },
        //           {
        //             number: -2
        //           }
        //         ]
        //       },
        //       {
        //         number: -2,
        //         children: [
        //           {
        //             number: 0
        //           },
        //           {
        //             number: 1
        //           },
        //           {
        //             number: -2
        //           }
        //         ]
        //       },
        //     ]
        //   }
        // ]
        // const testArray = [
        //   {
        //     child: {
        //       child: {
        //         date: "+215206-02-11T09:26:05.056Z",
        //         string: "",
        //         number: 0,
        //         falsy: null
        //       },
        //       date: "+215206-02-11T09:26:05.056Z",
        //       string: "",
        //       number: -2,
        //       falsy: null
        //     },
        //     date: "+215206-02-11T09:26:05.056Z",
        //     string: "",
        //     number: 4,
        //     falsy: null
        //   },
        //   {
        //     child: {
        //       child: {
        //         date: "+215206-02-11T09:26:05.056Z",
        //         string: "",
        //         number: 50000,
        //         falsy: null
        //       },
        //       date: "+215206-02-11T09:26:05.056Z",
        //       string: "",
        //       number: -194023,
        //       falsy: null
        //     },
        //     date: "+215206-02-11T09:26:05.056Z",
        //     string: "",
        //     number: -1543385446,
        //     falsy: null
        //   },
        //   {
        //     child: {
        //       child: {
        //         date: "+215206-02-11T09:26:05.056Z",
        //         string: "",
        //         number: 10000000,
        //         falsy: null
        //       },
        //       date: "+215206-02-11T09:26:05.056Z",
        //       string: "",
        //       number: 5,
        //       falsy: null
        //     },
        //     date: "+215206-02-11T09:26:05.056Z",
        //     string: "",
        //     number: 10,
        //     falsy: null
        //   }
        // ]

        // // const newB = _.orderBy(testArrayNew, [['number'], ['children.number'], ['children.children.number']], ['asc', 'desc', 'asc'])

        // // const newC = _.orderBy(testArrayNew, (array) => {
        // //   console.log('array: ', array)
        // //   array.map(entry => {
        // //     if('children' in entry){
        // //       const orderedChildren =_.orderBy(entry.children, 'number', 'asc')
        // //       console.log('orderedChildren:', orderedChildren)
        // //     }
        // //     return entry.number
        // //   })
        // // }, 'asc')
        // const testData = _.map(testArrayNew, obj => {
        //   console.log('object: ', JSON.stringify(obj))
        //   if('children' in obj) {
        //     console.log('has children')
        //     return _.orderBy(obj.children, 'number', 'asc')
        //   } else {
        //     return null
        //   }
        // })

        // console.log('testData: ', testData)
        // console.log('manual test:', JSON.stringify(newC))

        // // let ordered
        // // if(Array.isArray(generated)){
        // //   ordered = _.orderBy(generated.map( key => key))
        // //   console.log('ordered: ', ordered)
        // // }
        // // const ordered = _.orderBy(generated, 'asc')

        // //console.log('ordered: ', ordered)
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
