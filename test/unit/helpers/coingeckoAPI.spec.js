const sinon = require('sinon');
const path = require('path');
const { getCoinPrice } = require(path.join(srcDir, '/helpers/coingeckoAPI.js'));

describe('coingecko helper', () => {
  let sandbox = null;

  beforeEach(async () => {
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sandbox && sandbox.restore();
  });

  describe('getCoinPrice', () => {
    it('should get coin price', async () => {
      const price = await getCoinPrice('bitcoin');
      expect(price).to.greaterThan(1);
    });
  });
});
