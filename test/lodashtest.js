const fc = require('fast-check');
const _ = require('lodash')
fc.configureGlobal({numRuns: 100});

const getRandomIntInclusive = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive 
}

describe('Array', () => {
    describe('chunk()', () => {
        it('should return arrays of expected size', () => {
            fc.assert(
                fc.property(
                    fc.array(fc.string(), 10, 100),
                    (array) => {
                        const chunkSize = getRandomIntInclusive(1, array.length)
                        const chunkedArray = _.chunk(array, chunkSize)

                        const chunkedArraySizes = chunkedArray.map(chunk => chunk.length)

                        for(let i = 0; i < chunkedArraySizes.length; i++){
                          return chunkedArraySizes[i] % chunkSize === 0
                        }
                        
            }))
        })

        it('should return chunked arrays', () => {
          fc.assert(
            fc.property(
              fc.array(fc.string(), 10, 100), array => {
                const chunkSize = getRandomIntInclusive(1, array.length)
                const chunkedArray = _.chunk(array, chunkSize)
                return chunkedArray.length === Math.ceil(array.length / chunkSize)
              }
            )
          )
        })

        it('should return the last chunk as remaining elements', () => {
          fc.assert(
            fc.property(
              fc.array(fc.string(), 10, 100), array => {
                const chunkSize = getRandomIntInclusive(1, array.length)
                const chunkedArray = _.chunk(array, chunkSize)
                const remainingElements = array.length % chunkSize 

                if(remainingElements !== 0) {
                  return chunkedArray[chunkedArray.length -1].length === remainingElements
                } else {
                  return chunkedArray[chunkedArray.length - 1].length === chunkSize
                }
              }
            )
          , {verbose: true})
        })
    })
})