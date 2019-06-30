const assert = require('assert');
const { expect } = require('chai');
const path = require('path');
const fs = require('fs');
const Crypto = require('../../api/util/crypto');

const service = require('../../api/service/pdf-service');

const TOTAL_REVISIONS_REGEX = /Total revisions: (\d+)/;

let PDF_INPUT;
let PDF_FILE;
let PASSWORD1;
let P12_FILE_1;
let PASSWORD2;
let P12_FILE_2;
let PUBLIC_KEY;

describe('PDF Service', () => {

  before(() => {
    PDF_INPUT = path.join(__dirname, '../', 'pdf', 'test.pdf');
    PDF_FILE = fs.readFileSync(PDF_INPUT);
    
    PASSWORD1 = '12345678';
    const P12_1 = path.join(__dirname, '../', 'ssl', 'pfx', 'cert.p12');
    P12_FILE_1 = fs.readFileSync(P12_1);
    
    PASSWORD2 = '87654321';
    const P12_2 = path.join(__dirname, '../', 'ssl', 'pfx', 'cert2.p12');
    P12_FILE_2 = fs.readFileSync(P12_2);

    const filepath = path.join(__dirname, '../', 'keys', 'public.pub');
    PUBLIC_KEY = fs.readFileSync(filepath);
  });

  describe('Test signature', () => {

    it('should return single signature pdf buffer', async () => {
      const encryptedPassword = Crypto.encrypt(PASSWORD1, PUBLIC_KEY);
      const signedPdf = await service.sign(PDF_FILE, P12_FILE_1, encryptedPassword);
      expect(signedPdf).to.be.an.instanceof(Buffer);
    });

    it('should return multiple signature pdf buffer', async () => {
      const encryptedPassword = Crypto.encrypt(PASSWORD1, PUBLIC_KEY);
      const signedPdf = await service.sign(PDF_FILE, P12_FILE_1, encryptedPassword);
      const encryptedPassword2 = Crypto.encrypt(PASSWORD2, PUBLIC_KEY);
      const multipleSignedPdf = await service.sign(signedPdf, P12_FILE_2, encryptedPassword2);
      expect(multipleSignedPdf).to.be.an.instanceof(Buffer);
    });
  });

  describe('Test verification signature', () => {

    it('should return single signature verified string', async () => {
      const encryptedPassword = Crypto.encrypt(PASSWORD1, PUBLIC_KEY);
      const signedPdf = await service.sign(PDF_FILE, P12_FILE_1, encryptedPassword);
      const verification = await service.verify(signedPdf);
      const match = verification.match(TOTAL_REVISIONS_REGEX);
      const totalSignatures = parseInt(match[1])
      expect(totalSignatures).to.be.equal(1);
    });

    it('should return multiple signature verified string', async () => {
      const encryptedPassword = Crypto.encrypt(PASSWORD1, PUBLIC_KEY);
      const signedPdf = await service.sign(PDF_FILE, P12_FILE_1, encryptedPassword);
      const encryptedPassword2 = Crypto.encrypt(PASSWORD2, PUBLIC_KEY);
      const multipleSignedPdf = await service.sign(signedPdf, P12_FILE_2, encryptedPassword2);
      const verification = await service.verify(multipleSignedPdf);
      const match = verification.match(TOTAL_REVISIONS_REGEX);
      const totalSignatures = parseInt(match[1])
      expect(totalSignatures).to.be.equal(2);
    });
  });
});
