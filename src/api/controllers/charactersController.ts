import { Request, Response } from 'express';
import Character, { ICharacter } from '../models/Character';

// Mock data for characters - would be stored in database in a real app
const charactersMockData: ICharacter[] = [
  {
    name: 'Son Goku',
    description: 'The main protagonist of the Dragon Ball series and a Saiyan who was sent to Earth as a baby with the mission to destroy it.',
    image: 'https://raw.githubusercontent.com/Lormida/DragonBallsPage/main/src/assets/img/people/son_goku.png',
    skills: [
      {
        name: 'Kamehameha',
        description: 'A powerful energy blast that is Goku\'s signature move.',
        icon: 'https://icons.iconarchive.com/icons/hektakun/dragon-ball/128/Dragon-Ball-Star-1-icon.png',
      },
      {
        name: 'Spirit Bomb',
        description: 'A powerful attack that draws energy from all living things.',
        icon: 'https://icons.iconarchive.com/icons/hektakun/dragon-ball/128/Dragon-Ball-Star-2-icon.png',
      },
      {
        name: 'Instant Transmission',
        description: 'Allows Goku to teleport instantly to any location.',
        icon: 'https://icons.iconarchive.com/icons/hektakun/dragon-ball/128/Dragon-Ball-Star-3-icon.png',
      },
    ],
  },
  {
    name: 'Vegeta',
    description: 'The prince of the fallen Saiyan race and one of the main characters of the series. He is the eldest son of King Vegeta.',
    image: 'https://raw.githubusercontent.com/Lormida/DragonBallsPage/main/src/assets/img/people/vegeta.png',
    skills: [
      {
        name: 'Final Flash',
        description: 'One of Vegeta\'s most powerful attacks, a devastating energy blast.',
        icon: 'https://icons.iconarchive.com/icons/hektakun/dragon-ball/128/Dragon-Ball-Star-4-icon.png',
      },
      {
        name: 'Galick Gun',
        description: 'A powerful purple energy wave that is one of Vegeta\'s signature moves.',
        icon: 'https://icons.iconarchive.com/icons/hektakun/dragon-ball/128/Dragon-Ball-Star-5-icon.png',
      },
      {
        name: 'Big Bang Attack',
        description: 'A powerful energy sphere that explodes on impact.',
        icon: 'https://icons.iconarchive.com/icons/hektakun/dragon-ball/128/Dragon-Ball-Star-6-icon.png',
      },
    ],
  },
  {
    name: 'Broly',
    description: 'A powerful Saiyan warrior with immense strength and power level. He is known as the Legendary Super Saiyan.',
    image: 'https://raw.githubusercontent.com/Lormida/DragonBallsPage/main/src/assets/img/people/brolly.png',
    skills: [
      {
        name: 'Eraser Cannon',
        description: 'A powerful green energy sphere that is Broly\'s signature attack.',
        icon: 'https://icons.iconarchive.com/icons/hektakun/dragon-ball/128/Dragon-Ball-Star-1-icon.png',
      },
      {
        name: 'Gigantic Meteor',
        description: 'A massive energy attack that can destroy planets.',
        icon: 'https://icons.iconarchive.com/icons/hektakun/dragon-ball/128/Dragon-Ball-Star-2-icon.png',
      },
      {
        name: 'Blaster Meteor',
        description: 'Multiple energy blasts fired in all directions.',
        icon: 'https://icons.iconarchive.com/icons/hektakun/dragon-ball/128/Dragon-Ball-Star-3-icon.png',
      },
    ],
  },
  {
    name: 'Gohan',
    description: 'The elder son of the series\' primary protagonist Goku and his wife Chi-Chi.',
    image: 'https://raw.githubusercontent.com/Lormida/DragonBallsPage/main/src/assets/img/people/gohan.png',
    skills: [
      {
        name: 'Masenko',
        description: 'An energy attack taught to Gohan by Piccolo.',
        icon: 'https://icons.iconarchive.com/icons/hektakun/dragon-ball/128/Dragon-Ball-Star-4-icon.png',
      },
      {
        name: 'Kamehameha',
        description: 'Gohan\'s version of the Kamehameha, taught by his father.',
        icon: 'https://icons.iconarchive.com/icons/hektakun/dragon-ball/128/Dragon-Ball-Star-5-icon.png',
      },
      {
        name: 'Special Beam Cannon',
        description: 'A powerful beam attack learned from Piccolo.',
        icon: 'https://icons.iconarchive.com/icons/hektakun/dragon-ball/128/Dragon-Ball-Star-6-icon.png',
      },
    ],
  },
  {
    name: 'Piccolo',
    description: 'A Namekian who was once Goku\'s enemy but later becomes one of his greatest allies and the mentor of Gohan.',
    image: 'https://raw.githubusercontent.com/Lormida/DragonBallsPage/main/src/assets/img/people/picolo.png',
    skills: [
      {
        name: 'Special Beam Cannon',
        description: 'A powerful concentrated beam that can pierce through most opponents.',
        icon: 'https://icons.iconarchive.com/icons/hektakun/dragon-ball/128/Dragon-Ball-Star-1-icon.png',
      },
      {
        name: 'Hellzone Grenade',
        description: 'Multiple energy spheres that surround the opponent before converging.',
        icon: 'https://icons.iconarchive.com/icons/hektakun/dragon-ball/128/Dragon-Ball-Star-2-icon.png',
      },
      {
        name: 'Light Grenade',
        description: 'A powerful energy sphere that causes a massive explosion.',
        icon: 'https://icons.iconarchive.com/icons/hektakun/dragon-ball/128/Dragon-Ball-Star-3-icon.png',
      },
    ],
  },
];

// Get all characters
export const getAllCharacters = async (req: Request, res: Response) => {
  try {
    // In a real app, this would fetch from database
    // const characters = await Character.find();

    res.status(200).json(charactersMockData);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch characters', error });
  }
};

// Get character by ID
export const getCharacterById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // In a real app, this would fetch from database
    // const character = await Character.findById(id);

    const character = charactersMockData.find((item, index) => index === parseInt(id));

    if (!character) {
      return res.status(404).json({ message: 'Character not found' });
    }

    res.status(200).json(character);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch character by ID', error });
  }
};
