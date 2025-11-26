import axios from 'axios'

export const axiosJWT = axios.create()

// Tạo PayPal order
export const createPayPalOrder = async (data) => {
    const res = await axios.post(`${process.env.REACT_APP_API_URL}/paypal/create-order`, data)
    return res.data
}

// Capture PayPal payment
export const capturePayPalOrder = async (data) => {
    const res = await axios.post(`${process.env.REACT_APP_API_URL}/paypal/capture-order`, data)
    return res.data
}

// Verify PayPal payment
export const verifyPayPalPayment = async (data) => {
    const res = await axios.post(`${process.env.REACT_APP_API_URL}/paypal/verify-payment`, data)
    return res.data
}

// Get PayPal client token
export const getPayPalClientToken = async () => {
    try {
        console.log('Calling PayPal API:', `${process.env.REACT_APP_API_URL}/paypal/client-token`)
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/paypal/client-token`)
        console.log('PayPal API response:', res.data)
        return res.data
    } catch (error) {
        console.error('PayPal API error:', error)
        throw error
    }
}