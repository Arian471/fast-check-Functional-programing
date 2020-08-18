const fc = require('fast-check');
fc.configureGlobal({numRuns: 300});
const util = require ('util');
const crypto = require('crypto');
const cryptojs = require('crypto-js');
const generator = require('./generator');

describe('util encode & decode', () => {
    const encoder = new TextEncoder();
    const decoder = new TextDecoder();

    it('when encoded and then decoded it should be the same as the original', () => {
        fc.assert(fc.property(fc.string(), text => decoder.decode(encoder.encode(text)) === text),{verbose: true})
    });
    it('when encoded it should not look like the original', () => {
        fc.assert(fc.property(fc.string(), text => encoder.encode(text) !== text),{verbose: true})
    });
});

const encryptionAlgorithm = fc.oneof(
    fc.constant(['AES-128-CBC', 16, 16, 16, 16]),
    fc.constant(['AES-128-CBC-HMAC-SHA1', 16, 16, 16, 16]),
    fc.constant(['AES-128-CBC-HMAC-SHA256', 16, 16, 16, 16]),
    fc.constant(['AES-128-CFB', 16, 16, 16, 16]),
    fc.constant(['AES-128-CFB1', 16, 16, 16, 16]),
    fc.constant(['AES-128-CFB8', 16, 16, 16, 16]),
    fc.constant(['AES-128-CTR', 16, 16, 16, 16]),
    fc.constant(['AES-128-ECB', 16, 16, 0, 0]),
    fc.constant(['AES-128-OFB', 16, 16, 16, 16]),
    fc.constant(['AES-192-CBC', 24, 24, 16, 16]),
    fc.constant(['AES-192-CFB', 24, 24, 16, 16]),
    fc.constant(['AES-192-CFB1', 24, 24, 16, 16]),
    fc.constant(['AES-192-CFB8', 24, 24, 16, 16]),
    fc.constant(['AES-192-CTR', 24, 24, 16, 16]),
    fc.constant(['AES-192-ECB', 24, 24, 0, 0]),
    fc.constant(['AES-192-OFB', 24, 24, 16, 16]),
    fc.constant(['AES-256-CBC', 32, 32, 16, 16]),
    fc.constant(['AES-256-CBC-HMAC-SHA1', 32, 32, 16, 16]),
    fc.constant(['AES-256-CBC-HMAC-SHA256', 32, 32, 16, 16]),
    fc.constant(['AES-256-CFB', 32, 32, 16, 16]),
    fc.constant(['AES-256-CFB1', 32, 32, 16, 16]),
    fc.constant(['AES-256-CFB8', 32, 32, 16, 16]),
    fc.constant(['AES-256-CTR', 32, 32, 16, 16]),
    fc.constant(['AES-256-ECB', 32, 32, 0, 0]),
    fc.constant(['AES-256-OFB', 32, 32, 16, 16]),
    fc.constant(['aes128', 16, 16, 16, 16]),
    //fc.constant(['aes128-wrap', 16, 16, 8, 8]),
    fc.constant(['aes192', 24, 24, 16, 16]),
    //fc.constant(['aes192-wrap', 24, 24, 8, 8]),
    fc.constant(['aes256', 32, 32, 16, 16]),
    //fc.constant(['aes256-wrap', 32, 32, 8, 8]),
    fc.constant(['ARIA-128-CBC', 16, 16, 16, 16]),
    fc.constant(['ARIA-128-CFB', 16, 16, 16, 16]),
    fc.constant(['ARIA-128-CFB1', 16, 16, 16, 16]),
    fc.constant(['ARIA-128-CFB8', 16, 16, 16, 16]),
    fc.constant(['ARIA-128-CTR', 16, 16, 16, 16]),
    fc.constant(['ARIA-128-ECB', 16, 16, 0, 0]),
    //fc.constant(['ARIA-128-GCM', 16, 16, 1, 9007199254740991]),
    fc.constant(['ARIA-128-OFB', 16, 16, 16, 16]),
    fc.constant(['ARIA-192-CBC', 24, 24, 16, 16]),
    fc.constant(['ARIA-192-CFB', 24, 24, 16, 16]),
    fc.constant(['ARIA-192-CFB1', 24, 24, 16, 16]),
    fc.constant(['ARIA-192-CFB8', 24, 24, 16, 16]),
    fc.constant(['ARIA-192-CTR', 24, 24, 16, 16]),
    fc.constant(['ARIA-192-ECB', 24, 24, 0, 0]),
    //fc.constant(['ARIA-192-GCM', 24, 24, 1, 9007199254740991]),
    fc.constant(['ARIA-192-OFB', 24, 24, 16, 16]),
    fc.constant(['ARIA-256-CBC', 32, 32, 16, 16]),
    fc.constant(['ARIA-256-CFB', 32, 32, 16, 16]),
    fc.constant(['ARIA-256-CFB1', 32, 32, 16, 16]),
    fc.constant(['ARIA-256-CFB8', 32, 32, 16, 16]),
    fc.constant(['ARIA-256-CTR', 32, 32, 16, 16]),
    fc.constant(['ARIA-256-ECB', 32, 32, 0, 0]),
    //fc.constant(['ARIA-256-GCM', 32, 32, 1, 9007199254740991]),
    fc.constant(['ARIA-256-OFB', 32, 32, 16, 16]),
    fc.constant(['aria128', 16, 16, 16, 16]),
    fc.constant(['aria192', 24, 24, 16, 16]),
    fc.constant(['aria256', 32, 32, 16, 16]),
    fc.constant(['bf', 1, 9007199254740991, 8, 8]),
    fc.constant(['BF-CBC', 1, 9007199254740991, 8, 8]),
    fc.constant(['BF-CFB', 1, 9007199254740991, 8, 8]),
    fc.constant(['BF-ECB', 1, 9007199254740991, 0, 0]),
    fc.constant(['BF-OFB', 1, 9007199254740991, 8, 8]),
    fc.constant(['blowfish', 1, 9007199254740991, 8, 8]),
    fc.constant(['CAMELLIA-128-CBC', 16, 16, 16, 16]),
    fc.constant(['CAMELLIA-128-CFB', 16, 16, 16, 16]),
    fc.constant(['CAMELLIA-128-CFB1', 16, 16, 16, 16]),
    fc.constant(['CAMELLIA-128-CFB8', 16, 16, 16, 16]),
    fc.constant(['CAMELLIA-128-CTR', 16, 16, 16, 16]),
    fc.constant(['CAMELLIA-128-ECB', 16, 16, 0, 0]),
    fc.constant(['CAMELLIA-128-OFB', 16, 16, 16, 16]),
    fc.constant(['CAMELLIA-192-CBC', 24, 24, 16, 16]),
    fc.constant(['CAMELLIA-192-CFB', 24, 24, 16, 16]),
    fc.constant(['CAMELLIA-192-CFB1', 24, 24, 16, 16]),
    fc.constant(['CAMELLIA-192-CFB8', 24, 24, 16, 16]),
    fc.constant(['CAMELLIA-192-CTR', 24, 24, 16, 16]),
    fc.constant(['CAMELLIA-192-ECB', 24, 24, 0, 0]),
    fc.constant(['CAMELLIA-192-OFB', 24, 24, 16, 16]),
    fc.constant(['CAMELLIA-256-CBC', 32, 32, 16, 16]),
    fc.constant(['CAMELLIA-256-CFB', 32, 32, 16, 16]),
    fc.constant(['CAMELLIA-256-CFB1', 32, 32, 16, 16]),
    fc.constant(['CAMELLIA-256-CFB8', 32, 32, 16, 16]),
    fc.constant(['CAMELLIA-256-CTR', 32, 32, 16, 16]),
    fc.constant(['CAMELLIA-256-ECB', 32, 32, 0, 0]),
    fc.constant(['CAMELLIA-256-OFB', 32, 32, 16, 16]),
    fc.constant(['camellia128', 16, 16, 16, 16]),
    fc.constant(['camellia192', 24, 24, 16, 16]),
    fc.constant(['camellia256', 32, 32, 16, 16]),
    fc.constant(['cast', 1, 9007199254740991, 8, 8]),
    fc.constant(['cast-cbc', 1, 9007199254740991, 8, 8]),
    fc.constant(['CAST5-CBC', 1, 9007199254740991, 8, 8]),
    fc.constant(['CAST5-CFB', 1, 9007199254740991, 8, 8]),
    fc.constant(['CAST5-ECB', 1, 9007199254740991, 0, 0]),
    fc.constant(['CAST5-OFB', 1, 9007199254740991, 8, 8]),
    fc.constant(['ChaCha20', 32, 32, 16, 16]),
    fc.constant(['des', 8, 8, 8, 8]),
    fc.constant(['DES-CBC', 8, 8, 8, 8]),
    fc.constant(['DES-CFB', 8, 8, 8, 8]),
    fc.constant(['DES-CFB1', 8, 8, 8, 8]),
    fc.constant(['DES-CFB8', 8, 8, 8, 8]),
    fc.constant(['DES-ECB', 8, 8, 0, 0]),
    fc.constant(['DES-EDE', 16, 16, 0, 0]),
    fc.constant(['DES-EDE-CBC', 16, 16, 8, 8]),
    fc.constant(['DES-EDE-CFB', 16, 16, 8, 8]),
    fc.constant(['des-ede-ecb', 16, 16, 0, 0]),
    fc.constant(['DES-EDE-OFB', 16, 16, 8, 8]),
    fc.constant(['DES-EDE3', 24, 24, 0, 0]),
    fc.constant(['DES-EDE3-CBC', 24, 24, 8, 8]),
    fc.constant(['DES-EDE3-CFB', 24, 24, 8, 8]),
    fc.constant(['DES-EDE3-CFB1', 24, 24, 8, 8]),
    fc.constant(['DES-EDE3-CFB8', 24, 24, 8, 8]),
    fc.constant(['des-ede3-ecb', 24, 24, 0, 0]),
    fc.constant(['DES-EDE3-OFB', 24, 24, 8, 8]),
    fc.constant(['DES-OFB', 8, 8, 8, 8]),
    fc.constant(['des3', 24, 24, 8, 8]),
    //fc.constant(['des3-wrap', 24, 24, 0, 0]),
    fc.constant(['desx', 24, 24, 8, 8]),
    fc.constant(['DESX-CBC', 24, 24, 8, 8]),
    fc.constant(['idea', 16, 16, 8, 8]),
    fc.constant(['IDEA-CBC', 16, 16, 8, 8]),
    fc.constant(['IDEA-CFB', 16, 16, 8, 8]),
    fc.constant(['IDEA-ECB', 16, 16, 0, 0]),
    fc.constant(['IDEA-OFB', 16, 16, 8, 8]),
    fc.constant(['rc2', 1, 9007199254740991, 8, 8]),
    fc.constant(['rc2-128', 1, 9007199254740991, 8, 8]),
    fc.constant(['rc2-40', 1, 9007199254740991, 8, 8]),
    fc.constant(['RC2-40-CBC', 1, 9007199254740991, 8, 8]),
    fc.constant(['rc2-64', 1, 9007199254740991, 8, 8]),
    fc.constant(['RC2-64-CBC', 1, 9007199254740991, 8, 8]),
    fc.constant(['RC2-CBC', 1, 9007199254740991, 8, 8]),
    fc.constant(['RC2-CFB', 1, 9007199254740991, 8, 8]),
    fc.constant(['RC2-ECB', 1, 9007199254740991, 0, 0]),
    fc.constant(['RC2-OFB', 1, 9007199254740991, 8, 8]),
    fc.constant(['RC4', 1, 9007199254740991, 0, 0]),
    fc.constant(['RC4-40', 1, 9007199254740991, 0, 0]),
    fc.constant(['RC4-HMAC-MD5', 1, 9007199254740991, 0, 0]),
    fc.constant(['seed', 16, 16, 16, 16]),
    fc.constant(['SEED-CFB', 16, 16, 16, 16]),
    fc.constant(['SEED-ECB', 16, 16, 0, 0]),
    fc.constant(['SEED-OFB', 16, 16, 16, 16]),
    fc.constant(['sm4', 16, 16, 16, 16]),
    fc.constant(['SM4-CBC', 16, 16, 16, 16]),
    fc.constant(['SM4-CFB', 16, 16, 16, 16]),
    fc.constant(['SM4-CTR', 16, 16, 16, 16]),
    fc.constant(['SM4-ECB', 16, 16, 0, 0]),
    fc.constant(['SM4-OFB', 16, 16, 16, 16]),
)
function convertAlgAndSize() {

}

