import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../contexts/AuthContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DragonBallSnake from './DragonBallSnake';
import { authAPI } from '../services/api';


interface RegisterFormData {
  username: string;
  password: string;
  confirmPassword: string;
  serverId: number;
}

interface LoginFormData {
  username: string;
  password: string;
}

interface DepositFormData {
  amount: number;
}

interface ChangePasswordFormData {
  oldpassword: string;
  newpassword: string;
  repassword: string;
}

type PaymentMethod = 'momo' | 'mbank' | null;

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod>(null);
  const [showQRCode, setShowQRCode] = useState(false);
  const [error, setError] = useState<string>('');
  const [servers, setServers] = useState<Array<{id: number, name: string}>>([]);
  const { login, register, logout, isAuthenticated, user, changePassword } = useAuth();

  const { register: registerForm, handleSubmit: handleRegisterSubmit, formState: { errors: registerErrors }, watch: watchRegister, reset: resetRegisterForm } = useForm<RegisterFormData>();
  const { register: loginForm, handleSubmit: handleLoginSubmit, formState: { errors: loginErrors }, reset: resetLoginForm } = useForm<LoginFormData>();
  const { register: depositForm, handleSubmit: handleDepositSubmit, formState: { errors: depositErrors }, watch: watchDeposit, reset: resetDepositForm } = useForm<DepositFormData>();
  const { register: changePasswordForm, handleSubmit: handleChangePasswordSubmit, formState: { errors: changePasswordErrors }, watch: watchChangePassword, reset: resetChangePasswordForm } = useForm<ChangePasswordFormData>();
  const password = watchRegister("password");
  const newPassword = watchChangePassword("newpassword");

  // Fetch servers when register modal opens
  useEffect(() => {
    if (isRegisterModalOpen) {
      fetchServers();
    }
  }, [isRegisterModalOpen]);

  const fetchServers = async () => {
    try {
      const response = await authAPI.getListServer() as any;
      if (response.success) {
        setServers(response.data);
      }
    } catch (error) {
      console.error('Error fetching servers:', error);
    }
  };

  const onRegisterSubmit = async (data: RegisterFormData) => {
    try {
      setError('');
      await register(data.username, data.password, data.confirmPassword, data.serverId);
      setIsRegisterModalOpen(false);
      resetRegisterForm();
      toast.success('Đăng ký thành công!', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Đăng ký thất bại. Vui lòng thử lại.');
    }
  };

  const onLoginSubmit = async (data: LoginFormData) => {
    try {
      setError('');
      await login(data.username, data.password);
      setIsLoginModalOpen(false);
      resetLoginForm();
      toast.success('Đăng nhập thành công!', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
      });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Đăng nhập thất bại. Vui lòng thử lại.');
    }
  };

  const onChangePasswordSubmit = async (data: ChangePasswordFormData) => {
    try {
      setError('');
      // TODO: Implement change password API call
      await changePassword(data.oldpassword, data.newpassword, data.repassword);

      setIsChangePasswordModalOpen(false);
      resetChangePasswordForm();
      toast.success('Đổi mật khẩu thành công!', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
      });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Đổi mật khẩu thất bại. Vui lòng thử lại.');
    }
  };

  return (
    <header className="relative z-[100]">
      <ToastContainer />
      <div className="header-bg w-full h-24 overflow-hidden relative">
        {/* <div className="dragon-balls absolute top-0 left-0 w-full h-full opacity-30">
         
        </div> */}
        <DragonBallSnake />

        <div className="container mx-auto px-4 h-full flex items-center justify-between">
          <nav className="w-full">
            <ul className="hidden md:flex justify-center space-x-4 items-center">
              <li className="menu-item">
                <a
                  href="/"
                  className="px-6 py-2 btn-home text-black font-bold rounded inline-block transform hover:scale-105 transition-transform w-32 h-12" 
                >
                </a>
              </li>
              <li className="menu-item">
                <a
                  href="https://www.facebook.com/ngocrongfunvietnam/"
                  className="px-6 py-2 btn-fanpage text-black font-bold rounded inline-block transform hover:scale-105 transition-transform w-32 h-12"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  
                </a>
              </li>
              <li className="menu-item logo-brand mx-4">
                <a href="/" className="relative">
                <div className="absolute -inset-1 rounded-full bg-yellow-400 opacity-30 animate-pulse"></div>
                  <img
                    src="/images/logo-main.png"
                    alt="Logo"
                    className="h-32 w-auto transform -translate-y-1 relative z-10 dragon-ball-glow"
                  />
                </a>
              </li>
              <li className="menu-item">
                <a
                  href="https://zalo.me/g/fpattt148"
                  className="px-6 py-2 btn-community  text-black font-bold rounded inline-block transform hover:scale-105 transition-transform w-32 h-12"
                  target="_blank"
                  rel="noopener noreferrer"
                    >
                    
                </a>
              </li>
              <li className="menu-item">
                <a
                  href=""
                  className="px-6 py-2 btn-support text-black font-bold rounded inline-block transform hover:scale-105 transition-transform w-32 h-12"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  
                </a>
              </li>
            </ul>

            {/* Mobile menu button */}
            <div className="md:hidden flex justify-between items-center">
              <a href="/">
                <img
                  src="/images/logo-main.png"
                  alt="Logo"
                  className="h-16 w-auto"
                />
              </a>
              <button
                onClick={() => {
                  setIsMenuOpen(!isMenuOpen)
                  
                }}
                className="text-white p-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>

            {/* Mobile menu */}
            {isMenuOpen && (
              <div className="md:hidden fixed top-24 left-0 w-full bg-[#2a212e] border-t border-[#e1ac31]/30 z-[9999] shadow-lg animate-slideDown">
                <ul className="flex flex-col p-4 space-y-3">
                  <li>
                    <a
                      href="/"
                      className="px-4 py-2 btn-yellow text-black font-bold rounded block text-center"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Trang chủ
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://www.facebook.com/ngocrongfunvietnam/"
                      className="px-4 py-2 btn-yellow text-black font-bold rounded block text-center"
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Fanpage
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://zalo.me/g/fpattt148"
                      className="px-4 py-2 btn-yellow text-black font-bold rounded block text-center"
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Cộng Đồng
                    </a>
                  </li>
                  <li>
                    <a
                      href=""
                      className="px-4 py-2 btn-yellow text-black font-bold rounded block text-center"
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Hỗ Trợ
                    </a>
                  </li>
                </ul>
              </div>
            )}
          </nav>
        </div>
      </div>

      {/* Hero Banner */}
      <div className="hero-banner w-full h-96 md:h-[500px] h-[500px] bg-2 bg-center bg-cover relative overflow-hidden">
        <div className="container mx-auto h-full flex flex-col items-center justify-center px-4">
          <img
            src="/images/icons/ngocrong.png"
            alt="Bảy viên ngọc rồng"
            className="max-w-full h-auto max-h-52 md:max-h-72 object-contain z-10 animate-float dragon-ball-glow"
          />
          <h1 className="hero-text text-2xl md:text-3xl text-white mt-4 text-center">Khám phá thế giới Dragon Ball</h1>
          <div className={`mt-6 flex items-center justify-center ${!isAuthenticated ? 'flex-row space-x-4' : 'flex-col'}`}>
            {isAuthenticated ? (
              <>
              <img src={`/images/avatar/${user?.character?.infochar ? JSON.parse(user.character.infochar).Hair : '454'}.png`} className="w-16 h-16 rounded-full" />
                <span className="text-white">Xin chào, {user?.username}</span>
                <span className="text-white">VND: {user?.vnd}</span>
                <span className="text-white">Nhân vật: {user?.character?.name || 'Chưa tạo nhân vật'}</span>
                <div className="flex space-x-4 mt-2">
                  <button 
                    className="btn-yellow px-6 text-lg font-bold rounded-md"
                    onClick={() => setIsDepositModalOpen(true)}
                  >
                    Nạp tiền
                  </button>
                  <button 
                    className="btn-yellow px-6 text-lg font-bold rounded-md"
                    onClick={() => setIsChangePasswordModalOpen(true)}
                  >
                    Đổi mật khẩu
                  </button>
                  <button 
                    className="btn-yellow px-6 text-lg font-bold rounded-md"
                    onClick={logout}
                  >
                    Đăng xuất
                  </button>
                </div>
              </>
            ) : (
              <>
                <button 
                  className="btn-yellow px-6 py-3 text-lg font-bold rounded-md"
                  onClick={() => setIsLoginModalOpen(true)}
                >
                  Đăng nhập
                </button>
                <button 
                  className="btn-yellow px-6 py-3 text-lg font-bold rounded-md"
                  onClick={() => setIsRegisterModalOpen(true)}
                >
                  Đăng ký
                </button>
              </>
            )}
          </div>
        </div>
        <div className="absolute bottom-10 left-10 w-16 h-16 dragonball dragonball-7" style={{animationDelay: '0.438104s, 0.219052s', animationDuration: '4.1753s, 17.5338s', transform: 'rotateY(5.69554deg) scale(1.00143)'}}></div>
        <div className="absolute bottom-20 right-20 w-12 h-12 dragonball dragonball-6" style={{animationDelay: '4.63875s, 2.31938s', animationDuration: '2.25287s, 15.5046s', transform: 'scale(0.99599)'}}></div>
        <div className="absolute top-20 left-1/4 w-10 h-10 dragonball dragonball-5" style={{animationDelay: '4.65923s, 2.32961s', animationDuration: '4.25497s, 12.7861s', transform: 'scale(1.03191)'}}></div>
        <div className="absolute top-40 right-1/4 w-14 h-14 dragonball dragonball-4" style={{animationDelay: '0.235047s, 0.117524s', animationDuration: '4.90506s, 17.8606s', transform: 'scale(1.02195)'}}></div>
      </div>
      {/* Register Modal */}
      {isRegisterModalOpen && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[10000]">
        <div className="bg-[#2a212e] p-6 rounded-lg shadow-lg max-w-sm w-full relative">
          <button className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 text-xl" onClick={() => {
            setIsRegisterModalOpen(false)
            resetRegisterForm()
            setError('')
          }}>
            ×
          </button>
          <h2 className="text-2xl font-bold text-white mb-4 text-center">Đăng ký</h2>
          {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}
          <form onSubmit={handleRegisterSubmit(onRegisterSubmit)}>
            <div className="mb-4">
              <label
                className="block text-gray-300 text-sm font-bold mb-2"
                htmlFor="reg-account"
              >
                Tài khoản:
              </label>
              <input
                {...registerForm("username", { 
                  required: "Vui lòng nhập tài khoản",
                  minLength: {
                    value: 6,
                    message: "Tài khoản phải có ít nhất 6 ký tự"
                  }
                })}
                type="text"
                id="reg-account"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
              {registerErrors.username && (
                <p className="text-red-500 text-xs mt-1">{registerErrors.username.message}</p>
              )}
            </div>
            <div className="mb-4">
              <label
                className="block text-gray-300 text-sm font-bold mb-2"
                htmlFor="reg-password"
              >
                Mật khẩu:
              </label>
              <input
                {...registerForm("password", {
                  required: "Vui lòng nhập mật khẩu",
                  minLength: {
                    value: 6,
                    message: "Mật khẩu phải có ít nhất 6 ký tự"
                  }
                })}
                type="password"
                id="reg-password"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
              {registerErrors.password && (
                <p className="text-red-500 text-xs mt-1">{registerErrors.password.message}</p>
              )}
            </div>
            <div className="mb-4">
              <label
                className="block text-gray-300 text-sm font-bold mb-2"
                htmlFor="confirm-password"
              >
                Xác nhận mật khẩu:
              </label>
              <input
                {...registerForm("confirmPassword", {
                  required: "Vui lòng xác nhận mật khẩu",
                  validate: (value: string) => value === password || "Mật khẩu không khớp"
                })}
                type="password"
                id="confirm-password"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
              />
              {registerErrors.confirmPassword && (
                <p className="text-red-500 text-xs mt-1">{registerErrors.confirmPassword.message}</p>
              )}
            </div>
            <div className="mb-4">
              <label
                className="block text-gray-300 text-sm font-bold mb-2"
                htmlFor="server"
              >
                Chọn Server:
              </label>
              <select
                {...registerForm("serverId", {
                  required: "Vui lòng chọn server"
                })}
                id="server"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              >
                <option value="">Chọn server</option>
                {servers.map((server) => (
                  <option key={server.id} value={server.id} >
                    {server.name}
                  </option>
                ))}
              </select>
              {registerErrors.serverId && (
                <p className="text-red-500 text-xs mt-1">{registerErrors.serverId.message}</p>
              )}
            </div>

            <button
              type="submit"
              className="btn-yellow w-full text-black font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Đăng ký
            </button>
          </form>
        </div>
      </div>
      )}
      {/* Login Modal */}
      {isLoginModalOpen && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[10000]">
  <div className="bg-[#2a212e] p-6 rounded-lg shadow-lg max-w-sm w-full relative">
    <button className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 text-xl" onClick={() => {
      setIsLoginModalOpen(false)
      resetLoginForm()
      setError('')
    }}>
      ×
    </button>
    <h2 className="text-2xl font-bold text-white mb-4 text-center">
      Đăng nhập
    </h2>
    {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}
    <form onSubmit={handleLoginSubmit(onLoginSubmit)}>
      <div className="mb-4">
        <label
          className="block text-gray-300 text-sm font-bold mb-2"
          htmlFor="account"
        >
          Tài khoản:
        </label>
        <input
          {...loginForm("username", {
            required: "Vui lòng nhập tài khoản"
          })}
          type="text"
          id="account"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
        {loginErrors.username && (
          <p className="text-red-500 text-xs mt-1">{loginErrors.username.message}</p>
        )}
      </div>
      <div className="mb-4">
        <label
          className="block text-gray-300 text-sm font-bold mb-2"
          htmlFor="password"
        >
          Mật khẩu:
        </label>
        <input
          {...loginForm("password", {
            required: "Vui lòng nhập mật khẩu"
          })}
          type="password"
          id="password"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
        />
        {loginErrors.password && (
          <p className="text-red-500 text-xs mt-1">{loginErrors.password.message}</p>
        )}
      </div>
     
      <div className="flex items-center justify-between">
        <button
          type="submit"
          className="btn-yellow w-full text-black font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Đăng nhập{" "}
        </button>
      </div>
    </form>
  </div>
