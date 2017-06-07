'use strict';

module.exports = {
    up: function (migration, Sequelize) {
        return migration.createTable('messages', {
          id: {
        		type: Sequelize.INTEGER,
        		primaryKey: true,
        		autoIncrement: true,
        		allowNull: false
        	},
        	content: {
        		type: Sequelize.TEXT,
        		allowNull: false
        	},
        	topic_id: {
        			type: Sequelize.INTEGER,
        			references: {
        					model: 'users',
        					key: 'id'
        			}
        	},
        	topic_username: {
        			type: Sequelize.STRING,
        			references: {
        					model: 'users',
        					key: 'username'
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
        return migration.dropTable('messages');
    }
};
