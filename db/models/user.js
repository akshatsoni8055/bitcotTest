'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  User.init({
    uid: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false
    },
    password: {
      type: DataTypes.STRING
    },
    token: {
      type: DataTypes.STRING
    },
    displayname: {
      type: DataTypes.STRING
    },
    pic: {
      type: DataTypes.STRING
    },
  }, {
    sequelize,
    modelName: 'User',
    tableName: 'users'
  });
  return User;
};