const fc = require('fast-check');
const util = require ('util')

// Code under test
const contains = (text, pattern) => text.indexOf(pattern) >= 0;

describe('util', () => {
    const encoder = new TextEncoder()
    const decoder = new TextDecoder()
    const stringToEncode = 'This is the string to encode'
    const encodedString = encoder.encode(stringToEncode)
    const decodedString = decoder.decode(encodedString)

    it('should be equal', () => {
        
        fc.assert(fc.property(fc.string(), text => contains(decoder.decode(encoder.encode(text)), text)))
    })
})

// Properties
describe('properties', () => {
    // string text always contains itself
    it('should always contain itself', () => {
        fc.assert(fc.property(fc.string(), text => contains(text, text)));
    });
    // string a + b + c always contains b, whatever the values of a, b and c
    it('should always contain its substrings', () => {
        fc.assert(fc.property(fc.string(), fc.string(), fc.string(), (a,b,c) => {
            // Alternatively: no return statement and direct usage of expect or assert
            return contains(a+b+c, b);
        }));
    });
});