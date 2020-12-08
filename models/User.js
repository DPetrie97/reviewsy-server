const sequelize = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('user', {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      // validate: {
      //   is: /^(?=.{1,254}$)(?=.{1,64}@)[-!#$%&'*+/0-9=?A-Z^_`a-z{|}~]+(\.[-!#$%&'*+/0-9=?A-Z^_`a-z{|}~]+)*@[A-Za-z0-9]([A-Za-z0-9-]{0,61}[A-Za-z0-9])?(\.[A-Za-z0-9]([A-Za-z0-9-]{0,61}[A-Za-z0-9])?)*$/
      // }
    },
    passwordhash: {
      type: DataTypes.STRING,
      allowNull: false,
      // validate: { is:  /^(?=.[!@#\$%\^&])|(?=.{5,})*$/ }
    },
    // admin: {
    //   type: DataTypes.BOOLEAN,
    //   allowNull: false
    // }
  });
  return User;
};