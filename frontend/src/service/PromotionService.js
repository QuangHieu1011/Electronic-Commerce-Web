import { axiosJWT } from "./UserService";

const getAuthHeader = (token) => ({ headers: { Authorization: `Bearer ${token}` } });

export const getAllPromotions = async (access_token) => {
    const res = await axiosJWT.get(
        `${process.env.REACT_APP_API_URL}/promotion/`,
        getAuthHeader(access_token)
    );
    return res.data;
};

export const createPromotion = async (data, access_token) => {
    const res = await axiosJWT.post(
        `${process.env.REACT_APP_API_URL}/promotion/create`,
        data,
        getAuthHeader(access_token)
    );
    return res.data;
};

export const updatePromotion = async (id, data, access_token) => {
    const res = await axiosJWT.put(
        `${process.env.REACT_APP_API_URL}/promotion/update/${id}`,
        data,
        getAuthHeader(access_token)
    );
    return res.data;
};

export const togglePromotionActive = async (id, access_token) => {
    const res = await axiosJWT.patch(
        `${process.env.REACT_APP_API_URL}/promotion/toggle/${id}`,
        {},
        getAuthHeader(access_token)
    );
    return res.data;
};

export const deletePromotion = async (id, access_token) => {
    const res = await axiosJWT.delete(
        `${process.env.REACT_APP_API_URL}/promotion/delete/${id}`,
        getAuthHeader(access_token)
    );
    return res.data;
};
