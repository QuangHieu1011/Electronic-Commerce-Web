import React, { useEffect } from 'react'
import { Result, Button } from 'antd'
import { useNavigate } from 'react-router-dom'

const PaymentSuccess = () => {
    const navigate = useNavigate()

    useEffect(() => {
        // Tự động redirect về home sau 5 giây
        const timer = setTimeout(() => {
            navigate('/')
        }, 5000)

        return () => clearTimeout(timer)
    }, [navigate])

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh',
            backgroundColor: '#f5f5f5'
        }}>
            <Result
                status="success"
                title="Thanh toán PayPal thành công!"
                subTitle="Cảm ơn bạn đã mua hàng. Đơn hàng của bạn đã được xử lý thành công."
                extra={[
                    <Button type="primary" key="home" onClick={() => navigate('/')}>
                        Về trang chủ
                    </Button>,
                    <Button key="orders" onClick={() => navigate('/my-order')}>
                        Xem đơn hàng
                    </Button>,
                ]}
            />
        </div>
    )
}

export default PaymentSuccess