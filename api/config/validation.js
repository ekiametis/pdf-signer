const validateRequirements = () => {
    const PRIVATE_KEY_FILE_PATH = process.env.PRIVATE_KEY_FILE_PATH;
    const PUBLIC_KEY_FILE_PATH = process.env.PUBLIC_KEY_FILE_PATH;

    if(!PRIVATE_KEY_FILE_PATH) {
        throw new Error('You need specify \'PRIVATE_KEY_FILE_PATH\' variable env to decrypt p12 password.')
    }

    if(!PUBLIC_KEY_FILE_PATH) {
        throw new Error('You need specify \'PUBLIC_KEY_FILE_PATH\' variable env to encrypt p12 password.')
    }
}

module.exports = {
    validateRequirements
}