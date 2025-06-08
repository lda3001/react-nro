import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import AdminPostForm from '../components/AdminPostForm';

const AdminPostPage = () => {
  const { user } = useAuth();

  if (!user || user.role !== 1) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[calc(100vh-700px)]">
        <h1 className="text-4xl font-bold">403 - Forbidden</h1>
        <p className="text-2xl">You are not authorized to access this page.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <AdminPostForm />
    </div>
  );
};

export default AdminPostPage; 