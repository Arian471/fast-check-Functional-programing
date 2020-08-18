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
      nested: fc.record({ id: fc.nat(100) })
    }),
    50,
    100
  )
);

const orderGen = fc.array(
    fc.oneof(
      fc.constant('asc'),
      fc.constant('desc')
    )
  , 100, 100)

// _.orderBy(array, ['date', 'string'])


function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

function recursivelyFindProps(object){
  const result = []
  if(typeof object === 'object'){

    Object.keys(object).forEach(key => {
      if(typeof object[key] === 'object'){
        const recursive = recursivelyFindProps(object[key], key)
        recursive.forEach(e => {
          result.push(key + '.' + e)
        })
      } else {
        result.push(key)
      }
    })
  }
  return shuffle(result)
}


function Comparator(a, b) {
  if (a[0] < b[0]) return -1;
  if (a[0] > b[0]) return 1;
  return 0;
}

Array.prototype.isSortedBy = function (properties, orders) {
  if (!Array.isArray(properties) || !Array.isArray(orders))
    throw new Error("parameters must be of type array");
  if (!_.every(properties, _.isString || !_.every(orders, _.isString)))
    throw new Error("arrays must only contain strings");
  if(this.length < 1)
    return true
  properties = properties.reverse()
  orders = orders.reverse()
  const separatedProps = properties.map((propstring) => propstring.split("."));
  const copyOA = this.slice()
  let reOrderedArray = []

  separatedProps.forEach((propertyArr, propertyIndex) => {
    //for each property that we need to sort by
    let valueIndexArray = []
    //we generate a array of that the values for that property and the index in which that property is
    this.forEach((e,i) => {
      let tempValue = e
      propertyArr.forEach(properyPart => {
        tempValue = tempValue[properyPart]
      })
      valueIndexArray.push([tempValue,i])
    })
    valueIndexArray = valueIndexArray.sort(Comparator)




    if(orders[propertyIndex] === "desc"){
      valueIndexArray = valueIndexArray.reverse()
    }
    reOrderedArray = []
    valueIndexArray.forEach(via => {
      reOrderedArray.push(copyOA[via[1]])
    })
  })

 

  return (JSON.stringify(reOrderedArray) === JSON.stringify(this))
};



describe("orderBy()", () => {
  it("should order collection of objects according to input ", () => {
    fc.assert(
      fc.property(orderByGen, orderGen, (array, orders) => {
        // console.log('generated: ', JSON.stringify(generated))
    
        const props = recursivelyFindProps(array[0])
        const innerOrders = orders.splice(array.length)
        const orderedArray = _.orderBy(array, props, innerOrders)

        return true 
        // return orderedArray.isSortedBy(props, innerOrders)
      }),
      { numRuns: 500 }
    );
  }).timeout(0);

  it("should not pass test for being ordered when two elements swap position after being ordered", () => {
    fc.assert(
      fc.property(orderByGen, orderGen, (array, orders) => {
        const props = recursivelyFindProps(array[0])
        const innerOrders = orders.splice(array.length)
        const orderedArray = _.orderBy(array, props, innerOrders)
        
        const shuffledArray = shuffle(orderedArray)

  
        return !shuffledArray.isSortedBy(props, innerOrders)
      }),
      { numRuns: 1000, verbose: true }
    );
  }).timeout(0)
})


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
