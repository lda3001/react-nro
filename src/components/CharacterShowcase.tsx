import { useState } from 'react';

// Mock character data - would come from an API in a real app
const characters = [
  {
    id: 1,
    name: 'Son Goku',
    image: 'https://static.wikia.nocookie.net/dragonball/images/5/5b/Goku_4.jpg',
    description: 'The main protagonist of the Dragon Ball series and a Saiyan who was sent to Earth as a baby with the mission to destroy it.',
  },
  {
    id: 2,
    name: 'Vegeta',
    image: 'https://static.wikia.nocookie.net/dragonball/images/6/6a/VegetaItsOver9000-02.png',
    description: 'The prince of the fallen Saiyan race and one of the main characters of the series. He is the eldest son of King Vegeta.',
  },
  {
    id: 3,
    name: 'Broly',
    image: 'https://static.wikia.nocookie.net/dragonball/images/a/a4/Broly_DBS_Artwork.png',
    description: 'A powerful Saiyan warrior with immense strength and power level. He is known as the Legendary Super Saiyan.',
  },
  {
    id: 4,
    name: 'Gohan',
    image: 'https://static.wikia.nocookie.net/dragonball/images/a/ab/GohanSuperSaiyanIINV.png',
    description: 'The elder son of the series\' primary protagonist Goku and his wife Chi-Chi.',
  },
  {
    id: 5,
    name: 'Piccolo',
    image: 'https://static.wikia.nocookie.net/dragonball/images/f/f2/PiccoloVsAndroid17.png',
    description: 'A Namekian who was once Goku\'s enemy but later becomes one of his greatest allies and the mentor of Gohan.',
  },
];

const fallbackCharacterImage =
  'https://upload.wikimedia.org/wikipedia/commons/6/65/No-Image-Placeholder.svg';

const fallbackSkillImage =
  'https://upload.wikimedia.org/wikipedia/commons/6/65/No-Image-Placeholder.svg';

const CharacterShowcase = () => {
  const [selectedCharacter, setSelectedCharacter] = useState<number | null>(null);
  const [imageErrorMap, setImageErrorMap] = useState<{ [id: number]: boolean }>({});
  const [skillImageErrorMap, setSkillImageErrorMap] = useState<{ [idx: number]: boolean }>({});

  const handleCharacterImgError = (id: number) => {
    setImageErrorMap((prev) => ({ ...prev, [id]: true }));
  };

  const handleSkillImgError = (idx: number) => {
    setSkillImageErrorMap((prev) => ({ ...prev, [idx]: true }));
  };

  // Skill images for the preview section
  const skillImages = [
    'https://icons.iconarchive.com/icons/hektakun/dragon-ball/128/Dragon-Ball-Star-1-icon.png',
    'https://icons.iconarchive.com/icons/hektakun/dragon-ball/128/Dragon-Ball-Star-2-icon.png',
    'https://icons.iconarchive.com/icons/hektakun/dragon-ball/128/Dragon-Ball-Star-3-icon.png',
    'https://icons.iconarchive.com/icons/hektakun/dragon-ball/128/Dragon-Ball-Star-4-icon.png',
    'https://icons.iconarchive.com/icons/hektakun/dragon-ball/128/Dragon-Ball-Star-5-icon.png',
    'https://icons.iconarchive.com/icons/hektakun/dragon-ball/128/Dragon-Ball-Star-6-icon.png',
  ];

  // Main character image for the preview section
  const [mainPreviewImgError, setMainPreviewImgError] = useState(false);
  const mainPreviewImg =
    'https://static.wikia.nocookie.net/dragonball/images/8/8b/Super_Saiyan_God_SS_Evolved.png';

  return (
    <section
      className="py-12 bg-gradient-to-r from-[#cc471e] to-[#e1ac31] relative overflow-hidden"
      style={{
        backgroundImage: "url('https://ext.same-assets.com/2307704348/1773558153.png')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div
        className="absolute inset-0 bg-gradient-to-r from-[#cc471e] to-[#e1ac31] opacity-80 z-0"
      ></div>

      <div className="container mx-auto px-4 relative z-10">
        <h2 className="text-center mb-10 text-3xl md:text-4xl font-bold text-white transform -rotate-2 relative">
          <span className="bg-[#2a212e] py-2 px-6 skew-x-[-5deg] inline-block">
            HỆ THỐNG NHÂN VẬT
          </span>
        </h2>

        <div className="flex flex-wrap justify-center gap-4 mb-10">
          {characters.map((character) => (
            <div
              key={character.id}
              className={`character-card transform transition-all cursor-pointer ${
                selectedCharacter === character.id
                  ? 'scale-110 -rotate-3 z-10'
                  : 'hover:scale-105 hover:-rotate-2'
              }`}
              onClick={() =>
                setSelectedCharacter(
                  selectedCharacter === character.id ? null : character.id
                )
              }
            >
              <div className="relative overflow-hidden w-40 h-48 md:w-48 md:h-56 bg-white rounded-lg shadow-lg">
                <div className="absolute inset-0 bg-gradient-to-t from-[#2a212e] to-transparent opacity-60 z-10"></div>
                <img
                  src={
                    imageErrorMap[character.id]
                      ? fallbackCharacterImage
                      : character.image
                  }
                  alt={character.name}
                  className="absolute inset-0 w-full h-full object-cover"
                  onError={() => handleCharacterImgError(character.id)}
                  loading="lazy"
                  draggable={false}
                />
                <div className="absolute bottom-0 left-0 right-0 p-2 text-white z-20">
                  <h3 className="font-bold text-center">{character.name}</h3>
                </div>
              </div>
            </div>
          ))}
        </div>

        {selectedCharacter && (
          <div className="bg-[#2a212e] rounded-lg p-4 max-w-2xl mx-auto text-white">
            <h3 className="text-xl font-bold mb-2">
              {characters.find((c) => c.id === selectedCharacter)?.name}
            </h3>
            <p>
              {characters.find((c) => c.id === selectedCharacter)?.description}
            </p>
          </div>
        )}

        {/* Character Skills Preview */}
        <div className="mt-16 bg-[#2a212e] rounded-lg overflow-hidden max-w-4xl mx-auto shadow-xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
            <div className="bg-blue-800 p-6 flex items-center justify-center">
              <div className="grid grid-cols-3 gap-2">
                {skillImages.map((img, idx) => (
                  <div
                    key={img}
                    className="skill-icon bg-yellow-500 rounded-full w-16 h-16 flex items-center justify-center transform hover:scale-110 transition-transform cursor-pointer"
                  >
                    <img
                      src={skillImageErrorMap[idx] ? fallbackSkillImage : img}
                      alt={`Skill ${idx + 1}`}
                      className="w-12 h-12"
                      onError={() => handleSkillImgError(idx)}
                      loading="lazy"
                      draggable={false}
                    />
                  </div>
                ))}
              </div>
            </div>
            <div className="p-6 flex items-center justify-center">
              <img
                src={mainPreviewImgError ? fallbackCharacterImage : mainPreviewImg}
                alt="Character"
                className="h-64 object-contain transform hover:scale-105 transition-transform"
                onError={() => setMainPreviewImgError(true)}
                loading="lazy"
                draggable={false}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CharacterShowcase;
