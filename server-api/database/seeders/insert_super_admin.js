'use strict';
const uuid_generated = '8f715243-d425-45c1-896f-25a3977394d4';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.bulkInsert('user', [{
          id: uuid_generated,
          username: 'root',
          email: "root@mail.com",
          password: "$2b$10$yPZXLorxI7A7TsbuOMlIxOA4sLjTtAo9UZIi7L4ykqFDDniZY6OF.",
          isActive: true,
          updatedAt: new Date(),
          createdAt: new Date(),

        }], { transaction: t }),
      ])
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('user', {
      username: 'root'
    })
  }
};
