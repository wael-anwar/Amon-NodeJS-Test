const errors = require('../../../helpers/errors');
const Models = require('../../../models/pg');

const CoinController = {
  async getCoinByCode(coinCode) {
    const coin = await Models.Coin.findByCoinCode(coinCode);

    errors.assertExposable(coin, 'unknown_coin_code');

    const ONE_HOUR = 60 * 60 * 1000; 
    const ONE_HOUR_AGO = Date.now() - ONE_HOUR;
    if (coin.priceDate < ONE_HOUR_AGO || !coin.price) 
    {
      const price = await getCoinPrice(coin.name);
      if (price) coin = await Models.Coin.updateCoinPrice(coin, price);
    }
    return coin.filterKeys();
  },

  async putCreateCoin(name, code) {
    let coin = await Models.Coin.findByCoinCode(code);
    errors.assertExposable(!coin, 'coin_already_exists');

    coin = await Models.Coin.putCreateCoin(name, code);
    return coin.filterKeys();
  },
};

module.exports = CoinController;
