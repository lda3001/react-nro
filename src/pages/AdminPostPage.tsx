import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import AdminPostForm from '../components/AdminPostForm';

const AdminPostPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

//   useEffect(() => {
//     // Check if user is admin
//     if (!user || user.role !== 1) {
//       navigate('/');
//     }
//   }, [user, navigate]);

//   if (!user || user.role !== 1) {
//     return null;
//   }

  return (
    <div className="container mx-auto px-4 py-8">
      <AdminPostForm />
    </div>
  );
};

export default AdminPostPage; 