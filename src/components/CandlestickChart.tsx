import React, { useState, useEffect } from "react";
import { AgFinancialCharts } from "ag-charts-react";
import { AgFinancialChartOptions } from "ag-charts-enterprise";
import "ag-charts-enterprise";
import { getHourlyData } from "./hourlyData";
import "./CandlestickChart.css";
import ChartStats from "./ChartStats";

const CandlestickChart = () => {
  const HOUR = 60 * 60 * 1000;
  const [options, setOptions] = useState<AgFinancialChartOptions>({
    data: getHourlyData(),
    toolbar: false,
    height: 600,
    theme: {
      overrides: {
        common: {
          title: {
            color: '#e1ac31'
          },
          ranges: {
            enabled: true,
            buttons: [
              {
                label: "1H",
                value: 1 * HOUR,
              },
              {
                label: "4H",
                value: 4 * HOUR,
              },
              {
                label: "12H",
                value: 12 * HOUR,
              },
              {
                label: "24H",
                value: 24 * HOUR,
              },
              {
                label: "All Data",
                value: (start, end) => [start, end],
              },
            ],
            
          },

        }
      }
    }
  });

  // Mock data cho stats - trong thực tế sẽ lấy từ API
  const [stats, setStats] = useState({
    currentPrice: 10000.0,
    changePercent: 0.0,
    volume: 0,
    high24h: 10000.0,
    low24h: 10000.0
  });

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setStats(prev => ({
        ...prev,
        currentPrice: prev.currentPrice + (Math.random() - 0.5) * 2,
        changePercent: prev.changePercent + (Math.random() - 0.5) * 0.5,
        volume: prev.volume + Math.floor(Math.random() * 1000000)
      }));
    }, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="container mx-auto p-4">
      <div className="candlestick-chart-container">
        <div className="chart-header">
          <h2 className="chart-title">
            <span role="img" aria-label="chart">📈</span>
            Biểu Đồ Thị Trường Ngọc Rồng
          </h2>
          <p className="chart-subtitle">Theo dõi biến động giá trị trong game theo thời gian thực (1 giờ/nến)</p>
        </div>
        
        <ChartStats 
          currentPrice={stats.currentPrice}
          changePercent={stats.changePercent}
          volume={stats.volume}
          high24h={stats.high24h}
          low24h={stats.low24h}
        />
        
        <div className="chart-container">
          <AgFinancialCharts options={options} />
        </div>
        
        <div className="chart-legend">
          <div className="legend-item">
            <div className="legend-color up"></div>
            <span>Nến tăng (Bullish)</span>
          </div>
          <div className="legend-item">
            <div className="legend-color down"></div>
            <span>Nến giảm (Bearish)</span>
          </div>
          <div className="legend-item">
            <div className="legend-color volume"></div>
            <span>Khối lượng giao dịch</span>
          </div>
          <div className="legend-item">
            <div className="legend-color" style={{ background: '#33b7c2' }}></div>
            <span>Đường xu hướng</span>
          </div>
        </div>
        
        <div className="mt-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#cc471e] to-[#e55a2b] rounded-lg text-white text-sm font-medium">
            <span role="img" aria-label="dragon">🐉</span>
            Dữ liệu được cập nhật theo thời gian thực - 1 nến/giờ
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandlestickChart;

