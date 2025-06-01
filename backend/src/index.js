const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const rateLimit = require('express-rate-limit');
const jwt = require('jsonwebtoken');
const path = require('path');
require('dotenv').config();
const sequelize = require('./models/index');
const User = require('./models/User');
const Character = require('./models/Character');
const paymentController = require('./controllers/paymentController');
const postController = require('./controllers/postController');

const app = express();
app.set('trust proxy', 1);

// Cấu hình phục vụ file tĩnh
app.use('/uploads', express.static(path.join(__dirname, '../public/uploads')));
app.use('/images', express.static(path.join(__dirname, '../public/images')));
app.use('/UploadImage', express.static(path.join(__dirname, '../public/UploadImage')));

// JWT Secret Key
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Rate limiting configuration
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 phút
  max: 100, // Giới hạn 100 request mỗi IP trong 15 phút
  message: {
    success: false,
    message: 'Quá nhiều request từ IP này, vui lòng thử lại sau 15 phút!'
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// Rate limiting cho login
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 phút
  max: 10, // Giới hạn 10 lần đăng nhập sai mỗi IP trong 15 phút
  message: {
    success: false,
    message: 'Quá nhiều lần đăng nhập sai, vui lòng thử lại sau 15 phút!'
  }
});

// Áp dụng rate limiting cho tất cả các routes
app.use(limiter);

// Rate limiting riêng cho route đăng ký
const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 giờ
  max: 5, // Giới hạn 5 lần đăng ký mỗi IP trong 1 giờ
  message: {
    success: false,
    message: 'Quá nhiều lần đăng ký từ IP này, vui lòng thử lại sau 1 giờ!'
  }
});

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Sync database
sequelize.sync({ alter: true })
  .then(() => {
    console.log('Database synced');
  })
  .catch((err) => {
    console.error('Error syncing database:', err);
  });

// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the backend API' });
});

// Registration endpoint with specific rate limiting
app.post('/api/register', registerLimiter, async (req, res) => {
  try {
    const { username, password, repassword, ip_register } = req.body;

    // Validate password match
    try {
      User.validatePasswordMatch(password, repassword);
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }

    // Check if username already exists
    const existingUser = await User.findOne({
      where: { username }
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Tài khoản đã tồn tại!'
      });
    }

    // Hash password
   

    // Create new user
    const user = await User.create({
      username,
      password: password,
      ip_register: ip_register || req.ip
    });

    res.status(201).json({
      success: true,
      message: 'Đăng ký thành công!',
      data: {
        id: user.id,
        username: user.username
      }
    });

  } catch (error) {
    // Handle validation errors
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({
        success: false,
        message: error.errors[0].message
      });
    }

    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Có lỗi xảy ra, vui lòng thử lại sau!'
    });
  }
});

// Login endpoint
app.post('/api/login', loginLimiter, async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validate input
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng nhập đầy đủ tên đăng nhập và mật khẩu!'
      });
    }

    // Find user
    const user = await User.findOne({
      where: { username }
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Tên đăng nhập hoặc mật khẩu không đúng!'
      });
    }

    // Check if user is banned
    if (user.ban === 1) {
      return res.status(403).json({
        success: false,
        message: 'Tài khoản của bạn đã bị khóa!'
      });
    }

    // Check if user is locked
    if (user.lock === 1) {
      return res.status(403).json({
        success: false,
        message: 'Tài khoản của bạn đã bị khóa!'
      });
    }

    // Verify password
    
    if (password !== user.password) {
      return res.status(401).json({
        success: false,
        message: 'Tên đăng nhập hoặc mật khẩu không đúng!'
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        id: user.id,
        username: user.username,
        role: user.role
      },
      JWT_SECRET,
      { expiresIn: '3h' }
    );

    // Update user status
    await user.update({
      last_ip: req.ip,
    });

    res.json({
      success: true,
      message: 'Đăng nhập thành công!',
      data: {
        token,
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Có lỗi xảy ra, vui lòng thử lại sau!'
    });
  }
});

