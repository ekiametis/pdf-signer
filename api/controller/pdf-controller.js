const service = require('../service/pdf-service');
const FileService = require('../service/file-service');

const PUBLIC_KEY_FILE_PATH = process.env.PUBLIC_KEY_FILE_PATH;

const sign = async (req, res, next) => {
    try {
        const filename = req.body.filename || 'signed_document';
        const pdf = req.body.pdf;
        const p12 = req.body.p12;
        const password = req.body.password;
        const signedPDF = await service.sign(pdf, p12, password);
        res.setHeader('Content-Length', signedPDF.length);
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=' + filename + '.pdf');
        res.status(200).send(signedPDF);
    } catch(err) {
        console.error(err);
        res.status(500).send(err.message);
    }
}

const verify = async (req, res, next) => {
    try {
        const pdf = req.body.pdf;
        const verifiedString = await verifyPDFSignature(signedPDF);
        res.status(200).send(verifiedString);
    } catch(err) {
        console.error(err);
        res.status(500).send(err.message);
    }
}

const getPublicKey = async (req, res, next) => {
    try {
        const publicKey = await FileService.readFile(PUBLIC_KEY_FILE_PATH);
        const result = publicKey.toString('utf8');
        res.setHeader('Content-Length', result.length);
        res.setHeader('Content-Type', 'text/plain');
        res.status(200).send(result);
    } catch(err) {
        console.error(err);
        res.status(500).send(err.message);
    }
}

module.exports = {
    sign,
    verify,
    getPublicKey
}