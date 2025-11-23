import axios from "axios"
import { axiosJWT } from "./UserService";

export const getAllProduct = async (search, limit, page = 0, sort, filter) => {
    let res = {};
    let url = `${process.env.REACT_APP_API_URL}/product/getAll?limit=${limit}&page=${page}`;

    // Thêm search parameter riêng biệt
    if (search?.length > 0) {
        url += `&search=${encodeURIComponent(search)}`;
    }

    // Thêm filter (type và các filter khác)
    if (filter && filter.length === 2) {
        url += `&filter=${filter[0]}&filter=${filter[1]}`;
    }

    // Thêm sort parameters
    if (sort && sort.length === 2) {
        url += `&sort=${sort[0]}&sort=${sort[1]}`;
    }

    console.log('API URL:', url); // Debug URL
    res = await axios.get(url);
    return res.data;
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
export const deleteManyProducts = async (data, access_token) => {
    const res = await axiosJWT.post(`${process.env.REACT_APP_API_URL}/product/delete-many`, data, {
        headers: {
            Authorization: `Bearer ${access_token}`,
        }
    });
    return res.data
}

export const getAllTypeProduct = async () => {
    const res = await axios.get(`${process.env.REACT_APP_API_URL}/product/get-all-type`)
    return res.data
}