const fc = require('fast-check');
fc.configureGlobal({numRuns: 100});
const util = require ('util');
const crypto = require('crypto');


describe('util encode & decode', () => {
    const encoder = new TextEncoder();
    const decoder = new TextDecoder();

    it('when encoded and then decoded it should be the same as the original', () => {
        fc.assert(fc.property(fc.string(), text => decoder.decode(encoder.encode(text)) === text),{verbose: true})
    });
    it('when encoded it should not contain the original', () => {
        fc.assert(fc.property(fc.string(), text => !encoder.encode(text).includes(text)),{verbose: true})
    });
});


describe('Crypto cipher & decipher', () => {
    const algorithm = 'aes-192-cbc';

    it('when ciphered and deciphered it should match the original', () => {
        fc.assert(fc.property(fc.string(), fc.string(), (message, password) => {
            const key = crypto.scryptSync(password, 'salt', 24)
            const iv = Buffer.alloc(16, 0); // todo: make randon and not static
            const cipher = crypto.createCipheriv(algorithm, key, iv);
            const decipher = crypto.createDecipheriv(algorithm, key, iv);
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
                // Prints: e5f79c5915c02171eec6b212d5520d44480993d7d622a7c4c2da32f6efda0ffa
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
    }).timeout(5000);
});