const Joi = require('joi');
const Router = require('@koa/router');
const CoinController = require('../controllers/coin');
const { validateParams } = require('../../../helpers/validation');

const CoinRouter = {
  schemaGetByCoinCode: Joi.object({
    coinCode: Joi.string().min(3).uppercase().max(5),
  }),

  schemaPutCreateCoin: Joi.object({
    name:Joi.string(),
    code: Joi.string().min(3).uppercase().max(5),
  }),

  async getCoinByCode(ctx) {
    const params = {
      coinCode: ctx.params.coinCode,
    };

    const formattedParams = await validateParams(CoinRouter.schemaGetByCoinCode, params);

    ctx.body = await CoinController.getCoinByCode(formattedParams.coinCode);
  },

  async putCreateCoin(ctx) {
    const params = {
      name: ctx.request.body.name,
      code: ctx.request.body.code,
    };

    const formattedParams = await validateParams(CoinRouter.schemaPutCreateCoin, params);

    ctx.body = await CoinController.putCreateCoin(formattedParams.coinCode);
  },

  router() {
    const router = Router();

    /**
     * @api {get} / Get coinCode
     * @apiName coinCode
     * @apiGroup Coin
     * @apiDescription Get coinCode
     *
     * @apiSampleRequest /
     *
     */
    router.get('/:coinCode', CoinRouter.getCoinByCode);

    /**
     * @api {put} / Put createCoin
     * @apiName createCoin
     * @apiGroup Coin
     * @apiDescription Put createCoin
     *
     * @apiSampleRequest /
     *
     */
      router.put('/createCoin', CoinRouter.putCreateCoin);

    return router;
  },
};

module.exports = CoinRouter;
