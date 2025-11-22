import axios from "axios"
import { axiosJWT } from "./UserService";

export const getAllProduct = async () => {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/product/getAll`);
        return res.data
}

export const createProduct = async (data) => {
        const res = await axios.post(`${process.env.REACT_APP_API_URL}/product/create`, data);
        return res.data
}

export const getDetailsProduct = async (id) => {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/product/details/${id}`);
        return res.data
}

export const updateProduct = async (id, access_token, data) => {
    try {
        const res = await axiosJWT.put(`${process.env.REACT_APP_API_URL}/product/update/${id}`, data, {
            headers: {
                Authorization: `Bearer ${access_token}`,
            }
        });
        return res.data;
    } catch (error) {
        
        if (error.response && error.response.status === 401) {
            const { refreshToken } = await import('./UserService');
            const refreshRes = await refreshToken();
            const newToken = refreshRes?.access_token;
            if (newToken) {
                localStorage.setItem('access_token', newToken);
                const retryRes = await axiosJWT.put(`${process.env.REACT_APP_API_URL}/product/update/${id}`, data, {
                    headers: {
                        Authorization: `Bearer ${newToken}`,
                    }
                });
                return retryRes.data;
            }
        }
        throw error;
    }
}
export const deleteProduct = async (id, access_token) => {
        const res = await axiosJWT.delete(`${process.env.REACT_APP_API_URL}/product/delete/${id}`, {
            headers: {
                Authorization: `Bearer ${access_token}`,
            }
        });
        return res.data
}