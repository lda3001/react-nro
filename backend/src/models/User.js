const { DataTypes } = require('sequelize');
const sequelize = require('./index');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    primaryKey: true,
    autoIncrement: true
  },
  username: {
    type: DataTypes.STRING(50),
    allowNull: true,
    defaultValue: '',
    validate: {
      len: {
        args: [5, 12],
        msg: 'Tài khoản phải từ 5 đến 12 ký tự!'
      },
      is: {
        args: /^[a-zA-Z0-9]+$/,
        msg: 'Tài khoản không cho phép ký tự đặc biệt!'
      }
    }
  },
  password: {
    type: DataTypes.STRING(50),
    allowNull: true,
    defaultValue: '',
    validate: {
      len: {
        args: [5, 40],
        msg: 'Mật khẩu phải từ 5 đến 40 ký tự!'
      },
      is: {
        args: /^[a-zA-Z0-9]+$/,
        msg: 'Mật khẩu không cho phép ký tự đặc biệt!'
      }
    }
  },
  character: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: true,
    defaultValue: 0,
    references: {
      model: 'character',
      key: 'id'
    }
  },
  lock: {
    type: DataTypes.TINYINT,
    allowNull: true,
    defaultValue: 0
  },
  role: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 0
  },
  ban: {
    type: DataTypes.TINYINT,
    allowNull: true,
    defaultValue: 0
  },
  online: {
    type: DataTypes.TINYINT,
    allowNull: true,
    defaultValue: 0
  },
  created_at: {
    type: DataTypes.DATE,
    allowNull: true
  },
  updated_at: {
    type: DataTypes.DATE,
    allowNull: true
  },
  sdt: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  vnd: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  tongnap: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  diemtichnap: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  sv_port: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 22345
  },
  logout_time: {
    type: DataTypes.BIGINT,
    allowNull: false,
    defaultValue: 0
  },
  last_ip: {
    type: DataTypes.STRING(24),
    allowNull: true
  },
  is_login: {
    type: DataTypes.TINYINT,
    allowNull: true,
    defaultValue: 0
  },
  ip_register: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  isnewmember: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 1
  },
  mocnap: {
    type: DataTypes.TEXT('long'),
    allowNull: true
  }
}, {
  tableName: 'user',
  timestamps: false, // Tắt tự động tạo created_at và updated_at
  charset: 'utf8mb4',
  collate: 'utf8mb4_unicode_ci',
  indexes: [
    {
      name: 'character',
      fields: ['character']
    }
  ]
});

// Thêm phương thức validate password match
User.validatePasswordMatch = function(password, repassword) {
  if (password !== repassword) {
    throw new Error('Hai mật khẩu không khớp nhau, vui lòng kiểm tra lại!');
  }
  return true;
};

module.exports = User; 