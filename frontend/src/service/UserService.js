import axios from "axios"

export const axiosJWT = axios.create()

export const loginUser = async (data) => {
    try {
        const res = await axios.post(`${process.env.REACT_APP_API_URL}/user/sign-in`, data);
        return res.data;
    } catch (error) {
        
        return error.response?.data || { status: 'ERR', message: 'Lỗi không xác định' };
    }
}

export const signupUser = async (data) => {
    try {
        const res = await axios.post(`${process.env.REACT_APP_API_URL}/user/sign-up`, data);
        return res.data;
    } catch (error) {
        
        return error.response?.data || { status: 'ERR', message: 'Lỗi không xác định' };
    }
}

export const getDetailsUser = async (id,access_token) => {
  
        const res = await axiosJWT.get(`${process.env.REACT_APP_API_URL}/user/get-details/${id}`, {
            headers: {
                Authorization: `Bearer ${access_token}`,
            }
        });
        return res.data;
}

export const refreshToken = async () => {
        const res = await axios.post(`${process.env.REACT_APP_API_URL}/user/refresh-token`,{
            withCredentials: true 
        })
        return res.data;
}
export const logoutUser = async () => {
        const res = await axios.post(`${process.env.REACT_APP_API_URL}/user/log-out`)
        return res.data
}
export const updateUser = async (id,data,access_token) => {
    try {
        const res = await axiosJWT.put(`${process.env.REACT_APP_API_URL}/user/update-user/${id}`, data, {
            headers: {
                Authorization: `Bearer ${access_token}`,
            }
        });
        return res.data;
    } catch (error) {
        // Nếu lỗi 401, tự động refresh token và retry
        if (error.response && error.response.status === 401) {
            const refreshRes = await refreshToken();
            const newToken = refreshRes?.access_token;
            if (newToken) {
                localStorage.setItem('access_token', JSON.stringify(newToken));
                // Retry với token mới
                const retryRes = await axiosJWT.put(`${process.env.REACT_APP_API_URL}/user/update-user/${id}`, data, {
                    headers: {
                        Authorization: `Bearer ${newToken}`,
                    }
                });
                return retryRes.data;
            }
        }
        // Nếu không phải lỗi 401 hoặc refresh thất bại, trả về lỗi gốc
        throw error;
    }
}
