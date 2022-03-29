const path = require('path');
const sinon = require('sinon');
const sequelizeMockingMocha = require('sequelize-mocking').sequelizeMockingMocha;
const CoinController = require(path.join(srcDir, '/services/api/controllers/coin'));
const DB = require(path.join(srcDir, 'modules/db'));

describe('Controller: Coin', () => {
  let sandbox = null;

  sequelizeMockingMocha(DB.sequelize, [path.resolve('test/mocks/coins.json')], { logging: false });

  beforeEach(async () => {
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sandbox && sandbox.restore();
  });

  describe('getCoinByCode', () => {
    it('should get coin by code', async () => {
      const coinCode = 'BTC';
      const coin = await CoinController.getCoinByCode(coinCode);

      expect(coin.code).to.eq(coinCode);
      expect(Object.keys(coin).length).to.eq(3);
    });

    it('should fail get coin by code', async () => {
      const coinCode = 'AMN';
      expect(CoinController.getCoinByCode(coinCode)).to.be.rejectedWith(Error, 'unknown_coin_code');
    });

    it('should update coin price every one hour', async () => {
      const coinCode = 'BTC';
      const MIN_46=1000*60*46
      const MIN_15=1000*60*15
      const Date_46=new Date()+MIN_46
      const Date_15=new Date()+MIN_15
      
      await CoinController.getCoinByCode(coinCode);

      //check upon reaching 46 min
      sinon.useFakeTimers(new Date(+ Date_46).getTime()); 
      let coin_46min = await CoinController.getCoinByCode(coinCode);
      expect(coin_46min.priceDate.valueOf()).to.approximately(new Date(+ Date_46).valueOf(), 1000);
      
      //check upon reaching 1 hour and 1 minute
      const fakeClock = sinon.useFakeTimers(new Date(+Date_15).getTime()); 
      let coin_1hr = await CoinController.getCoinByCode(coinCode);
      expect(coin_1hr.priceDate.valueOf()).to.approximately(new Date().valueOf(), 1000);

      //restore the original time
      fakeClock.restore();
    });
  });

  describe('putCreateCoin', () => {
    const coinName = 'Bitcoin';
    const coinCode = 'BTC';
    
    it('should throw error if coin is not unique and do not create the coin', async () => {
      await CoinController.putCreateCoin(coinName, coinCode);
      expect(CoinController.putCreateCoin(coinName, coinCode)).to.be.rejectedWith(Error, 'coin_already_exists');
    });

    it('should create new unique coin', async () => {
      const coinName = 'Ripple';
      const coinCode = 'XRP';
      const coin = await CoinController.putCreateCoin(coinName, coinCode);
      expect(coin.code).to.eq(coinCode);
      expect(coin.name).to.eq(coinName);
    });
  });

});
