'use strict';

module.exports = {
    up: function (migration, Sequelize) {
        return migration.createTable('topics', {
          id: {
        		type: Sequelize.INTEGER,
        		primaryKey: true,
        		autoIncrement: true,
        		allowNull: false
        	},
        	headline: {
        		type: Sequelize.STRING,
        	},
        	user_id: {
        			type: Sequelize.INTEGER,
        			references: {
        					model: 'users',
        					key: 'id'
        			}
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
        return migration.dropTable('topics');
    }
};
