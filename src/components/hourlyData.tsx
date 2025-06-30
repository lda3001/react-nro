export function getHourlyData() {
    const data = [];
    const basePrice = 10000.0;
    const now = new Date();
    
    // Tạo dữ liệu cho 24 giờ gần nhất, mỗi giờ 1 nến
    for (let i = 23; i >= 0; i--) {
        const date = new Date(now.getTime() - i * 60 * 60 * 1000);
        const hour = date.getHours();
        
        // Tạo giá ngẫu nhiên dựa trên giờ và base price
        const volatility = 0.1; // 2% biến động
        const trend = Math.sin(hour / 24 * Math.PI) * 0.01; // Xu hướng theo giờ
        const random = (Math.random() - 0.5) * volatility;
        
        const open = basePrice * (1 + trend + random);
        const high = open * (1 + Math.random() * 0.015);
        const low = open * (1 - Math.random() * 0.015);
        const close = open * (1 + (Math.random() - 0.5) * 0.01);
        
        // Volume thay đổi theo giờ (cao hơn vào giờ giao dịch)
        const isTradingHour = hour >= 9 && hour <= 17;
        const baseVolume = isTradingHour ? 2000000 : 500000;
        const volume = baseVolume + Math.random() * baseVolume;
        
        data.push({
            date: date,
            open: parseFloat(open.toFixed(2)),
            high: parseFloat(Math.max(high, open, close).toFixed(2)),
            low: parseFloat(Math.min(low, open, close).toFixed(2)),
            close: parseFloat(close.toFixed(2)),
            volume: Math.floor(volume),
        });
    }
    
    return data;
} 