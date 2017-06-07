'use strict';

module.exports = {
    up: function (migration, Sequelize) {
        return migration.createTable('users', {
          id: {
        		type: Sequelize.INTEGER,
        		primaryKey: true,
        		autoIncrement: true,
        		allowNull: false
        	},
        	username: {
        		type: Sequelize.STRING,
        		unique: true,
        		allowNull: false
        	},
        	password: {
        		type: Sequelize.STRING,
        		allowNull: false
        	},
            createdAt: {
                type: Sequelize.DATE
            },
            updatedAt: {
                type: Sequelize.DATE
            }
        });
    },

    down: function (migration, Sequelize) {
        return migration.dropTable('users');
    }
};
