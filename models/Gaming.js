module.exports = (sequelize, DataTypes) => {
    const Game = sequelize.define('games', {
      owner_id: {
        type: DataTypes.INTEGER
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false
      },
      platform: {
        type: DataTypes.STRING,
        allowNull: false
      },
      rating: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      review: {
        type: DataTypes.STRING,
        allowNull: false
      }
    });
    return Game;
  };


// const sequelize = require("sequelize");

//  module.exports = (sequelize, DataTypes) => {
//      const Games = sequelize.define('games', {
//          owner_id: {
//              type: DataTypes.INTEGER,
//              allowNull: false
//          },
//          title: {
//              type: DataTypes.STRING,
//              allowNull: false
//          },
//          platform: {
//              type: DataTypes.STRING,
//              allowNull: false
//          },
//          rating: {
//              type: DataTypes.STRING,
//              allowNull: false
//          },
//          review: {
//              type: DataTypes.STRING,
//              allowNull: false
//          }
//      });
//      return Games;
//  };