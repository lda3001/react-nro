import { useState, lazy, Suspense } from 'react';
import { useForm } from 'react-hook-form';
import { postAPI } from '../services/api';
import 'react-quill/dist/quill.snow.css';

// Lazy load ReactQuill
const ReactQuill = lazy(() => import('react-quill'));

interface PostFormData {
  title: string;
  content: string;
  typePost: 'Tin Tức' | 'Sự Kiện' | 'Tính Năng';
  image_post: FileList;
}

const AdminPostForm = () => {
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [imagePreview, setImagePreview] = useState<string>('');
  const [content, setContent] = useState('');

  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm<PostFormData>();

  // Quill modules configuration
  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'color': [] }, { 'background': [] }],
      ['link', 'image'],
      ['clean']
    ],
  };

  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike',
    'list', 'bullet',
    'color', 'background',
    'link', 'image'
  ];

  const onSubmit = async (data: PostFormData) => {
    try {
      setError('');
      setSuccess('');

      const formData = new FormData();
      formData.append('title', data.title);
      formData.append('content', content);
      formData.append('typePost', data.typePost);
      formData.append('image_post', data.image_post[0]);

      await postAPI.createPost(formData);
      setSuccess('Đăng bài thành công!');
      reset();
      setContent('');
      setImagePreview('');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Đăng bài thất bại. Vui lòng thử lại.');
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-[#2a212e] p-8 rounded-2xl shadow-2xl border border-[#e1ac31]/20 backdrop-blur-sm">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">Đăng bài mới</h2>
            <p className="text-gray-400">Tạo bài viết mới cho cộng đồng</p>
          </div>
          
          {error && (
            <div className="bg-red-500/10 border border-red-500 text-red-500 p-4 rounded-lg mb-6 animate-fade-in">
              {error}
            </div>
          )}
          
          {success && (
            <div className="bg-green-500/10 border border-green-500 text-green-500 p-4 rounded-lg mb-6 animate-fade-in">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <label className="block text-gray-300 text-sm font-semibold">
                Tiêu đề bài viết
              </label>
              <input
                {...register("title", { required: "Vui lòng nhập tiêu đề" })}
                type="text"
                placeholder="Nhập tiêu đề bài viết..."
                className="w-full px-4 py-3 bg-[#1a1a1a]/50 text-white rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-[#e1ac31] focus:border-transparent transition-all duration-200"
              />
              {errors.title && (
                <p className="text-red-500 text-sm mt-1 animate-fade-in">{errors.title.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="block text-gray-300 text-sm font-semibold">
                Loại bài viết
              </label>
              <select
                {...register("typePost", { required: "Vui lòng chọn loại bài viết" })}
                className="w-full px-4 py-3 bg-[#1a1a1a]/50 text-white rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-[#e1ac31] focus:border-transparent transition-all duration-200"
              >
                <option value="">Chọn loại bài viết...</option>
                <option value="Tin Tức">Tin Tức</option>
                <option value="Sự Kiện">Sự Kiện</option>
                <option value="Tính Năng">Tính Năng</option>
              </select>
              {errors.typePost && (
                <p className="text-red-500 text-sm mt-1 animate-fade-in">{errors.typePost.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="block text-gray-300 text-sm font-semibold">
                Nội dung bài viết
              </label>
              <div className="bg-white rounded-lg overflow-hidden border border-gray-700">
                <Suspense fallback={
                  <div className="h-64 flex items-center justify-center bg-gray-100">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#e1ac31]"></div>
                  </div>
                }>
                    {/* đổi màu chữ mặc định ban đầu thành đen */}
                  <ReactQuill
                    theme="snow"
                    value={content}
                    onChange={setContent}
                    modules={modules}
                    formats={formats}
                    className="h-64 mb-12"
                    placeholder="Nhập nội dung bài viết..."
                  />
                </Suspense>
              </div>
              {!content && (
                <p className="text-red-500 text-sm mt-1 animate-fade-in">Vui lòng nhập nội dung</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="block text-gray-300 text-sm font-semibold">
                Hình ảnh bài viết
              </label>
              <div className="flex items-center space-x-4">
                <label className="flex-1 cursor-pointer">
                  <div className="w-full px-4 py-3 bg-[#1a1a1a]/50 text-white rounded-lg border border-gray-700 hover:bg-[#1a1a1a]/70 transition-all duration-200 flex items-center justify-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Chọn hình ảnh
                  </div>
                  <input
                    {...register("image_post", { 
                      required: "Vui lòng chọn hình ảnh",
                      onChange: handleImageChange
                    })}
                    type="file"
                    accept="image/*"
                    className="hidden"
                  />
                </label>
              </div>
              {errors.image_post && (
                <p className="text-red-500 text-sm mt-1 animate-fade-in">{errors.image_post.message}</p>
              )}
              {imagePreview && (
                <div className="mt-4 relative group">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="max-w-xs rounded-lg shadow-lg transition-transform duration-200 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 rounded-lg"></div>
                </div>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-[#e1ac31] text-black font-bold py-3 px-6 rounded-lg hover:bg-[#d19c21] transform hover:scale-[1.02] transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Đăng bài
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminPostForm; 