const { v4: uuid } = require('uuid');
const { pick } = require('lodash');

module.exports = function (sequelize, DataTypes) {
  const Coin = sequelize.define(
    'Coin',
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: () => uuid(),
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      code: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      price: {
        type: DataTypes.DECIMAL,
      },
      priceDate: {
        type: DataTypes.DATE,
        defaultValue: () => new Date(),
      },
    },
    {
      freezeTableName: true,
      timestamps: true,
    }
  );

  Coin.prototype.filterKeys = function () {
    const obj = this.toObject();
    const filtered = pick(obj, 'id', 'name', 'code');

    return filtered;
  };

  Coin.findByCoinCode = function (code, tOpts = {}) {
    return Coin.findOne(Object.assign({ where: { code } }, tOpts));
  };

  Coin.createCoin = function (name, code, tOpts = {}) {
    return Coin.create(
      {
        name: name,
        code: code,
      }, tOpts);
  };

  Coin.updateCoinPrice = function (coin,price) {
    coin.price = price;
    coin.priceDate = new Date();
    coin.save();
    return coin;
  };


  return Coin;
};
