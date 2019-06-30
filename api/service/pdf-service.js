const fs = require('fs');
const path = require('path');
const uuidv4 = require('uuid/v4');
const { spawnSync} = require('child_process');
const Crypto = require('../util/crypto');
const RequestValidator = require('../util/request-validator');

const SIGNER_JAR = path.join(__dirname, '../../', 'jsignpdf', 'JSignPdf.jar');
const VERIFIER_JAR = path.join(__dirname, '../../', 'jsignpdf', 'Verifier.jar');
const PRIVATE_KEY = fs.readFileSync(process.env.PRIVATE_KEY_FILE_PATH);

const sign = async ( pdf, p12, password ) => {

    RequestValidator.isNotNull('pdf', pdf);
    RequestValidator.isNotNull('p12', p12);
    RequestValidator.isNotNull('password', password);
    
    const tmpPdfFolder = path.join(__dirname, '../../', 'tmp', uuidv4());
    const pdfFileName = path.join(tmpPdfFolder, 'demo.pdf');
    const pdfSignedFileName = path.join(tmpPdfFolder, 'demo_signed.pdf');
    const p12Filename = path.join(tmpPdfFolder, 'cert.p12');
    
    try {
        spawnSync('mkdir', [ tmpPdfFolder ]);
        
        const decriptedPassword = Crypto.decrypt(password, PRIVATE_KEY);

        fs.writeFileSync(pdfFileName, pdf);
        fs.writeFileSync(p12Filename, p12);

        const options = [
            '-jar',
            SIGNER_JAR,
            '-a',
            '-kst',
            'PKCS12',
            '-ksf',
            p12Filename,
            '-ksp',
            decriptedPassword,
            '-pe',
            'NONE',
            '-pr',
            'DISALLOW_PRINTING',
            '--ocsp',
            '--crl',
            '-d',
            tmpPdfFolder,
            pdfFileName
        ];

    
        const child = spawnSync('java', options);

        const { error, stderr, stdout } = child;
        if(error) {
            throw error;
        } else if(stderr.toString('utf8').length > 0) {
            throw new Error(stderr.toString('utf8'));
        }
        const signedPdf = fs.readFileSync(pdfSignedFileName);
        return signedPdf;
    } catch(err) {
        throw err;
    } finally {
        spawnSync('rm', [ '-rf', tmpPdfFolder ]);
    }
}

const verify = async (pdf) => {

    const tmpPdfFolder = path.join(__dirname, '../../', 'tmp', uuidv4());
    const pdfFileName = path.join(tmpPdfFolder, 'demo.pdf');

    try {

        spawnSync('mkdir', [ tmpPdfFolder ]);
        fs.writeFileSync(pdfFileName, pdf);
    
        const child = spawnSync('java', [
            '-jar',
            VERIFIER_JAR,
            '-ff',
            pdfFileName
        ]);

        const { error, stderr, stdout } = child;
        if(error) {
            throw error;
        } else if(stderr.toString('utf8').length > 0) {
            throw new Error(stderr.toString('utf8'));
        }
        return stdout.toString('utf8');
    } catch(err) {
        throw err;
    } finally {
        spawnSync('rm', [ '-rf', tmpPdfFolder ]);
    }
}

module.exports = {
    sign,
    verify
}