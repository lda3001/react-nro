import { useState, useEffect } from 'react';
import { postAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

interface NewsItem {
  question_id: number;
  title: string;
  typePost: string;
  content: string;
  image_post: string;
  created: string;
  STATUS: number;
  account_id: number;
}

interface PostResponse {
  success: boolean;
  message: string;
  data: {
    posts: NewsItem[];
    total: number;
    currentPage: number;
    totalPages: number;
  }
}

const NewsSection = () => {
  const [activeTab, setActiveTab] = useState('moi-nhat');
  const [newsData, setNewsData] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { user } = useAuth();

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        const response = await postAPI.getPosts(currentPage) as PostResponse;
        if (response.success) {
          setNewsData(response.data.posts);
          setTotalPages(response.data.totalPages);
          setCurrentPage(response.data.currentPage);
        } else {
          setError(response.message);
        }
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch news data');
        setLoading(false);
      }
    };

    fetchNews();
  }, [currentPage]);

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    setCurrentPage(1);
  };

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
      return newsData;
    } else if (activeTab === 'tin-tuc') {
      return newsData.filter(item => item.typePost === 'Tin Tức');
    } else if (activeTab === 'su-kien') {
      return newsData.filter(item => item.typePost === 'Sự Kiện');
    } else if (activeTab === 'tinh-nang') {
      return newsData.filter(item => item.typePost === 'Tính Năng');
    }
    return [];
  };

  const handlePageChange = async (page: number) => {
    setCurrentPage(page);
  };

  return (
    <section className="py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Event/News Image */}
          <div className="md:col-span-1 rounded-lg overflow-hidden shadow-lg bg-white">
            <img
              src="https://i.postimg.cc/tJrSDnds/h-h.png"
              alt="Event Banner"
              className="w-full h-full"
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
                    onClick={() => handleTabChange(tab.id)}
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
                {user && user.role === 1 && (
                  <li className="ml-auto">
                    <a href="/admin/post" className="text-black font-medium px-4 py-3 block hover:bg-opacity-80 transition-colors">
                      Đăng Bài
                    </a>
                  </li>
                )}
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
                        {item.typePost}
                      </div>
                      <div className="item-text">
                        <a
                          href={`/news/${item.question_id}`}
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

                  {totalPages > 1 && (
                    <div className="flex justify-end">
                      <div className="flex items-center space-x-2 mt-4">
                        {Array.from({ length: totalPages }, (_, i) => (
                          <button
                            key={i}
                            onClick={() => handlePageChange(i + 1)}
                            className={`px-3 py-1 rounded ${
                              currentPage === i + 1
                                ? 'bg-[#e1ac31] text-black'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            } transition-colors`}
                          >
                            {i + 1}
                          </button>
                        ))}
                      </div>
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
