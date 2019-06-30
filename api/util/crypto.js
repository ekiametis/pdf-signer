const crypto = require('crypto');

const hash = (message, algorithm = 'RSA-SHA256') => {
    const hash = crypto.createHash(algorithm);
    hash.update(message);
    return { hash: hash.digest('hex'), algorithm: algorithm }
}

const sign = (message, privateKey, algorithm = 'RSA-SHA256') => {
    const signature = crypto.createSign(algorithm);
    signature.update(message);
    return { signature: signature.sign(privateKey, 'hex'), algorithm: algorithm }
}

const verify = (message, signature, publicKey, algorithm = 'RSA-SHA256') => {
    const verify = crypto.createVerify(algorithm);
    verify.update(message);
    const verified = verify.verify(publicKey, signature, 'hex');
    return verified;
}

const encrypt = (message, publicKey) => {
    let encrypted = crypto.publicEncrypt(publicKey, Buffer.from(message));
    return encrypted.toString("base64");
}

const encryptJSON = (message, publicKey) => {
    return encrypt(JSON.stringify(message), publicKey);
}

const decrypt = (encryptedMessage, privateKey) => {
    let decrypted = crypto.privateDecrypt(privateKey, Buffer.from(encryptedMessage, "base64"));
    return decrypted.toString("utf8");
}

const decryptJSON = (encryptedMessage, privateKey) => {
    let decryptedString = decrypt(encryptedMessage, publicKey);
    return JSON.parse(decryptedString);
}

module.exports = {
    hash,
    sign,
    verify,
    encrypt,
    encryptJSON,
    decrypt,
    decryptJSON,
}