</div>
)}

      {/* Deposit Modal */}
      {isDepositModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[10000]">
          <div className="bg-[#2a212e] p-6 rounded-lg shadow-lg max-w-md w-full relative">
            <button className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 text-xl" onClick={() => {
              setIsDepositModalOpen(false)
              resetDepositForm()
              setError('')
              setSelectedPaymentMethod(null)
              setShowQRCode(false)
            }}>
              ×
            </button>
            <h2 className="text-2xl font-bold text-white mb-4 text-center">Nạp tiền</h2>
            {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}
            
            {!showQRCode ? (
              <form onSubmit={handleDepositSubmit(async (data) => {
                try {
                  setError('');
                  if (!selectedPaymentMethod) {
                    setError('Vui lòng chọn phương thức thanh toán');
                    return;
                  }
                  if(selectedPaymentMethod === 'momo') {
                    setError('hiện tại chưa hỗ trợ nạp tiền qua MoMo');
                    return;
                  }
                  setShowQRCode(true);
                } catch (err: any) {
                  setError(err.response?.data?.message || 'Nạp tiền thất bại. Vui lòng thử lại.');
                }
              })}>
                <div className="mb-4">
                  <label
                    className="block text-gray-300 text-sm font-bold mb-2"
                    htmlFor="amount"
                  >
                    Số tiền (VND):
                  </label>
                  <input
                    {...depositForm("amount", {
                      required: "Vui lòng nhập số tiền",
                      min: {
                        value: 10000,
                        message: "Số tiền tối thiểu là 10,000 VND"
                      },
                      max: {
                        value: 10000000,
                        message: "Số tiền tối đa là 10,000,000 VND"
                      }
                    })}
                    type="number"
                    id="amount"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    placeholder="Nhập số tiền cần nạp"
                  />
                  {depositErrors.amount && (
                    <p className="text-red-500 text-xs mt-1">{depositErrors.amount.message}</p>
                  )}
                </div>

                <div className="mb-4">
                  <h3 className="text-white text-sm font-bold mb-2">Phương thức thanh toán:</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => setSelectedPaymentMethod('momo')}
                      className={`p-3 rounded-lg transition-colors ${
                        selectedPaymentMethod === 'momo' 
                          ? 'bg-[#e1ac31] text-black' 
                          : 'bg-[#1a1a1a] text-white hover:bg-[#2a2a2a]'
                      }`}
                    >
                      <img src="https://homepage.momocdn.net/fileuploads/svg/momo-file-240411162904.svg" alt="MoMo" className="h-8 mx-auto mb-2" />
                      <span className="text-sm">MoMo</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedPaymentMethod('mbank')}
                      className={`p-3 rounded-lg transition-colors ${
                        selectedPaymentMethod === 'mbank' 
                          ? 'bg-[#e1ac31] text-black' 
                          : 'bg-[#1a1a1a] text-white hover:bg-[#2a2a2a]'
                      }`}
                    >
                      <img src="/images/icons/logo.png" alt="MB Bank" className="h-8 mx-auto mb-2" />
                      <span className="text-sm">MB Bank</span>
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn-yellow w-full text-black font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  Xác nhận nạp tiền
                </button>
              </form>
            ) : (
              <div className="text-center">
                <h3 className="text-white text-lg font-bold mb-4">
                  {selectedPaymentMethod === 'momo' ? 'Quét mã QR MoMo' : 'Quét mã QR VietQR'}
                </h3>
                <div className="bg-white p-4 rounded-lg mb-4">
                  <img 
                    src={selectedPaymentMethod === 'momo' ? '/images/payment/momo-qr.png' : `https://img.vietqr.io/image/mbbank-9666666933333-qr_only.jpg?amount=${watchDeposit('amount')}&addInfo=NAPTIEN%20${user?.id}&accountName=NGUYEN%20NAM%20KHANH`} 
                    alt="QR Code" 
                    className="w-48 h-48 mx-auto"
                  />
                </div>
                <p className="text-gray-300 text-sm mb-4">
                  Số Tài khoản: {selectedPaymentMethod === 'momo' ? '0879999950' : '9666666933333'}<br />
                  Chủ Tài khoản: {selectedPaymentMethod === 'momo' ? 'Nguyễn Nam Khánh' : 'Nguyễn Nam Khánh'}<br />
                  Nội dung chuyển khoản: NAPTIEN {user?.id}<br />
                  Số tiền: {watchDeposit('amount')?.toLocaleString('vi-VN')} VND

                </p>
                <div className="flex justify-center space-x-4">
                  <button
                    onClick={() => {
                      setShowQRCode(false);
                      setSelectedPaymentMethod(null);
                    }}
                    className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
                  >
                    Quay lại
                  </button>
                  <button
                    onClick={() => {
                      // TODO: Implement payment verification
                      setIsDepositModalOpen(false);
                      setShowQRCode(false);
                      setSelectedPaymentMethod(null);
                      resetDepositForm();

                    }}
                    className="btn-yellow px-4 py-2 text-black font-bold rounded"
                  >
                    Đã thanh toán
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Change Password Modal */}
      {isChangePasswordModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[10000]">
          <div className="bg-[#2a212e] p-6 rounded-lg shadow-lg max-w-sm w-full relative">
            <button className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 text-xl" onClick={() => {
              setIsChangePasswordModalOpen(false)
              resetChangePasswordForm()
              setError('')
            }}>
              ×
            </button>
            <h2 className="text-2xl font-bold text-white mb-4 text-center">Đổi mật khẩu</h2>
            {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}
            <form onSubmit={handleChangePasswordSubmit(onChangePasswordSubmit)}>
              <div className="mb-4">
                <label
                  className="block text-gray-300 text-sm font-bold mb-2"
                  htmlFor="current-password"
                >
                  Mật khẩu hiện tại:
                </label>
                <input
                  {...changePasswordForm("oldpassword", {
                    required: "Vui lòng nhập mật khẩu hiện tại"
                  })}
                  type="password"
                  id="current-password"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
                {changePasswordErrors.oldpassword && (
                  <p className="text-red-500 text-xs mt-1">{changePasswordErrors.oldpassword.message}</p>
                )}
              </div>
              <div className="mb-4">
                <label
                  className="block text-gray-300 text-sm font-bold mb-2"
                  htmlFor="new-password"
                >
                  Mật khẩu mới:
                </label>
                <input
                  {...changePasswordForm("newpassword", {
                    required: "Vui lòng nhập mật khẩu mới",
                    minLength: {
                      value: 6,
                      message: "Mật khẩu phải có ít nhất 6 ký tự"
                    }
                  })}
                  type="password"
                  id="new-password"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
                {changePasswordErrors.newpassword && (
                  <p className="text-red-500 text-xs mt-1">{changePasswordErrors.newpassword.message}</p>
                )}
              </div>
              <div className="mb-4">
                <label
                  className="block text-gray-300 text-sm font-bold mb-2"
                  htmlFor="confirm-new-password"
                >
                  Xác nhận mật khẩu mới:
                </label>
                <input
                  {...changePasswordForm("repassword", {
                    required: "Vui lòng xác nhận mật khẩu mới",
                    validate: (value: string) => value === newPassword || "Mật khẩu không khớp"
                  })}
                  type="password"
                  id="confirm-new-password"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
                {changePasswordErrors.repassword && (
                  <p className="text-red-500 text-xs mt-1">{changePasswordErrors.repassword.message}</p>
                )}
              </div>

              <button
                type="submit"
                className="btn-yellow w-full text-black font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Đổi mật khẩu
              </button>
            </form>
          </div>
        </div>
      )}

    </header>
  );
};

export default Header;
