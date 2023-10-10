const { Model, DataTypes } = require('sequelize');

const sequelize = require('../config/connection');

// ProductTag model
class ProductTag extends Model {}

// Set up fields and rules for ProductTag model
ProductTag.init(
  {
    // Define primary key ID
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    // Define product_id field with foreign key that refers to Product model
    product_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'product',
        key: 'id',
      },
    },
    // Define tag_id field with foreign key that refers to Tag model
    tag_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'tag',
        key: 'id',
      },
    },
  },
  {
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: 'product_tag',
  }
);

module.exports = ProductTag;
