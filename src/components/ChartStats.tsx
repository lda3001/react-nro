import React from 'react';
import './CandlestickChart.css';

interface ChartStatsProps {
  currentPrice: number;
  changePercent: number;
  volume: number;
  high24h: number;
  low24h: number;
}

const ChartStats: React.FC<ChartStatsProps> = ({
  currentPrice,
  changePercent,
  volume,
  high24h,
  low24h
}) => {
  const isPositive = changePercent >= 0;
  
  return (
    <div className="chart-stats">
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-label">Giá hiện tại</div>
          <div className="stat-value price">
            {currentPrice.toLocaleString('vi-VN')} VNĐ
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-label">Thay đổi 1H</div>
          <div className={`stat-value ${isPositive ? 'positive' : 'negative'}`}>
            <span className="change-icon">
              {isPositive ? '↗' : '↘'}
            </span>
            {Math.abs(changePercent).toFixed(2)}%
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-label">Khối lượng 1H</div>
          <div className="stat-value volume">
            {volume.toLocaleString('vi-VN')}
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-label">Cao nhất 24H</div>
          <div className="stat-value high">
            {high24h.toLocaleString('vi-VN')} VNĐ
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-label">Thấp nhất 24H</div>
          <div className="stat-value low">
            {low24h.toLocaleString('vi-VN')} VNĐ
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-label">Trạng thái</div>
          <div className={`stat-value status ${isPositive ? 'bullish' : 'bearish'}`}>
            {isPositive ? '🐉 Tăng trưởng' : '⚡ Điều chỉnh'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChartStats; 