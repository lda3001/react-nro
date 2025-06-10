import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { milestoneAPI } from '../services/api';
import { toast } from 'react-toastify';

interface Milestone {
    milestone: number;
    received: boolean;
}

interface MilestoneProps {
    totalDeposit: number;
    milestones: Milestone[];
}

const Milestone= () => {
    const { user } = useAuth();
    const getMilestoneImage = (milestone: number): string => {
        switch (milestone) {
            case 100000:
                return "/UploadImage/mocnap100.png";
            case 200000:
                return "/UploadImage/mocnap200.png";
            case 500000:
                return "/UploadImage/mocnap500.png";
            case 1000000:
                return "/UploadImage/mocnap1tr.png";
            case 5000000:
                return "/UploadImage/mocnap5tr.png";
            case 10000000:
                return "/UploadImage/mocnap10tr.png";
            case 20000000:
                return "/UploadImage/mocnap20tr.png";
            case 50000000:
                return "/UploadImage/mocnap50tr.png";
            default:
                return "/UploadImage/mocnap100tr.png";
        }
    };

    const formatCurrency = (amount: number): string => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(amount);
    };

    const handleReceiveMilestone = async (milestone: number) => {
        // TODO: Implement the receive milestone logic
        try {
            const response = await milestoneAPI.receiveMilestone(milestone) as any;
            if(response.success) {
                toast.success(response.message);
                setTimeout(() => {
                    window.location.reload();
                }, 3000);
            } else {
                toast.error(response.message);
            }
        } catch (error: any) {
            if(error.response.data.error) {
                toast.error(error.response.data.error);
            } else {
                toast.error("Có lỗi xảy ra, vui lòng thử lại sau!");
            }
        }
        
    };
    if(!user) {
        return (
            <div className="flex flex-col justify-center items-center min-h-[calc(100vh-700px)]">
              <h1 className="text-4xl font-bold">401 - Unauthorized</h1>
              <p className="text-2xl">Vui lòng đăng nhập để xem thông tin</p>
            </div>
          );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b py-3">
            <div className="container mx-auto px-3 sm:px-4 py-6 sm:py-12">
                <div className="text-center mb-6 sm:mb-12">
                    <h1 className="text-2xl sm:text-4xl font-bold mb-2 sm:mb-4 text-white">Mốc Nhận Thưởng</h1>
                    <p className="text-base sm:text-lg text-white">
                        Tổng nạp hiện tại: <span className="font-semibold text-green-600">{formatCurrency(user.tongnap)}</span>
                    </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-8">
                    {JSON.parse(user.milestone).map((milestone: Milestone) => {
                        const isAchieved = user.tongnap >= milestone.milestone;
                        const status = isAchieved ? (milestone.received ? 'Received' : 'Receive') : 'Not Achieved';
                        const buttonImage = isAchieved
                            ? (milestone.received ? '/UploadImage/danhan.png' : '/UploadImage/nhan.png')
                            : '/UploadImage/chuadat.png';

                        return (
                            <div 
                                key={milestone.milestone} 
                                className="bg-white rounded-lg sm:rounded-xl shadow-md sm:shadow-lg overflow-hidden transform transition-all duration-300 hover:scale-[1.02] sm:hover:scale-105 hover:shadow-xl"
                            >
                                <div className="p-3 sm:p-6">
                                    <div className="relative">
                                        <img
                                            src={getMilestoneImage(milestone.milestone)}
                                            alt={`Milestone ${milestone.milestone}`}
                                            className="w-full h-auto mb-3 sm:mb-4 rounded-lg"
                                        />
                                        <div className="absolute top-2 right-2 bg-white/90 px-2 sm:px-3 py-1 rounded-full">
                                            <span className="text-sm sm:text-lg font-bold text-gray-800">
                                                {formatCurrency(milestone.milestone)}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="text-center mt-3 sm:mt-4">
                                        <div className={`inline-block px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium mb-3 sm:mb-4 ${
                                            status === 'Received' 
                                                ? 'bg-green-100 text-green-800'
                                                : status === 'Receive'
                                                ? 'bg-blue-100 text-blue-800'
                                                : 'bg-gray-100 text-gray-800'
                                        }`}>
                                            {status}
                                        </div>
                                        <div className="transition-transform duration-300 hover:scale-105">
                                            <img
                                                src={buttonImage}
                                                alt={status}
                                                className={`w-8/12 sm:w-10/12 mx-auto cursor-pointer ${
                                                    status === 'Receive' ? 'hover:opacity-90' : 'opacity-80'
                                                }`}
                                                onClick={() => status === 'Receive' && handleReceiveMilestone(milestone.milestone)}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default Milestone;