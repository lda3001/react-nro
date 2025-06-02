import React, { useState, useEffect } from 'react';
import { rankingAPI } from '../services/api';

interface RankingPlayer {
  rank: number;
  name: string;
  score: number;
  level: number;
  power?: number;
  eventPoints?: number;
  rechargeAmount?: number;
  taskPoints?: number;
}

interface RankingResponse {
    success: boolean;
    message: string;
    data: RankingPlayer[];
}

const RankingSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'power' | 'recharge' | 'event' | 'task' >('power');

  // Mock data for different ranking types
//   const powerRankingData: RankingPlayer[] = [
//     { rank: 1, name: "Goku", score: 10000, level: 99, power: 1500000 },
//     { rank: 2, name: "Vegeta", score: 9500, level: 98, power: 1450000 },
//     { rank: 3, name: "Gohan", score: 9000, level: 97, power: 1400000 },
//     { rank: 4, name: "Piccolo", score: 8500, level: 96, power: 1350000 },
//     { rank: 5, name: "Trunks", score: 8000, level: 95, power: 1300000 },
//   ];
  const [powerRankingData, setPowerRankingData] = useState<RankingPlayer[]>([]);
  const [rechargeRankingData, setRechargeRankingData] = useState<RankingPlayer[]>([]);
  const [eventRankingData, setEventRankingData] = useState<RankingPlayer[]>([]);
  const [taskRankingData, setTaskRankingData] = useState<RankingPlayer[]>([]);

  useEffect(() => {
    const fetchRankingData = async () => {
      try {
        switch (activeTab) {
          case 'power':
            const powerResponse = await rankingAPI.getPowerRanking() as RankingResponse;
            setPowerRankingData(powerResponse.data);
            break;
          case 'recharge':
            const rechargeResponse = await rankingAPI.getRechargeRanking() as RankingResponse;
            setRechargeRankingData(rechargeResponse.data);
            break;
          case 'event':
            const eventResponse = await rankingAPI.getEventRanking() as RankingResponse;
            setEventRankingData(eventResponse.data);
            break;
          case 'task':
            const taskResponse = await rankingAPI.getTaskRanking() as RankingResponse;
            setTaskRankingData(taskResponse.data);
            break;
        }
      } catch (error) {
        console.error(`Error fetching ${activeTab} ranking data:`, error);
      }
    };
    
    fetchRankingData();
  }, [activeTab]);
  

