const fc = require('fast-check');
fc.configureGlobal({numRuns: 300});
const util = require ('util');
const crypto = require('crypto');


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
    fc.constant(['AES-128-CBC',16]),
    fc.constant(['AES-128-CBC-HMAC-SHA1',16]),
    fc.constant(['AES-128-CBC-HMAC-SHA256',16]),
    fc.constant(['AES-128-CFB',16]),
    fc.constant(['AES-128-CFB1',16]),
    fc.constant(['AES-128-CFB8',16]),
    fc.constant(['AES-128-CTR',16]),
    fc.constant(['AES-128-OFB',16]),
//    fc.constant(['AES-128-XTS',32]),
    fc.constant(['AES-192-CBC',24]),
    fc.constant(['AES-192-CFB',24]),
    fc.constant(['AES-192-CFB1',24]),
    fc.constant(['AES-192-CFB8',24]),
    fc.constant(['AES-192-CTR',24]),
    fc.constant(['AES-192-OFB',24]),
    fc.constant(['AES-256-CBC',32]),
    fc.constant(['AES-256-CBC-HMAC-SHA1',32]),
    fc.constant(['AES-256-CBC-HMAC-SHA256',32]),
    fc.constant(['AES-256-CFB',32]),
    fc.constant(['AES-256-CFB1',32]),
    fc.constant(['AES-256-CFB8',32]),
    fc.constant(['AES-256-CTR',32]),
    fc.constant(['AES-256-OFB',32]),
//    fc.constant(['AES-256-XTS',64]),
    fc.constant(['aes128',16]),
    fc.constant(['aes192',24]),
    fc.constant(['aes256',32]),
    fc.constant(['ARIA-128-CBC',16]),
    fc.constant(['ARIA-128-CFB',16]),
    fc.constant(['ARIA-128-CFB1',16]),
    fc.constant(['ARIA-128-CFB8',16]),
    fc.constant(['ARIA-128-CTR',16]),
    //fc.constant(['ARIA-128-GCM',16]),
    fc.constant(['ARIA-128-OFB',16]),
    fc.constant(['ARIA-192-CBC',24]),
    fc.constant(['ARIA-192-CFB',24]),
    fc.constant(['ARIA-192-CFB1',24]),
    fc.constant(['ARIA-192-CFB8',24]),
    fc.constant(['ARIA-192-CTR',24]),
//    fc.constant(['ARIA-192-GCM',24]),
    fc.constant(['ARIA-192-OFB',24]),
    fc.constant(['ARIA-256-CBC',32]),
    fc.constant(['ARIA-256-CFB',32]),
    fc.constant(['ARIA-256-CFB1',32]),
    fc.constant(['ARIA-256-CFB8',32]),
    fc.constant(['ARIA-256-CTR',32]),
//    fc.constant(['ARIA-256-GCM',32]),
    fc.constant(['ARIA-256-OFB',32]),
    fc.constant(['aria128',16]),
    fc.constant(['aria192',24]),
    fc.constant(['aria256',32]),
    fc.constant(['CAMELLIA-128-CBC',16]),
    fc.constant(['CAMELLIA-128-CFB',16]),
    fc.constant(['CAMELLIA-128-CFB1',16]),
    fc.constant(['CAMELLIA-128-CFB8',16]),
    fc.constant(['CAMELLIA-128-CTR',16]),
    fc.constant(['CAMELLIA-128-OFB',16]),
    fc.constant(['CAMELLIA-192-CBC',24]),
    fc.constant(['CAMELLIA-192-CFB',24]),
    fc.constant(['CAMELLIA-192-CFB1',24]),
    fc.constant(['CAMELLIA-192-CFB8',24]),
    fc.constant(['CAMELLIA-192-CTR',24]),
    fc.constant(['CAMELLIA-192-OFB',24]),
    fc.constant(['CAMELLIA-256-CBC',32]),
    fc.constant(['CAMELLIA-256-CFB',32]),
    fc.constant(['CAMELLIA-256-CFB1',32]),
    fc.constant(['CAMELLIA-256-CFB8',32]),
    fc.constant(['CAMELLIA-256-CTR',32]),
    fc.constant(['CAMELLIA-256-OFB',32]),
    fc.constant(['camellia128',16]),
    fc.constant(['camellia192',24]),
    fc.constant(['camellia256',32]),
    fc.constant(['ChaCha20',32]),
    fc.constant(['seed',16]),
    fc.constant(['SEED-CFB',16]),
    fc.constant(['SEED-OFB',16]),
    fc.constant(['sm4',16]),
    fc.constant(['SM4-CBC',16]),
    fc.constant(['SM4-CFB',16]),
    fc.constant(['SM4-CTR',16]),
    fc.constant(['SM4-OFB',16]),
)


describe('Crypto cipher & decipher aes-192-cbc', () => {
    const algorithm = 'aes-192-cbc';

    it('when ciphered and deciphered it should match the original', () => {
        fc.assert(fc.property(fc.string(), fc.integer(), fc.integer(), encryptionAlgorithm, (message, password, buffferContent, algAndSize) => {
            console.log("---------------------" + algAndSize[0] + "-------------")
            const key = Buffer.alloc(algAndSize[1],password)
            const iv = Buffer.alloc(16, buffferContent);
            const cipher = crypto.createCipheriv(algAndSize[0], key, iv);
            const decipher = crypto.createDecipheriv(algAndSize[0], key, iv);
            let encrypted = '';
            cipher.on('readable', () => {
                let chunk;
                while (null !== (chunk = cipher.read())) {
                    encrypted += chunk.toString('hex');
                }
            });
            cipher.on('end', () => {
                decipher.write(encrypted, 'hex');
                decipher.end();
            });

            let decrypted = '';
            decipher.on('readable', () => {
                while (null !== (chunk = decipher.read())) {
                    decrypted += chunk.toString('utf8');
                }
            });
            decipher.on('end', () => {
                return decrypted === message;
            });

            cipher.write(message);
            cipher.end();

        }),{verbose: true})
    }).timeout(0);

    it('when ciphered it should no longer match the original', () => {
        fc.assert(fc.property(fc.string(), fc.string(), fc.string(), (message, password, buffferContent) => {
            const key = crypto.scryptSync(password, 'salt', 24)
            const iv = Buffer.alloc(16, buffferContent);
            const cipher = crypto.createCipheriv(algorithm, key, iv);
            let encrypted = '';
            cipher.on('readable', () => {
                let chunk;
                while (null !== (chunk = cipher.read())) {
                    encrypted += chunk.toString('hex');
                }
            });
            cipher.on('end', () => {
                return encrypted !== message
            });

            cipher.write(message);
            cipher.end();

        }),{verbose: true})
    }).timeout(0);
/**
    it('Bluefish', () => {
        fc.assert(fc.property(fc.string(), fc.string(), fc.string(), (message, password, buffferContent) => {
                const key = Buffer.from(crypto.randomBytes(24))
            const iv = Buffer.alloc(16, buffferContent);
            const cipher = crypto.createCipher('blowfish', message);

            var decipher = crypto.createDecipher('blowfish', cipher);
            var dec = decipher.update(path, 'hex', 'utf8');
            dec += decipher.final('utf8');
            console.log(decrypted)


        }),{verbose: true})
    }).timeout(0);**/
});