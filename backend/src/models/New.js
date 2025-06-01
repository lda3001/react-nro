// Sequelize model for post_question table
module.exports = (sequelize, DataTypes) => {
  const PostQuestion = sequelize.define('PostQuestion', {
    question_id: {
      type: DataTypes.BIGINT(20),
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    title: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    content: {
      type: DataTypes.LONGTEXT,
      allowNull: true,
      defaultValue: null
    },
    typePost: {
      type: DataTypes.ENUM('Tin Tức', 'Sự Kiện', 'Tính Năng'),
      allowNull: false,
      defaultValue: 'Tin Tức'
    },
    image_post: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    created: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    STATUS: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      defaultValue: 0
    },
    account_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false
      
    }
  }, {
    tableName: 'post_question',
    timestamps: false,
    collate: 'utf8mb4_unicode_ci'
  });
  return PostQuestion;
};
