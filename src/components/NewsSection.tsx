import { useState, useEffect } from 'react';

interface NewsItem {
  title: string;
  category: string;
  link: string;
  content: string;
  published: string;
}

const NewsSection = () => {
  const [activeTab, setActiveTab] = useState('moi-nhat');
  const [newsData, setNewsData] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        // In a real implementation, this would be a fetch from the API
        // For now, we'll use our mock data
        // const response = await fetch('/api/news');
        // const data = await response.json();

        // Using our mock data directly for now
        const mockData = [
          {
            title: 'HƯỚNG DẪN TẢI GAME CHO IPHONE',
            category: 'Tin tức',
            content: 'Bước 1: Sau khi download file về, ae vào cài đặt -> cài đặt chung...',
            link: '/huong-dan-tai-game-cho-iphone',
            published: new Date('2025-05-15').toISOString(),
          },
          {
            title: 'Đã có bản mới chính thức, ae tải game đi nhé',
            category: 'Tin tức',
            content: 'Thông báo đã có bản cập nhật mới nhất cho game Bảy Viên Ngọc Rồng...',
            link: '/da-co-ban-moi-chinh-thuc',
            published: new Date('2025-05-10').toISOString(),
          },
          {
            title: 'BÁO LỖI',
            category: 'Tin tức',
            content: 'Nếu gặp lỗi trong quá trình chơi game, vui lòng báo cáo tại đây...',
            link: '/bao-loi',
            published: new Date('2025-05-05').toISOString(),
          },
          {
            title: 'NHẬN QUÀ TẶNG – GIFTCODE',
            category: 'Tin tức',
            content: 'Nhận giftcode miễn phí khi tham gia sự kiện đặc biệt...',
            link: '/giftcode',
            published: new Date('2025-05-01').toISOString(),
          },
          {
            title: 'Đua Top Alpha Test',
            category: 'Tin tức',
            content: 'Tham gia đua top trong giai đoạn Alpha Test để nhận phần thưởng giá trị...',
            link: '/dua-top-alpha-test',
            published: new Date('2025-04-25').toISOString(),
          },
          {
            title: 'Fanpage + Group Facebook',
            category: 'Tin tức',
            content: 'Tham gia cộng đồng Facebook để cập nhật thông tin mới nhất về game...',
            link: '/fanpage-group-facebook',
            published: new Date('2025-04-20').toISOString(),
          },
          {
            title: 'Sự kiện mùa hè 2025',
            category: 'Sự kiện',
            content: 'Tham gia sự kiện mùa hè 2025 với nhiều phần thưởng hấp dẫn...',
            link: '/su-kien-mua-he',
            published: new Date('2025-06-01').toISOString(),
          },
          {
            title: 'Đua top nhận thưởng',
            category: 'Sự kiện',
            content: 'Tham gia đua top để nhận thưởng giá trị từ ngày 01/06 đến 15/06...',
            link: '/dua-top-nhan-thuong',
            published: new Date('2025-06-01').toISOString(),
          },
          {
            title: 'Tính năng mới: Săn Boss thế giới',
            category: 'Tính năng',
            content: 'Giới thiệu tính năng săn Boss thế giới mới trong game...',
            link: '/tinh-nang-san-boss',
            published: new Date('2025-05-20').toISOString(),
          },
          {
            title: 'Cập nhật kỹ năng mới',
            category: 'Tính năng',
            content: 'Cập nhật các kỹ năng mới cho nhân vật trong game...',
            link: '/cap-nhat-ky-nang',
            published: new Date('2025-05-18').toISOString(),
          },
        ];

        setNewsData(mockData);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch news data');
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  const tabs = [
    { id: 'moi-nhat', name: 'Mới nhất' },
    { id: 'tin-tuc', name: 'Tin tức' },
    { id: 'su-kien', name: 'Sự kiện' },
    { id: 'tinh-nang', name: 'Tính năng' },
  ];

  const filteredNews = () => {
    if (loading) {
      return [];
    }

    if (error) {
      return [];
    }

    if (activeTab === 'moi-nhat') {
      return newsData.slice(0, 8);
    } else if (activeTab === 'tin-tuc') {
      return newsData.filter(item => item.category === 'Tin tức');
    } else if (activeTab === 'su-kien') {
      return newsData.filter(item => item.category === 'Sự kiện');
    } else if (activeTab === 'tinh-nang') {
      return newsData.filter(item => item.category === 'Tính năng');
    }
    return [];
  };

  return (
    <section className="py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Event/News Image */}
          <div className="md:col-span-1 rounded-lg overflow-hidden shadow-lg bg-white">
            <img
              src="https://ext.same-assets.com/2307704348/757491588.png"
              alt="Event Banner"
              className="w-full h-auto"
            />
          </div>

          {/* News Tabs */}
          <div className="md:col-span-2 bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="event-heading bg-gradient-to-r from-[#e1ac31] to-[#cc471e]">
              <ul className="list-none flex border-b-0">
                {tabs.map((tab) => (
                  <li
                    key={tab.id}
                    className={`cursor-pointer ${activeTab === tab.id ? 'bg-[#cc471e]' : ''}`}
                    onClick={() => setActiveTab(tab.id)}
                  >
                    <a
                      href="#"
                      onClick={(e) => e.preventDefault()}
                      className="text-black font-medium px-4 py-3 block hover:bg-opacity-80 transition-colors"
                    >
                      {tab.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-4">
              {loading && (
                <div className="flex justify-center items-center h-40">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#e1ac31]"></div>
                </div>
              )}

              {error && (
                <div className="text-red-500 text-center py-4">
                  {error}
                </div>
              )}

              {!loading && !error && (
                <div className="event-list space-y-3">
                  {filteredNews().map((item, index) => (
                    <div key={index} className="item border-b border-gray-200 pb-2 flex">
                      <div className="item-news bg-[#e1ac31] text-black px-3 py-1 mr-4 self-start whitespace-nowrap">
                        {item.category}
                      </div>
                      <div className="item-text">
                        <a
                          href={item.link}
                          className="hover:text-[#cc471e] transition-colors text-gray-800"
                        >
                          {item.title}
                        </a>
                      </div>
                    </div>
                  ))}

                  {filteredNews().length === 0 && (
                    <div className="text-center py-4 text-gray-500">
                      Không có dữ liệu để hiển thị
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewsSection;
