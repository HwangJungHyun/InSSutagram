const Sequelize = require('sequelize');

module.exports = class Img extends Sequelize.Model {
  static init(sequelize) {
    return super.init({
      img: {
        type: Sequelize.STRING(200),
        allowNull: true,
      },
    }, {
      sequelize,
      timestamps: true,
      underscored: false,
      modelName: 'Img',
      tableName: 'imgs',
      paranoid: false,
      charset: 'utf8mb4',
      collate: 'utf8mb4_general_ci',
    });
  }

  static associate(db) {
    db.Post.belongsTo(db.Post);
  }
};