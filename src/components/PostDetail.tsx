import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { postAPI } from '../services/api';
import getImageLink from '../helper/helper';
import { Helmet } from 'react-helmet';


interface PostDetail {
  question_id: number;
  title: string;
  content: string;
  typePost: string;
  image_post: string;
  created: string;
}

const PostDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<PostDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPostDetail = async () => {
      try {
        const response = await postAPI.getPostDetail(Number(id));
        setPost(response.data.post);
        setLoading(false);
      } catch (err) {
        setError('Không thể tải thông tin bài viết');
        setLoading(false);
      }
    };

    if (id) {
      fetchPostDetail();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#e1ac31]"></div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-red-500 text-center">
          {error || 'Không tìm thấy bài viết'}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8" style={{marginTop: '50px', marginBottom: '50px'}}>
        <div className="absolute inset-0 overflow-hidden z-0 opacity-40">
        <div className="absolute top-10 left-10 w-20 h-20 dragonball dragonball-3" style={{ animationDelay: '4.11616s, 2.05808s', animationDuration: '4.547s, 10.5565s', transform: 'scale(0.952235)' }}></div>
        <div className="absolute bottom-20 right-10 w-16 h-16 dragonball dragonball-1" style={{ animationDelay: '4.87931s, 2.43966s', animationDuration: '4.64595s, 13.8452s', transform: 'scale(1.04823)' }}></div>
        <div className="absolute top-1/2 left-1/4 w-12 h-12 dragonball dragonball-6" style={{ animationDelay: '4.71127s, 2.35564s', animationDuration: '4.26746s, 18.8434s', transform: 'scale(1.0465)' }}></div>
        <div className="absolute bottom-1/3 right-1/3 w-24 h-24 dragonball dragonball-2" style={{ animationDelay: '0.394566s, 0.197283s', animationDuration: '2.50368s, 12.1632s', transform: 'scale(0.950889)' }}></div>
        </div>
      <div className="max-w-4xl mx-auto bg-[#2a212e]  rounded-lg shadow-lg overflow-hidden">
        {/* Post Header */}
        <Helmet>
          <title>{post.title}</title>
          <meta name="description" content={post.content} />
          <meta name="keywords" content={post.title} />
          <meta name="author" content="Ngọc Rồng Fun" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <meta name="robots" content="index, follow" />
          <meta name="googlebot" content="index, follow" />
          <meta name="bingbot" content="index, follow" />
          <meta name="yandexbot" content="index, follow" />
          <meta name="og:title" content={post.title} />
          <meta name="og:description" content={post.content} />
        </Helmet>
        <div className="relative">
          <img
            src={getImageLink(post.image_post)}
            alt={post.title}
            className="w-full h-96 object-cover"
          />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-6">
            <div className="text-white">
              <span className="bg-[#e1ac31] text-black px-3 py-1 rounded-full text-sm">
                {post.typePost}
              </span>
              <h1 className="text-3xl font-bold mt-2">{post.title}</h1>
              <p className="text-sm mt-2">
                {new Date(post.created).toLocaleDateString('vi-VN', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
          </div>
        </div>

        {/* Post Content */}
        <div className="p-6" style={{minHeight: '300px'}}>
          <div className="prose max-w-none">
            <div dangerouslySetInnerHTML={{ __html: post.content }} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostDetail; 