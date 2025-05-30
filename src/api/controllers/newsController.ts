import { Request, Response } from 'express';
import News, { INews } from '../models/News';

// Mock data for news - would be stored in database in a real app
const newsMockData: INews[] = [
  {
    title: 'HƯỚNG DẪN TẢI GAME CHO IPHONE',
    category: 'Tin tức',
    content: 'Bước 1: Sau khi download file về, ae vào cài đặt -> cài đặt chung. Bước 2: Chọn Quản lý VPN & Thiết bị...',
    link: '/huong-dan-tai-game-cho-iphone',
    published: new Date('2025-05-15'),
  },
  {
    title: 'Đã có bản mới chính thức, ae tải game đi nhé',
    category: 'Tin tức',
    content: 'Thông báo đã có bản cập nhật mới nhất cho game Bảy Viên Ngọc Rồng...',
    link: '/da-co-ban-moi-chinh-thuc',
    published: new Date('2025-05-10'),
  },
  {
    title: 'BÁO LỖI',
    category: 'Tin tức',
    content: 'Nếu gặp lỗi trong quá trình chơi game, vui lòng báo cáo tại đây...',
    link: '/bao-loi',
    published: new Date('2025-05-05'),
  },
  {
    title: 'NHẬN QUÀ TẶNG – GIFTCODE',
    category: 'Tin tức',
    content: 'Nhận giftcode miễn phí khi tham gia sự kiện đặc biệt...',
    link: '/giftcode',
    published: new Date('2025-05-01'),
  },
  {
    title: 'Đua Top Alpha Test',
    category: 'Tin tức',
    content: 'Tham gia đua top trong giai đoạn Alpha Test để nhận phần thưởng giá trị...',
    link: '/dua-top-alpha-test',
    published: new Date('2025-04-25'),
  },
  {
    title: 'Fanpage + Group Facebook',
    category: 'Tin tức',
    content: 'Tham gia cộng đồng Facebook để cập nhật thông tin mới nhất về game...',
    link: '/fanpage-group-facebook',
    published: new Date('2025-04-20'),
  },
  {
    title: 'Sự kiện mùa hè 2025',
    category: 'Sự kiện',
    content: 'Tham gia sự kiện mùa hè 2025 với nhiều phần thưởng hấp dẫn...',
    link: '/su-kien-mua-he',
    published: new Date('2025-06-01'),
  },
  {
    title: 'Đua top nhận thưởng',
    category: 'Sự kiện',
    content: 'Tham gia đua top để nhận thưởng giá trị từ ngày 01/06 đến 15/06...',
    link: '/dua-top-nhan-thuong',
    published: new Date('2025-06-01'),
  },
  {
    title: 'Tính năng mới: Săn Boss thế giới',
    category: 'Tính năng',
    content: 'Giới thiệu tính năng săn Boss thế giới mới trong game...',
    link: '/tinh-nang-san-boss',
    published: new Date('2025-05-20'),
  },
  {
    title: 'Cập nhật kỹ năng mới',
    category: 'Tính năng',
    content: 'Cập nhật các kỹ năng mới cho nhân vật trong game...',
    link: '/cap-nhat-ky-nang',
    published: new Date('2025-05-18'),
  },
];

// Get all news
export const getAllNews = async (req: Request, res: Response) => {
  try {
    // In a real app, this would fetch from database
    // const news = await News.find().sort({ published: -1 });

    res.status(200).json(newsMockData);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch news', error });
  }
};

// Get news by category
export const getNewsByCategory = async (req: Request, res: Response) => {
  try {
    const { category } = req.params;

    // In a real app, this would fetch from database
    // const news = await News.find({ category }).sort({ published: -1 });

    const news = newsMockData.filter(
      item => item.category.toLowerCase() === category.toLowerCase()
    );

    res.status(200).json(news);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch news by category', error });
  }
};

// Get news by ID
export const getNewsById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // In a real app, this would fetch from database
    // const news = await News.findById(id);

    const news = newsMockData.find((item, index) => index === parseInt(id));

    if (!news) {
      return res.status(404).json({ message: 'News not found' });
    }

    res.status(200).json(news);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch news by ID', error });
  }
};

// Add a new news item (would be protected by auth in real app)
export const addNews = async (req: Request, res: Response) => {
  try {
    const { title, category, content, link } = req.body;

    // In a real app, this would save to database
    // const news = new News({ title, category, content, link });
    // await news.save();

    const news = {
      title,
      category,
      content,
      link,
      published: new Date(),
    };

    res.status(201).json(news);
  } catch (error) {
    res.status(500).json({ message: 'Failed to add news', error });
  }
};
