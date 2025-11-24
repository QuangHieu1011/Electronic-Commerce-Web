import axios from "axios"

export const axiosJWT = axios.create()

// Hàm refresh token
const refreshToken = async () => {
    const res = await axios.post(`${process.env.REACT_APP_API_URL}/user/refresh-token`, {
        withCredentials: true
    })
    return res.data;
}

export const createOrder = async (data, access_token) => {
    try {
        const res = await axiosJWT.post(`${process.env.REACT_APP_API_URL}/order/create`, data, {
            headers: {
                authorization: `Bearer ${access_token}`,
            }
        })
        return res.data
    } catch (error) {
        // Nếu lỗi 401, tự động refresh token và retry
        if (error.response?.status === 401) {
            const refreshRes = await refreshToken();
            const newToken = refreshRes?.access_token;
            if (newToken) {
                const retryRes = await axiosJWT.post(`${process.env.REACT_APP_API_URL}/order/create`, data, {
                    headers: {
                        authorization: `Bearer ${newToken}`,
                    }
                })
                return retryRes.data
            }
        }
        // Nếu không phải lỗi 401 hoặc refresh thất bại, trả về lỗi gốc
        throw error
    }
}

export const getAllOrdersByUser = async (userId, access_token) => {
    try {
        const res = await axiosJWT.get(`${process.env.REACT_APP_API_URL}/order/get-all-orders/${userId}`, {
            headers: {
                authorization: `Bearer ${access_token}`,
            }
        })
        return res.data
    } catch (error) {
        // Nếu lỗi 401, tự động refresh token và retry
        if (error.response?.status === 401) {
            const refreshRes = await refreshToken();
            const newToken = refreshRes?.access_token;
            if (newToken) {
                const retryRes = await axiosJWT.get(`${process.env.REACT_APP_API_URL}/order/get-all-orders/${userId}`, {
                    headers: {
                        authorization: `Bearer ${newToken}`,
                    }
                })
                return retryRes.data
            }
        }
        // Nếu không phải lỗi 401 hoặc refresh thất bại, trả về lỗi gốc
        throw error
    }
}

export const getAllOrders = async (access_token) => {
    const res = await axiosJWT.get(`${process.env.REACT_APP_API_URL}/order/get-all-orders`, {
        headers: {
            authorization: `Bearer ${access_token}`,
        }
    })
    return res.data
}

export const getOrderDetails = async (orderId, access_token) => {
    const res = await axiosJWT.get(`${process.env.REACT_APP_API_URL}/order/get-details-order/${orderId}`, {
        headers: {
            authorization: `Bearer ${access_token}`,
        }
    })
    return res.data
}

export const updateOrderStatus = async (orderId, orderStatus, access_token) => {
    try {
        console.log('OrderService.updateOrderStatus called:', { orderId, orderStatus })
        const res = await axiosJWT.put(`${process.env.REACT_APP_API_URL}/order/update-status/${orderId}`,
            { orderStatus },
            {
                headers: {
                    authorization: `Bearer ${access_token}`,
                }
            }
        )
        console.log('OrderService.updateOrderStatus response:', res.data)
        return res.data
    } catch (error) {
        console.error('OrderService.updateOrderStatus error:', error)
        throw error
    }
}

export const updatePaymentStatus = async (orderId, paymentStatus, access_token) => {
    try {
        console.log('OrderService.updatePaymentStatus called:', { orderId, paymentStatus })
        const res = await axiosJWT.put(`${process.env.REACT_APP_API_URL}/order/update-payment/${orderId}`,
            { paymentStatus },
            {
                headers: {
                    authorization: `Bearer ${access_token}`,
                }
            }
        )
        console.log('OrderService.updatePaymentStatus response:', res.data)
        return res.data
    } catch (error) {
        console.error('OrderService.updatePaymentStatus error:', error)
        throw error
    }
}

export const cancelOrder = async (orderId, access_token) => {
    const res = await axiosJWT.put(`${process.env.REACT_APP_API_URL}/order/cancel-order/${orderId}`, {}, {
        headers: {
            authorization: `Bearer ${access_token}`,
        }
    })
    return res.data
}

export const hideOrderFromUser = async (orderId, access_token) => {
    const res = await axiosJWT.put(`${process.env.REACT_APP_API_URL}/order/hide-order/${orderId}`, {}, {
        headers: {
            authorization: `Bearer ${access_token}`,
        }
    })
    return res.data
}

export const restoreOrderForUser = async (orderId, access_token) => {
    try {
        console.log('OrderService.restoreOrderForUser called:', { orderId })
        const res = await axiosJWT.put(`${process.env.REACT_APP_API_URL}/order/restore-order/${orderId}`, {}, {
            headers: {
                authorization: `Bearer ${access_token}`,
            }
        })
        console.log('OrderService.restoreOrderForUser response:', res.data)
        return res.data
    } catch (error) {
        console.error('OrderService.restoreOrderForUser error:', error)
        throw error
    }
}

export const reorderItems = async (orderId, access_token) => {
    try {
        console.log('OrderService.reorderItems called:', { orderId })
        const res = await axiosJWT.post(`${process.env.REACT_APP_API_URL}/order/reorder/${orderId}`, {}, {
            headers: {
                authorization: `Bearer ${access_token}`,
            }
        })
        console.log('OrderService.reorderItems response:', res.data)
        return res.data
    } catch (error) {
        console.error('OrderService.reorderItems error:', error)
        throw error
    }
}

export const deleteOrderPermanently = async (orderId, access_token) => {
    const res = await axiosJWT.delete(`${process.env.REACT_APP_API_URL}/order/delete-order/${orderId}`, {
        headers: {
            authorization: `Bearer ${access_token}`,
        }
    })
    return res.data
}