const alg = fc.constant(convertAlgAndSize())

function encryptText (message, encryptionAlg, keyBuff, ivBuff){
    var cipher = crypto.createCipheriv(encryptionAlg,
        new Buffer.from(keyBuff), new Buffer.from(ivBuff))
    var crypted = cipher.update(message, 'utf8', 'hex')
    crypted += cipher.final('hex')
    return crypted
}

function decrypt(encInput, encryptionAlg, keyBuff, ivBuff){
    var decipher = crypto.createDecipheriv(encryptionAlg,
        new Buffer.from(keyBuff), new Buffer.from(ivBuff))
    var dec = decipher.update(encInput, 'hex', 'utf8')
    dec += decipher.final('utf8')
    return dec
}

describe('Crypto cipher & decipher algorithms', () => {
    it('when ciphered and deciphered it should match the original', () => {
        fc.assert(fc.property(fc.string(), fc.integer(), fc.integer(), encryptionAlgorithm, fc.nat(), fc.nat(), (message, password, buffferContent, algAndSize, variableLengthKey, variableLengthIv) => {
            let key = Buffer.alloc(algAndSize[1], password)
            if(algAndSize[2] === 9007199254740991){
                key = Buffer.alloc(variableLengthKey+1, password)
            }
            let iv = Buffer.alloc(algAndSize[3], buffferContent);
            if(algAndSize[5] === 9007199254740991){
                iv = Buffer.alloc(variableLengthIv+1, password)
            }
            const crypted = encryptText(message, algAndSize[0], key, iv)
            return message === decrypt(crypted, algAndSize[0], key, iv)
        }),{verbose: true})
    }).timeout(0);

    it('when ciphered it should no longer match the original', () => {
        fc.assert(fc.property(fc.string(), fc.integer(), fc.integer(), encryptionAlgorithm, fc.nat(), fc.nat(), (message, password, buffferContent, algAndSize, variableLengthKey, variableLengthIv) => {
            let key = Buffer.alloc(algAndSize[1], password)
            if(algAndSize[2] === 9007199254740991){
                key = Buffer.alloc(variableLengthKey+1, password)
            }
            let iv = Buffer.alloc(algAndSize[3], buffferContent);
            if(algAndSize[5] === 9007199254740991){
                iv = Buffer.alloc(variableLengthIv+1, password)
            }
            let crypted = encryptText(message, algAndSize[0], key, iv)
            if(message.length>0){
                return crypted!==message
            } else {
                return true
            }

        }),{verbose: true})
    }).timeout(0);
});

