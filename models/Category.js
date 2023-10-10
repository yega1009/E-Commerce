const { Model, DataTypes } = require('sequelize');

const sequelize = require('../config/connection.js');

// Category model
class Category extends Model {}

// Initialize Category model with schema
Category.init(
  {
    // Define primary key ID and category_name field
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    category_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: 'category',
  }
);

// Export Category model
module.exports = Category;
