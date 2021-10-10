import RandomOrg from '..';
import { expect } from 'chai';

const API_KEY = process.env['RANDOM_ORG_API_KEY']!;
const TEST_TIMEOUT = 1 * 60 * 1000; // 1 minute in ms

describe('RandomOrg', function() {
  let random: RandomOrg;

  this.timeout(TEST_TIMEOUT);

  beforeEach(function() {
    random = new RandomOrg({ apiKey: API_KEY });
  });

  it('should be possible to call getUsage', async () => {
    const result = await random.getUsage();

    // Sneaky log for monitoring CI api key usage.
    console.log(result);

    // Example check that the api key is still active ("running")
    expect(result.status).to.equal('running');
  });

  describe('Basic api methods', () => {

    it('should be possible to call generateIntegers', async () => {
      const n = 3;

      const result = await random.generateIntegers({ n, min: 0, max: 100 });

      expect(result.random.data).to.have.lengthOf(n);
    });

    it('should be possible to call generateIntegerSequences', async () => {
      const n = 3;
      const length = 2;

      const result = await random.generateIntegerSequences({ n, length, min: 0, max: 100 });

      expect(result.random.data).to.have.lengthOf(n);
      expect(result.random.data[0]).to.have.lengthOf(length);
      expect(result.random.data[1]).to.have.lengthOf(length);
      expect(result.random.data[2]).to.have.lengthOf(length);
    });

    it('should be possible to call generateDecimalFractions', async () => {
      const n = 2;

      const result = await random.generateDecimalFractions({ n, decimalPlaces: 2 });

      expect(result.random.data).to.have.lengthOf(n);
    });

    it('should be possible to call generateGaussians', async () => {
      const n = 2;

      const result = await random.generateGaussians({ n, mean: 0, standardDeviation: 50, significantDigits: 4 });

      expect(result.random.data).to.have.lengthOf(n);
    });

    it('should be possible to call generateStrings', async () => {
      const n = 2;

      const result = await random.generateStrings({ n, length: 5, characters: 'abcdef' });

      expect(result.random.data).to.have.lengthOf(n);
    });

    it('should be possible to call generateUUIDs', async () => {
      const n = 2;

      const result = await random.generateUUIDs({ n });

      expect(result.random.data).to.have.lengthOf(n);
    });

    it('should be possible to call generateBlobs', async () => {
      const n = 2;
      const size = 8 * 10; // 8 bytes

      const result = await random.generateBlobs({ n, size });

      expect(result.random.data).to.have.lengthOf(n);
    });

  });

  describe('Signed api methods', () => {

    it('should be possible to call generateSignedIntegers', async () => {
      const n = 3;

      const result = await random.generateSignedIntegers({ n, min: 0, max: 100 });

      expect(result.random.data).to.have.lengthOf(n);
      expect(result.signature).to.be.a('string');
    });

    it('should be possible to call generateSignedIntegerSequences', async () => {
      const n = 3;
      const length = 2;

      const result = await random.generateSignedIntegerSequences({ n, length, min: 0, max: 100 });

      expect(result.random.data).to.have.lengthOf(n);
      expect(result.random.data[0]).to.have.lengthOf(length);
      expect(result.random.data[1]).to.have.lengthOf(length);
      expect(result.random.data[2]).to.have.lengthOf(length);
      expect(result.signature).to.be.a('string');
    });

    it('should be possible to call generateSignedDecimalFractions', async () => {
      const n = 2;

      const result = await random.generateSignedDecimalFractions({ n, decimalPlaces: 2 });

      expect(result.random.data).to.have.lengthOf(n);
      expect(result.signature).to.be.a('string');
    });

    it('should be possible to call generateSignedGaussians', async () => {
      const n = 2;

      const result = await random.generateSignedGaussians({ n, mean: 0, standardDeviation: 50, significantDigits: 4 });

      expect(result.random.data).to.have.lengthOf(n);
      expect(result.signature).to.be.a('string');
    });

    it('should be possible to call generateSignedStrings', async () => {
      const n = 2;

      const result = await random.generateSignedStrings({ n, length: 5, characters: 'abcdef' });

      expect(result.random.data).to.have.lengthOf(n);
      expect(result.signature).to.be.a('string');
    });

    it('should be possible to call generateSignedUUIDs', async () => {
      const n = 2;

      const result = await random.generateSignedUUIDs({ n });

      expect(result.random.data).to.have.lengthOf(n);
      expect(result.signature).to.be.a('string');
    });

    it('should be possible to call generateSignedBlobs', async () => {
      const n = 2;
      const size = 8 * 10; // 8 bytes

      const result = await random.generateSignedBlobs({ n, size });

      expect(result.random.data).to.have.lengthOf(n);
      expect(result.signature).to.be.a('string');
    });

    it('should be possible to call verifySignature', async () => {
      const signedResult = await random.generateSignedUUIDs({ n: 5 });

      const result = await random.verifySignature({
        random: signedResult.random,
        signature: signedResult.signature,
      });

      expect(result.authenticity).to.be.a('boolean');
      expect(result.authenticity).to.equal(true, 'Signed data was inauthentic');
    });

    it('should be possible to call getResult', async () => {
      const original = await random.generateSignedUUIDs({ n: 5 });

      const result = await random.getResult({ serialNumber: original.random.serialNumber });

      expect(result).to.deep.equal(original);
    });

  });

});
