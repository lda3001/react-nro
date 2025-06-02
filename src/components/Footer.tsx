const Footer = () => {
  return (
    <footer className="bg-[#222] py-6 text-center text-white bottom-0">
      <div className="container mx-auto px-4">
        <div className="mb-4">
          <a
            href="https://www.messenger.com/t/1805752253071501"
            className="text-white hover:text-[#e1ac31] mx-2 transition-colors"
            target="_blank"
            rel="noopener noreferrer"
          >
            Hỗ Trợ
          </a>
          <span className="mx-1">|</span>
          <a
            href="#"
            className="text-white hover:text-[#e1ac31] mx-2 transition-colors"
          >
            Cài Đặt
          </a>
          <span className="mx-1">|</span>
          <a
            href="/dieu-khoan-su-dung"
            className="text-white hover:text-[#e1ac31] mx-2 transition-colors"
          >
            Điều Khoản
          </a>
        </div>
        <p className="mb-2">Bảy Viên Ngọc Rồng 2025</p>
        <p className="text-sm opacity-70">Chơi game quá 180 phút sẽ có hại cho sức khỏe</p>
      </div>
      <audio id="background-music" autoPlay loop>
      <source src="/audio/background-music.mp3" type="audio/mpeg" />
    </audio>
    </footer>
    
    
  );
};

export default Footer;
