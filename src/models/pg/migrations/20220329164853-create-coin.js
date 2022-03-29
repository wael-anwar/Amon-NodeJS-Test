'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Coins', 'price', {
      type: Sequelize.DECIMAL,
    });

    await queryInterface.addColumn('Coins', 'priceDate', {
      type: Sequelize.DATE,
    });

  },
  async down(queryInterface) {
    await queryInterface.removeColumn('Coins', 'price');
    await queryInterface.removeColumn('Coins', 'priceDate');
  },
};