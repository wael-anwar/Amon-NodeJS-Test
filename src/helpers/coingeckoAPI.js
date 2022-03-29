const superagent = require('superagent');

/**
 * @api {get} / Get coinPrice
 * @apiName coinPrice
 * @apiGroup Coin
 * @apiDescription Get coin price in USD from coinGecko API (https://api.coingecko.com/api/v3/coins/:id)
 *
 * @apiSampleRequest /
 *
 */
module.exports.getCoinPrice = async function (coinName) {
  
    const cryptoCoin= await superagent.get('https://api.coingecko.com/api/v3/coins/'+coinName.toLowerCase());
    return cryptoCoin.body["market_data"]["current_price"]["usd"];
};