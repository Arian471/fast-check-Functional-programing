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
        it('returns arrays of expected size', () => {
            fc.assert(
                fc.property(
                    fc.array(fc.string(), 10, 100),
                    (array) => {
                        const chunkSize = getRandomIntInclusive(1, array.length)
                        const chunkedArray = _.chunk(array, chunkSize)

                        const chunkedArraySizes = chunkedArray.map(chunk => chunk.length)
                        console.log('asd', chunkedArraySizes)
                        return chunkedArray[0].length === chunkSize
            }))
        })
    })
})