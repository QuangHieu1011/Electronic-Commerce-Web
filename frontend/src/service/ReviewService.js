import axios from 'axios';
import { axiosJWT } from './UserService';

export const getAdminReviews = async (
    access_token,
    { page = 1, limit = 10, search = '', rating = '', flagged } = {}
) => {
    const params = new URLSearchParams({ page, limit });
    if (search) params.append('search', search);
    if (rating) params.append('rating', rating);
    if (flagged !== undefined) params.append('flagged', String(flagged));
    const res = await axiosJWT.get(`${process.env.REACT_APP_API_URL}/review/admin/all?${params.toString()}`, {
        headers: { Authorization: `Bearer ${access_token}` }
    });
    return res.data;
};

export const getProductReviewStats = async (access_token, { page = 1, limit = 10, sort = 'rating' } = {}) => {
    const params = new URLSearchParams({ page, limit, sort });
    const res = await axiosJWT.get(`${process.env.REACT_APP_API_URL}/review/admin/product-stats?${params.toString()}`, {
        headers: { Authorization: `Bearer ${access_token}` }
    });
    return res.data;
};

export const deleteReview = async (access_token, reviewId) => {
    const res = await axiosJWT.delete(`${process.env.REACT_APP_API_URL}/review/admin/${reviewId}`, {
        headers: { Authorization: `Bearer ${access_token}` }
    });
    return res.data;
};

export const getReviewsByProduct = async (productId, { page = 1, limit = 6 } = {}) => {
    const params = new URLSearchParams({ page, limit });
    const res = await axios.get(`${process.env.REACT_APP_API_URL}/review/product/${productId}?${params.toString()}`);
    return res.data;
};
