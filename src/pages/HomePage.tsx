import { useState } from 'react';
import DownloadSection from '../components/DownloadSection';
import NewsSection from '../components/NewsSection';
import CharacterShowcase from '../components/CharacterShowcase';
import GameFeatures from '../components/GameFeatures';
import DragonBallSnake from '../components/DragonBallSnake';
import RankingSection from '../components/RankingSection';

const HomePage = () => {
  return (
    <div className="">
      
      <DownloadSection />
      <NewsSection />
      <RankingSection />
      <CharacterShowcase />
      <GameFeatures />
     
    </div>
  );
};

export default HomePage;
