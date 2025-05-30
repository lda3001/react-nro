import { useState } from 'react';

// Mock game features - in a real app, would come from an API
const gameFeatures = [
  {
    id: 1,
    title: 'SIÊU PHẨM DRAGON BALL',
    description: 'Trải nghiệm trò chơi Dragon Ball chất lượng cao với đồ họa tuyệt đẹp và gameplay hấp dẫn.',
    image: '/images/banners/12-1.png',
    skill: '/images/skills/gif_gif_Saiyain_VIP.gif',
  },
  {
    id: 2,
    title: 'SĂN BOSS THẢ GA',
    description: 'Săn lùng và đánh bại các boss thế giới mạnh mẽ để nhận các phần thưởng quý giá.',
    image: '/images/banners/14-1.png',
     skill: '/images/skills/gif_supber_kame_VIP.gif',
  },
  {
    id: 3,
    title: 'THÚ CƯỚI ĐA DẠNG ',
    description: 'Thú cưỡi là một trong những tính năng hấp dẫn của game, với nhiều loại thú cưỡi khác nhau, mỗi loại đều có các kỹ năng và đặc điểm riêng biệt.',
    image: '/images/banners/7-1.png',
    skill: '/images/skills/gif_maphongba_VIP.gif',
  },
];

const fallbackImage = 'https://upload.wikimedia.org/wikipedia/commons/6/65/No-Image-Placeholder.svg';
const fallbackCharacterImage = 'https://upload.wikimedia.org/wikipedia/commons/6/65/No-Image-Placeholder.svg';

const GameFeatures = () => {
  const [currentFeature, setCurrentFeature] = useState(0);
  const [imageError, setImageError] = useState(false);
  const [characterImageError, setCharacterImageError] = useState(false);

  const nextFeature = () => {
    setCurrentFeature((prev) => (prev + 1) % gameFeatures.length);
    setImageError(false); // Reset error state when changing features
    setCharacterImageError(false);
  };

  const prevFeature = () => {
    setCurrentFeature((prev) => (prev - 1 + gameFeatures.length) % gameFeatures.length);
    setImageError(false); // Reset error state when changing features
    setCharacterImageError(false);
  };

  const handleImageError = () => {
    setImageError(true);
  };

  const handleCharacterImageError = () => {
    setCharacterImageError(true);
  };

  return (
    <section className="py-12 relative overflow-hidden">
      <div className="container mx-auto px-4">
        <h2 className="text-center mb-10 text-3xl md:text-4xl font-bold text-[#2a212e] transform -rotate-2 relative">
          <span className="bg-[#e1ac31] py-2 px-6 skew-x-[-5deg] inline-block">
            TÍNH NĂNG ĐẶC SẮC
          </span>
        </h2>

        <div className="relative max-w-4xl mx-auto">
          {/* Navigation arrows */}
          <button
            onClick={prevFeature}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-[#e1ac31] text-black rounded-full w-10 h-10 flex items-center justify-center hover:bg-[#cc471e] hover:text-white transition-colors"
            aria-label="Previous feature"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <button
            onClick={nextFeature}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-[#e1ac31] text-black rounded-full w-10 h-10 flex items-center justify-center hover:bg-[#cc471e] hover:text-white transition-colors"
            aria-label="Next feature"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Feature Showcase */}
          <div className="bg-[#2a212e] rounded-lg overflow-hidden shadow-xl">
            <div className="relative">
              <div className="overflow-hidden">
                <img
                  src={imageError ? fallbackImage : gameFeatures[currentFeature].image}
                  alt={gameFeatures[currentFeature].title}
                  className="w-full h-64 md:h-80 object-cover transform hover:scale-105 transition-transform duration-1000"
                  onError={handleImageError}
                  loading="lazy"
                />
              </div>

              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black to-transparent">
                <div className="flex items-end">
                  <div className="mr-4">
                    <img
                      src={
                        characterImageError
                          ? fallbackCharacterImage
                          : gameFeatures[currentFeature].skill
                      }
                      alt="Character"
                      className="h-24 w-auto transform hover:scale-110 transition-transform"
                      onError={handleCharacterImageError}
                      loading="lazy"
                    />
                  </div>
                  <div>
                    <h3 className="text-[#e1ac31] text-xl md:text-2xl font-bold drop-shadow-lg">
                      {gameFeatures[currentFeature].title}
                    </h3>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 text-white">
              <p>{gameFeatures[currentFeature].description}</p>
            </div>
          </div>

          {/* Feature indicators */}
          <div className="flex justify-center mt-4 space-x-2">
            {gameFeatures.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setCurrentFeature(index);
                  setImageError(false);
                  setCharacterImageError(false);
                }}
                className={`w-3 h-3 rounded-full ${
                  index === currentFeature ? 'bg-[#cc471e]' : 'bg-gray-300'
                }`}
                aria-label={`Go to feature ${index + 1}`}
              ></button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default GameFeatures;
