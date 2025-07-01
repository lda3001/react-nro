import { useState } from 'react';
import DownloadSection from '../components/DownloadSection';
import NewsSection from '../components/NewsSection';
import CharacterShowcase from '../components/CharacterShowcase';
import GameFeatures from '../components/GameFeatures';
import DragonBallSnake from '../components/DragonBallSnake';
import RankingSection from '../components/RankingSection';
import CandlestickChart from '../components/CandlestickChart';
import { Helmet } from "react-helmet";


const HomePage = () => {
  return (

    <div className="">
      <Helmet>
        <title>Trang Chủ Ngọc Rồng Fun</title>
        <meta name="description" content="Trang Chủ Ngọc Rồng Fun" />
        <meta name="keywords" content="Ngọc Rồng Fun, Ngọc Rồng, Ngọc Rồng Online, Ngọc Rồng Game, Ngọc Rồng Mobile, Ngọc Rồng PC, Ngọc Rồng Web, Ngọc Rồng Browser, Ngọc Rồng Browser Game, Ngọc Rồng Browser Game Online, Ngọc Rồng Browser Game Mobile, Ngọc Rồng Browser Game PC, Ngọc Rồng Browser Game Web" />
        <meta name="author" content="Ngọc Rồng Fun" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="robots" content="index, follow" />
        <meta name="googlebot" content="index, follow" />
        <meta name="bingbot" content="index, follow" />
        <meta name="yandexbot" content="index, follow" />
        <meta name="og:title" content="Trang Chủ Ngọc Rồng Fun" />
        <meta name="og:description" content="Trang Chủ Ngọc Rồng Fun" />
        <meta name="og:image" content="https://ngocrongfun.com/images/logo-main.png" />
        <meta name="og:url" content="https://ngocrongfun.com" />
        <meta name="og:type" content="website" />
        <meta name="og:locale" content="vi_VN" />
        <meta name="og:site_name" content="Ngọc Rồng Fun" />
      </Helmet>
      <DownloadSection />
      <NewsSection />
      <RankingSection />
      <CharacterShowcase />
      <GameFeatures />
      <CandlestickChart />
    </div>
  );
};

export default HomePage;
