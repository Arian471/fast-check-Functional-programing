const fc = require('fast-check');
fc.configureGlobal({numRuns: 100});
const util = require ('util');

// Code under test
const contains = (text, pattern) => text.indexOf(pattern) >= 0;


describe('util', () => {
    const encoder = new TextEncoder();
    const decoder = new TextDecoder();

    it('when encoded and then decoded it should be the same as the original', () => {
        fc.assert(fc.property(fc.string(), text => decoder.decode(encoder.encode(text)) === text),{verbose: true})
    });
    it('when encoded it should not contain the original', () => {
        fc.assert(fc.property(fc.string(), text => !contains(encoder.encode(text), text)),{verbose: true})
    });
});

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