// Logout endpoint
app.post('/api/logout', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Không tìm thấy token!'
      });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findByPk(decoded.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy người dùng!'
      });
    }

    // Update user status
    await user.update({
      online: 0,
      is_login: 0,
      logout_time: Date.now()
    });

    res.json({
      success: true,
      message: 'Đăng xuất thành công!'
    });

  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      success: false,
      message: 'Có lỗi xảy ra, vui lòng thử lại sau!'
    });
  }
});

// Example route using Sequelize
// app.get('/api/users', async (req, res) => {
//   try {
//     const users = await User.findAll();
//     res.json(users);
//   } catch (error) {
//     console.error('Error fetching users:', error);
//     res.status(500).json({ error: 'Database error' });
//   }
// });

//get info user base on jwt 
app.get('/api/user', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Không tìm thấy token!'
    });
  }
  //check token is valid
  let decoded;
  try {
    decoded = jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Token không hợp lệ!'
    });
  }
  const user = await User.findByPk(decoded.id);
  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'Không tìm thấy người dùng!'
    });
  }
  let character = await Character.findByPk(user.character);
  if (!character) {
    character = {
      id: 0,
      name: '',
      infochar: ''
    }
  }
    
  
  res.json({
    success: true,
    message: 'Lấy thông tin người dùng thành công!',
    data: {
      id: user.id,
      username: user.username,
      role: user.role,
      vnd: user.vnd,
      character: {
        id: character.id || 0,
        name: character.Name || '',
        infochar: character.InfoChar || '',
      }
    }
  });
});

//change password
app.put('/api/changepassword', async (req, res) => {
  const { oldpassword, newpassword, repassword } = req.body;
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Không tìm thấy token!'  
    });
  }
  const decoded = jwt.verify(token, JWT_SECRET);
  const user = await User.findByPk(decoded.id);
  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'Không tìm thấy người dùng!' 
    });
  }
  if (oldpassword !== user.password) {
    return res.status(401).json({
      success: false,
      message: 'Mật khẩu cũ không đúng!'    
    });
  }
  if (newpassword !== repassword) {
    return res.status(401).json({
      success: false,
      message: 'Mật khẩu mới không khớp!' 
    });
  }
  try {
    await user.update({
      password: newpassword
    });
  res.json({
    success: true,  
    message: 'Đổi mật khẩu thành công!'
  });
} catch (error) {
  console.error('Change password error:', error);
  res.status(500).json({
    success: false,   
    message: 'Có lỗi xảy ra, vui lòng thử lại sau!'
  });
}
});

// Payment routes
app.get('/api/payment/initiate', async (req, res) => {
  try {
    await paymentController.initiatePayment(req, res);
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Token không hợp lệ!'
    });
  }
});

app.get('/api/payment/verify/:transactionId', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Không tìm thấy token!'
    });
  }

  try {
    jwt.verify(token, JWT_SECRET);
    await paymentController.verifyPayment(req, res);
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Token không hợp lệ!'
    });
  }
});

// Post routes
app.get('/api/posts', async (req, res) => {
  try {
    await postController.getPosts(req, res);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Có lỗi xảy ra, vui lòng thử lại sau!'
    });
  }
});

app.get('/api/posts/:id', async (req, res) => {
  try {
    await postController.getPostDetail(req, res);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Có lỗi xảy ra, vui lòng thử lại sau!'
    });
  }
});

// Add new post creation route with admin authentication
app.post('/api/posts', async (req, res) => {
  try {
    // Check if user is admin
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Không tìm thấy token!'
      });
    }
    jwt.verify(token, JWT_SECRET);
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findByPk(decoded.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy người dùng!' 
      });
    }


    if (user.role !== 1) {
      return res.status(403).json({
        success: false,
        message: 'Bạn không có quyền thực hiện chức năng này!'
      });
    }
    req.user = user;
    await postController.createPost(req, res);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Có lỗi xảy ra, vui lòng thử lại sau!'
    });
  }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 