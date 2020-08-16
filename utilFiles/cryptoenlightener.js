const crypto = require('crypto');

function figureOutKeylength () {
    const allPossibleTypes = ['RC5','AES-128-CBC','AES-128-CBC-HMAC-SHA1','AES-128-CBC-HMAC-SHA256','AES-128-CFB','AES-128-CFB1','AES-128-CFB8','AES-128-CTR','AES-128-ECB','AES-128-OCB','AES-128-OFB','AES-128-XTS','AES-192-CBC','AES-192-CFB','AES-192-CFB1','AES-192-CFB8','AES-192-CTR','AES-192-ECB','AES-192-OCB','AES-192-OFB','AES-256-CBC','AES-256-CBC-HMAC-SHA1','AES-256-CBC-HMAC-SHA256','AES-256-CFB','AES-256-CFB1','AES-256-CFB8','AES-256-CTR','AES-256-ECB','AES-256-OCB','AES-256-OFB','AES-256-XTS','aes128','aes128-wrap','aes192','aes192-wrap','aes256','aes256-wrap','ARIA-128-CBC','ARIA-128-CCM','ARIA-128-CFB','ARIA-128-CFB1','ARIA-128-CFB8','ARIA-128-CTR','ARIA-128-ECB','ARIA-128-GCM','ARIA-128-OFB','ARIA-192-CBC','ARIA-192-CCM','ARIA-192-CFB','ARIA-192-CFB1','ARIA-192-CFB8','ARIA-192-CTR','ARIA-192-ECB','ARIA-192-GCM','ARIA-192-OFB','ARIA-256-CBC','ARIA-256-CCM','ARIA-256-CFB','ARIA-256-CFB1','ARIA-256-CFB8','ARIA-256-CTR','ARIA-256-ECB','ARIA-256-GCM','ARIA-256-OFB','aria128','aria192','aria256','bf','BF-CBC','BF-CFB','BF-ECB','BF-OFB','blowfish','CAMELLIA-128-CBC','CAMELLIA-128-CFB','CAMELLIA-128-CFB1','CAMELLIA-128-CFB8','CAMELLIA-128-CTR','CAMELLIA-128-ECB','CAMELLIA-128-OFB','CAMELLIA-192-CBC','CAMELLIA-192-CFB','CAMELLIA-192-CFB1','CAMELLIA-192-CFB8','CAMELLIA-192-CTR','CAMELLIA-192-ECB','CAMELLIA-192-OFB','CAMELLIA-256-CBC','CAMELLIA-256-CFB','CAMELLIA-256-CFB1','CAMELLIA-256-CFB8','CAMELLIA-256-CTR','CAMELLIA-256-ECB','CAMELLIA-256-OFB','camellia128','camellia192','camellia256','cast','cast-cbc','CAST5-CBC','CAST5-CFB','CAST5-ECB','CAST5-OFB','ChaCha20','ChaCha20-Poly1305','des','DES-CBC','DES-CFB','DES-CFB1','DES-CFB8','DES-ECB','DES-EDE','DES-EDE-CBC','DES-EDE-CFB','des-ede-ecb','DES-EDE-OFB','DES-EDE3','DES-EDE3-CBC','DES-EDE3-CFB','DES-EDE3-CFB1','DES-EDE3-CFB8','des-ede3-ecb','DES-EDE3-OFB','DES-OFB','des3','des3-wrap','desx','DESX-CBC','idea','IDEA-CBC','IDEA-CFB','IDEA-ECB','IDEA-OFB','rc2','rc2-128','rc2-40','RC2-40-CBC','rc2-64','RC2-64-CBC','RC2-CBC','RC2-CFB','RC2-ECB','RC2-OFB','RC4','RC4-40','RC4-HMAC-MD5','RC5-CBC','RC5-CFB','RC5-ECB','RC5-OFB','seed','SEED-CFB','SEED-ECB','SEED-OFB','sm4','SM4-CBC','SM4-CFB','SM4-CTR','SM4-ECB','SM4-OFB']
    var algorithm
    let allWorking = ""
    for (algorithm of allPossibleTypes){
        var workingI = [null,null]
        var workingJ = [null,null]
        for(var i=0; i < 300; i++){
            for(var j=0; j < 300; j++) {
                try {
                    const key = Buffer.alloc(i,123)
                    const iv = Buffer.alloc(j, 123);
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
                        try {
                            decipher.end();
                        } catch (err) {
                            //console.log(algorithm)
                        }
                    });

                    let decrypted = '';
                    decipher.on('readable', () => {
                        while (null !== (chunk = decipher.read())) {
                            decrypted += chunk.toString('utf8');
                        }
                    });
                    decipher.on('end', () => {
                    });/**
                    if(allWorking.includes(algorithm)){

                    }else{
                        allWorking += ("\nfc.constant(['" + algorithm + "',fc.integer(" + i + ", " + i + "), " + "fc.integer(" + j + ", " + j + "),])")
                    }**/
                    if(workingI[0] === null){
                        workingI[0] = i
                    } else if (workingI[0] !== i){
                        workingI[1] = i
                    }

                    if(workingJ[0] === null){
                        workingJ[0] = j
                    } else if (workingJ[0] !== j){
                        workingJ[1] = j
                    }
                    //console.log(algorithm + "    " + i + "   " + j)

                    cipher.write("message");
                    cipher.end();
                } catch (err) {
                    //console.log(algorithm + "         " + err)
                }
            }
        }
        if(workingI[0] != null || workingJ[0] != null){
            var tempString = ""
            tempString += "fc.constant(['" + algorithm + "', "
            if(workingI[1] != null){
                tempString += workingI[0] + ", "
                if(workingI[1] === 299){
                    tempString += Number.MAX_SAFE_INTEGER + ", "
                } else {
                    tempString += workingI[1] + ", "
                }
            } else {
                tempString += workingI[0] + ", " + workingI[0] + ", "
            }
            if(workingJ[1] != null){
                tempString += workingJ[0] + ", "
                if(workingJ[1] === 299){
                    tempString += Number.MAX_SAFE_INTEGER + "]),"
                } else {
                    tempString += workingJ[1] + "]),"
                }
            } else {
                tempString += workingJ[0] + ", " + workingJ[0] + "]),"
            }
            console.log(tempString)
//            console.log(
//                "fc.constant(['" +
//                algorithm + "', " +
//                workingI[0] + ", " + workingI[1] + ", " +
//                workingJ[0] + ", " + workingJ[1] + "]),")
        } else {
            //console.log(algorithm)
        }
    }
}
figureOutKeylength()