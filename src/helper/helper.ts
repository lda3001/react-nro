//hàm lấy link ảnh từ thư mục public ở react 

const getImageLink = (url: string) => {
    const apiUrl = import.meta.env.VITE_API_URL;
    return apiUrl ? apiUrl + url : 'http://localhost:3000' + url;
};

export default getImageLink;


