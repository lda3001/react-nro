import { Request, Response } from 'express';
import Feature, { IFeature } from '../models/Feature';

// Mock data for features - would be stored in database in a real app
const featuresMockData: IFeature[] = [
  {
    title: 'SIÊU PHẨM DRAGON BALL',
    description: 'Trải nghiệm trò chơi Dragon Ball chất lượng cao với đồ họa tuyệt đẹp và gameplay hấp dẫn.',
    image: 'https://raw.githubusercontent.com/Lormida/DragonBallsPage/main/src/assets/img/game_screenshot.jpg',
    order: 1,
  },
  {
    title: 'CÁC KỸ NĂNG ĐẶC BIỆT',
    description: 'Sử dụng các kỹ năng đặc biệt như Kamehameha, Final Flash và nhiều kỹ năng khác của nhân vật yêu thích của bạn.',
    image: 'https://raw.githubusercontent.com/Lormida/DragonBallsPage/main/src/assets/img/game_screenshot2.jpg',
    order: 2,
  },
  {
    title: 'CHẾ ĐỘ PVP HẤPẪN',
    description: 'Đối đầu với người chơi khác trong chế độ PvP để chứng minh bạn là chiến binh mạnh nhất.',
    image: 'https://raw.githubusercontent.com/Lormida/DragonBallsPage/main/src/assets/img/game_screenshot3.jpg',
    order: 3,
  },
  {
    title: 'HỆ THỐNG NHIỆM VỤ ĐA DẠNG',
    description: 'Tham gia các nhiệm vụ đa dạng để nhận phần thưởng và nâng cấp nhân vật của bạn.',
    image: 'https://raw.githubusercontent.com/Lormida/DragonBallsPage/main/src/assets/img/game_screenshot.jpg',
    order: 4,
  },
  {
    title: 'SĂN BOSS THẾ GIỚI',
    description: 'Săn lùng và đánh bại các boss thế giới mạnh mẽ để nhận các phần thưởng quý giá.',
    image: 'https://raw.githubusercontent.com/Lormida/DragonBallsPage/main/src/assets/img/game_screenshot2.jpg',
    order: 5,
  },
];

// Get all features
export const getAllFeatures = async (req: Request, res: Response) => {
  try {
    // In a real app, this would fetch from database
    // const features = await Feature.find().sort({ order: 1 });

    res.status(200).json(featuresMockData);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch features', error });
  }
};

// Get feature by ID
export const getFeatureById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // In a real app, this would fetch from database
    // const feature = await Feature.findById(id);

    const feature = featuresMockData.find((item, index) => index === parseInt(id));

    if (!feature) {
      return res.status(404).json({ message: 'Feature not found' });
    }

    res.status(200).json(feature);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch feature by ID', error });
  }
};
