import { useState } from 'react';
import DownloadSection from '../components/DownloadSection';
import NewsSection from '../components/NewsSection';
import CharacterShowcase from '../components/CharacterShowcase';
import GameFeatures from '../components/GameFeatures';

const HomePage = () => {
  return (
    <div className="">
      <DownloadSection />
      <NewsSection />
      <CharacterShowcase />
      <GameFeatures />
    </div>
  );
};

export default HomePage;
