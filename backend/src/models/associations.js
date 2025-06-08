const User = require('./User');
const Character = require('./Character');

// Define associations
User.belongsTo(Character, { foreignKey: 'character', targetKey: 'id' });
Character.hasOne(User, { foreignKey: 'character', sourceKey: 'id' });

module.exports = {
  User,
  Character
}; 