function executeFunctionFromString(functionName, context , args ) {
    var args = Array.prototype.slice.call(arguments, 2);
    var namespaces = functionName.split(".");
    var func = namespaces.pop();
    for(var i = 0; i < namespaces.length; i++) {
      context = context[namespaces[i]];
    }
    return context[func].apply(context, args);
  }


const hashingAlgorithm = fc.oneof(
    fc.constant('SHA256'),
    fc.constant('MD5'),
    fc.constant('SHA1'),
    fc.constant('SHA512'),
    fc.constant('SHA224'),
    fc.constant('SHA384'),
    fc.constant('RIPEMD160'),

    )

    //console.log(crypto.getHashes())

    describe('Crypto hashing', () => {

        it('Both crypto libraries should yield the same string when hashing', () => {
            fc.assert(fc.property(generator.stringArb(), hashingAlgorithm, 
            (message, hashingAlg) => {
                const hash = crypto.createHash(hashingAlg);
                let hashNodeCrypto = '';
                let hashCryptojs = '';
                hash.update(message);
                hashNodeCrypto = hash.digest('hex');
                
                hashCryptojs = executeFunctionFromString(hashingAlg, cryptojs, message)
                .toString(cryptojs.enc.Hex);
    
                return hashNodeCrypto == hashCryptojs;
    
            }),{verbose: true})
        }).timeout(0);
    });