//   const rechargeRankingData: RankingPlayer[] = [
//     { rank: 1, name: "Whis", score: 10000, level: 99, rechargeAmount: 5000000 },
//     { rank: 2, name: "Beerus", score: 9500, level: 98, rechargeAmount: 4500000 },
//     { rank: 3, name: "Champa", score: 9000, level: 97, rechargeAmount: 4000000 },
//     { rank: 4, name: "Vados", score: 8500, level: 96, rechargeAmount: 3500000 },
//     { rank: 5, name: "Zeno", score: 8000, level: 95, rechargeAmount: 3000000 },
//   ];

    // const eventRankingData: RankingPlayer[] = [
    //     { rank: 1, name: "Goku", score: 10000, level: 99, eventPoints: 50000 },
    //     { rank: 2, name: "Vegeta", score: 9500, level: 98, eventPoints: 45000 },
    //     { rank: 3, name: "Gohan", score: 9000, level: 97, eventPoints: 40000 },
    //     { rank: 4, name: "Piccolo", score: 8500, level: 96, eventPoints: 35000 },
    //     { rank: 5, name: "Trunks", score: 8000, level: 95, eventPoints: 30000 },
    // ];

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1:
        return 'bg-yellow-400 text-yellow-900';
      case 2:
        return 'bg-gray-300 text-gray-700';
      case 3:
        return 'bg-amber-600 text-amber-100';
      default:
        return 'bg-blue-100 text-blue-900';
    }
  };

  const getCurrentRankingData = () => {
    switch (activeTab) {
      case 'power':
        return powerRankingData;
      case 'recharge':
        return rechargeRankingData;
      case 'event':
        return eventRankingData;
      case 'task':
        return taskRankingData;
    }
  };

  const getColumnHeaders = () => {
    switch (activeTab) {
      case 'power':
        return ['Hạng', 'Tên', 'Sức Mạnh'];
      case 'recharge':
        return ['Hạng', 'Tên', 'Số Tiền Nạp'];
      case 'event':
        return ['Hạng', 'Tên', 'Điểm Sự Kiện'];
      case 'task':
        return ['Hạng', 'Tên', 'Nhiệm Vụ'];
    }
  };

  const getValueDisplay = (player: RankingPlayer) => {
    switch (activeTab) {
      case 'power':
        return `${player.power?.toLocaleString()} `;
      case 'recharge':
        return `${player.rechargeAmount?.toLocaleString()} VNĐ`;
      case 'event':
        return `${player.eventPoints?.toLocaleString()} Điểm`;
      case 'task':
        return `${player.taskPoints?.toLocaleString()} `;
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 bg-gradient-to-b  rounded-lg overflow-hidden shadow-lg">
      <div className="max-w-4xl p-4 mx-auto">
        <h2 className="text-4xl font-bold text-center mb-2 text-orange-600">Bảng Xếp Hạng</h2>
        <p className="text-center text-gray-600 mb-8">Top những người chơi mạnh nhất</p>

        {/* Tabs */}
        <div className="flex justify-center space-x-4 mb-8">
          <button
            onClick={() => setActiveTab('power')}
            className={`px-6 py-3 rounded-full font-bold transition-all duration-300 ${
              activeTab === 'power'
                ? 'bg-orange-500 text-white transform scale-105'
                : 'bg-white text-gray-600 hover:bg-orange-100'
            }`}
          >
            Top Sức Mạnh
          </button>
          <button
            onClick={() => setActiveTab('recharge')}
            className={`px-6 py-3 rounded-full font-bold transition-all duration-300 ${
              activeTab === 'recharge'
                ? 'bg-orange-500 text-white transform scale-105'
                : 'bg-white text-gray-600 hover:bg-orange-100'
            }`}
          >
            Top Nạp
          </button>
          <button
            onClick={() => setActiveTab('event')}
            className={`px-6 py-3 rounded-full font-bold transition-all duration-300 ${
              activeTab === 'event'
                ? 'bg-orange-500 text-white transform scale-105'
                : 'bg-white text-gray-600 hover:bg-orange-100'
            }`}
          >
            Top Sự Kiện
          </button>
          <button
            onClick={() => setActiveTab('task')}
            className={`px-6 py-3 rounded-full font-bold transition-all duration-300 ${
              activeTab === 'task'
                ? 'bg-orange-500 text-white transform scale-105'
                : 'bg-white text-gray-600 hover:bg-orange-100'
            }`}
          >
            Top Nhiệm Vụ
          </button>
        </div>
        
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden transform hover:scale-[1.01] transition-transform duration-300">
          <div className="bg-gradient-to-r from-orange-500 to-red-600 p-4">
            <div className="grid grid-cols-3 gap-4 text-white font-bold">
              {getColumnHeaders().map((header, index) => (
                <div key={index} className="text-center">{header}</div>
              ))}
            </div>
          </div>
          
          <div className="divide-y divide-gray-200">
            {getCurrentRankingData().map((player) => (
              <div 
                key={player.rank} 
                className="grid grid-cols-3 gap-4 p-4 hover:bg-orange-50 transition-colors duration-200"
              >
                <div className="flex justify-center items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${getRankColor(player.rank)}`}>
                    {player.rank}
                  </div>
                </div>
                <div className="flex items-center justify-center">
                  <span className="font-medium text-gray-800">{player.name}</span>
                </div>
                <div className="flex items-center justify-center">
                  <span className="font-semibold text-orange-600">{getValueDisplay(player)}</span>
                </div>
                {/* <div className="flex items-center justify-center">
                  <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-sm font-medium">
                    Lv.{player.level}
                  </span>
                </div> */}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 text-center">
            
          <button className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-8 rounded-full transition-colors duration-300 transform hover:scale-105" > 
            Xem Thêm
          </button>
        </div>
      </div>
    </div>
  );
};

export default RankingSection; 