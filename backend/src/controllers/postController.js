const { DataTypes } = require('sequelize');
const sequelize = require('../models/index');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure multer for image upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = 'public/uploads';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!allowedTypes.includes(file.mimetype)) {
      return cb(new Error('Chỉ chấp nhận file ảnh (JPEG, PNG, GIF)'));
    }
    cb(null, true);
  },
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
}).single('image_post');

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
    type: DataTypes.TEXT,
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

class PostController {
  async getPosts(req, res) {
    try {
      const { page = 1, limit = 5, typePost } = req.query;
      const offset = (page - 1) * limit;

      // Build where clause
      const whereClause = {};
      whereClause.account_id = 1;
      if (typePost) {
        whereClause.typePost = typePost;
      }

      // Get posts with pagination
      const posts = await PostQuestion.findAndCountAll({
        where: whereClause,
        order: [['created', 'DESC']],
        limit: parseInt(limit),
        offset: parseInt(offset)
      });

      res.json({
        success: true,
        message: 'Lấy danh sách bài viết thành công!',
        data: {
          posts: posts.rows,
          total: posts.count,
          currentPage: parseInt(page),
          totalPages: Math.ceil(posts.count / limit)
        }
      });

    } catch (error) {
      console.error('Get posts error:', error);
      res.status(500).json({
        success: false,
        message: 'Có lỗi xảy ra, vui lòng thử lại sau!'
      });
    }
  }

  async getPostDetail(req, res) {
    try {
      const { id } = req.params;
      
      const post = await PostQuestion.findOne({
        where: {
          question_id: id,
          account_id: 1
        }
      });

      if (!post) {
        return res.status(404).json({
          success: false,
          message: 'Không tìm thấy bài viết!'
        });
      }

      res.json({
        success: true,
        message: 'Lấy thông tin bài viết thành công!',
        data: {
          post
        }
      });

    } catch (error) {
      console.error('Get post detail error:', error);
      res.status(500).json({
        success: false,
        message: 'Có lỗi xảy ra, vui lòng thử lại sau!'
      });
    }
  }

  async createPost(req, res) {
    upload(req, res, async function(err) {
      if (err instanceof multer.MulterError) {
        return res.status(400).json({
          success: false,
          message: err.message
        });
      } else if (err) {
        return res.status(400).json({
          success: false,
          message: err.message
        });
      }

      try {
        const { title, content, typePost } = req.body;
        const image_post = req.file ? `/uploads/${req.file.filename}` : null;

        if (!image_post) {
          return res.status(400).json({
            success: false,
            message: 'Vui lòng tải lên hình ảnh!'
          });
        }
        

        const post = await PostQuestion.create({
          title,
          content,
          typePost,
          image_post,
          account_id: req.user.id // Assuming you have user info in req.user
        });

        res.status(201).json({
          success: true,
          message: 'Đăng bài thành công!',
          data: {
            post
          }
        });

      } catch (error) {
        console.error('Create post error:', error);
        res.status(500).json({
          success: false,
          message: 'Có lỗi xảy ra, vui lòng thử lại sau!'
        });
      }
    });
  }
}

module.exports = new PostController(); 