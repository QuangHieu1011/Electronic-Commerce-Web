import React, { useState } from 'react'
import { Modal, Alert, Spin, Typography, Space, Button } from 'antd'
import { PayPalScriptProvider, PayPalButtons, PayPalCardFieldsProvider, PayPalCardFieldsForm, usePayPalCardFields } from '@paypal/react-paypal-js'
import { CreditCardOutlined, BankOutlined } from '@ant-design/icons'
import * as PayPalService from '../../service/PayPalService'

const { Title, Text } = Typography

// Credit Card Form Component
const CreditCardForm = ({ createOrder, onApprove, onError }) => {
    const { cardFieldsForm } = usePayPalCardFields()
    const [isLoading, setIsLoading] = useState(false)

    const submitHandler = async () => {
        if (typeof cardFieldsForm?.submit !== "function") return
        setIsLoading(true)

        await cardFieldsForm.submit().then((details) => {
            onApprove(details)
        }).catch((error) => {
            console.error("Card payment error:", error)
            onError(error)
        }).finally(() => {
            setIsLoading(false)
        })
    }

    return (
        <div style={{ minHeight: '300px', padding: '20px' }}>
            <PayPalCardFieldsForm
                createOrder={createOrder}
                onApprove={onApprove}
                onError={onError}
                style={{
                    layout: 'vertical'
                }}
            />
            <button
                onClick={submitHandler}
                disabled={isLoading}
                style={{
                    width: '100%',
                    height: '48px',
                    backgroundColor: '#0070ba',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    cursor: isLoading ? 'not-allowed' : 'pointer',
                    marginTop: '16px',
                    transition: 'background-color 0.3s'
                }}
                onMouseOver={(e) => !isLoading && (e.target.style.backgroundColor = '#005ea6')}
                onMouseOut={(e) => !isLoading && (e.target.style.backgroundColor = '#0070ba')}
            >
                {isLoading ? 'Processing Payment...' : 'Pay with Credit Card'}
            </button>
        </div>
    )
}

const PayPalPaymentModal = ({
    visible,
    onClose,
    onSuccess,
    orderData,
    amount
}) => {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [activeTab, setActiveTab] = useState('paypal')
    // PayPal SANDBOX Test Client ID - KHÔNG TRỪ TIỀN THẬT
    const [clientId, setClientId] = useState("AZDxjDScFpQtjWTOUtWKbyN_bDt4OgqaF4eYXlewfBP4-8aqX3PiV8e1GWU6liB2CUXlkA59kJXE7M6R")

    // Xóa Title, Text (không sử dụng)

    // Lấy PayPal Client ID từ backend
    React.useEffect(() => {
        const fetchClientId = async () => {
            try {
                console.log('Fetching PayPal client ID...')
                const response = await PayPalService.getPayPalClientToken()
                console.log('PayPal client ID response:', response)
                if (response.success) {
                    setClientId(response.clientId)
                    console.log('PayPal client ID set:', response.clientId)
                }
            } catch (error) {
                console.error('Error fetching PayPal client ID:', error)
                setError('Không thể kết nối PayPal. Đang sử dụng client ID mặc định.')
            }
        }

        if (visible) {
            fetchClientId()
        }
    }, [visible])

    // PayPal Client ID (Sandbox với Credit Card Form)
    const paypalOptions = {
        "client-id": clientId || "AYePpzlNoAm_LOurJlZJ7bFPZ8YGr0rGirQoT0GO8s30aQb1_qHiJ88v7_3CheRhvJOBKqRhhjq9GBdR",
        currency: "USD",
        intent: "capture",
        components: "buttons,card-fields",
        "disable-funding": "venmo,paylater",
        "enable-funding": "card",
        locale: "en_US"
    }

    const createOrder = async (data, actions) => {
        try {
            console.log('Creating PayPal order...')

            // Fallback: Tạo order trực tiếp từ client với pre-filled buyer info
            console.log('Creating PayPal order client-side...')
            return actions.order.create({
                purchase_units: [{
                    amount: {
                        value: (amount / 23000).toFixed(2),
                        currency_code: "USD"
                    },
                    description: `Thanh toán đơn hàng ${orderData?.orderId || orderData?._id}`,
                    reference_id: orderData?.orderId || orderData?._id
                }],
                application_context: {
                    shipping_preference: "NO_SHIPPING",
                    user_action: "PAY_NOW",
                    return_url: window.location.origin + "/payment-success",
                    cancel_url: window.location.origin + "/checkout"
                }
            })
        } catch (error) {
            console.error('Create PayPal order error:', error)
            setError('Không thể tạo PayPal order. Vui lòng thử lại.')
            throw error
        }
    }

    const onApprove = async (data, actions) => {
        try {
            setLoading(true)
            console.log('PayPal payment approved:', data)

            // Capture payment trực tiếp từ PayPal
            const details = await actions.order.capture()
            console.log('PayPal payment captured:', details)

            // Lưu thông tin PayPal vào localStorage để dùng khi tạo order
            const paypalData = {
                transactionId: details.id,
                paymentStatus: 'paid',
                amount: details.purchase_units[0].amount.value,
                currency: details.purchase_units[0].amount.currency_code,
                payer: details.payer,
                paymentTime: new Date().toISOString(),
                paymentDetails: details
            }
            localStorage.setItem('paypalPaymentData', JSON.stringify(paypalData))

            // Force close PayPal window nếu có
            try {
                if (window.paypal && window.paypal.close) {
                    window.paypal.close()
                }
            } catch (closeError) {
                console.log('PayPal window close error:', closeError)
            }

            // Đóng modal và quay về checkout
            onClose()

            // Hiển thị thông báo thành công với timeout
            setTimeout(() => {
                alert(`✅ Thanh toán PayPal thành công!\n\nTransaction ID: ${details.id}\nAmount: $${details.purchase_units[0].amount.value}\n\nVui lòng bấm "Hoàn thành đơn hàng" để hoàn tất.`)
            }, 500)

        } catch (error) {
            console.error('PayPal payment error:', error)
            setError('Có lỗi xảy ra khi xử lý thanh toán PayPal')
            onClose() // Đóng modal kể cả khi có lỗi
        } finally {
            setLoading(false)
        }
    }

    const onError = (err) => {
        console.error('PayPal error:', err)
        setError('Có lỗi xảy ra với PayPal. Vui lòng thử lại.')
    }

    const onCancel = (data) => {
        console.log('PayPal payment cancelled:', data)
        setError('Bạn đã hủy thanh toán PayPal')
    }

    return (
        <Modal
            title="Thanh toán PayPal"
            open={visible}
            onCancel={onClose}
            footer={null}
            width={500}
            centered
        >
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
                <CreditCardOutlined style={{ fontSize: 64, color: '#0070ba', marginBottom: 16 }} />
                <Title level={3} style={{ color: '#0070ba' }}>Thanh toán qua PayPal</Title>

                <Space direction="vertical" size={16} style={{ width: '100%' }}>
                    <div>
                        <Text strong>Số tiền: </Text>
                        <Text style={{ fontSize: 18, color: '#ff4d4f' }}>
                            ${(amount / 23000).toFixed(2)} USD
                        </Text>
                        <br />
                        <Text type="secondary" style={{ fontSize: 12 }}>
                            (≈ {amount?.toLocaleString('vi-VN')} VND)
                        </Text>
                    </div>

                    <div>
                        <Text strong>Mã đơn hàng: </Text>
                        <Text code>{orderData?.orderId || orderData?._id}</Text>
                    </div>

                    {error && (
                        <Alert
                            message="Lỗi thanh toán"
                            description={error}
                            type="error"
                            showIcon
                            closable
                            onClose={() => setError(null)}
                        />
                    )}

                    <Alert
                        message="Thông tin quan trọng"
                        description={
                            <div>
                                • Bạn sẽ được chuyển đến PayPal để thanh toán<br />
                                • Hỗ trợ thẻ tín dụng, thẻ ghi nợ và tài khoản PayPal<br />
                                • Giao dịch được mã hóa bảo mật SSL<br />
                                <strong style={{ color: '#ff4d4f' }}>• Nếu PayPal bị đơ, hãy bấm "Đóng và tiếp tục" bên dưới</strong>
                            </div>
                        }
                        type="info"
                        showIcon
                        style={{ textAlign: 'left' }}
                    />

                    {/* Emergency close button */}
                    <Button
                        type="dashed"
                        danger
                        onClick={() => {
                            // Force close tất cả PayPal windows
                            try {
                                if (window.paypal && window.paypal.close) {
                                    window.paypal.close()
                                }
                                // Close tất cả popup windows
                                if (window.opener) {
                                    window.close()
                                }
                            } catch (e) {
                                console.log('Force close error:', e)
                            }
                            onClose()
                        }}
                        style={{ marginTop: 10 }}
                    >
                        🚨 Đóng và tiếp tục (nếu PayPal bị đơ)
                    </Button>

                    <Spin spinning={loading} tip="Đang xử lý thanh toán...">
                        <div style={{ minHeight: 100 }}>
                            {(clientId || paypalOptions["client-id"]) && (
                                <div>
                                    <div style={{ marginBottom: '20px' }}>
                                        <div style={{ display: 'flex', marginBottom: '20px', borderRadius: '8px', overflow: 'hidden', border: '1px solid #d9d9d9' }}>
                                            <button
                                                onClick={() => setActiveTab('paypal')}
                                                style={{
                                                    flex: 1,
                                                    padding: '12px 16px',
                                                    backgroundColor: activeTab === 'paypal' ? '#0070ba' : '#f5f5f5',
                                                    color: activeTab === 'paypal' ? 'white' : '#333',
                                                    border: 'none',
                                                    cursor: 'pointer',
                                                    fontWeight: activeTab === 'paypal' ? 'bold' : 'normal',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    gap: '8px'
                                                }}
                                            >
                                                <BankOutlined />
                                                PayPal Wallet
                                            </button>
                                            <button
                                                onClick={() => setActiveTab('card')}
                                                style={{
                                                    flex: 1,
                                                    padding: '12px 16px',
                                                    backgroundColor: activeTab === 'card' ? '#0070ba' : '#f5f5f5',
                                                    color: activeTab === 'card' ? 'white' : '#333',
                                                    border: 'none',
                                                    cursor: 'pointer',
                                                    fontWeight: activeTab === 'card' ? 'bold' : 'normal',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    gap: '8px'
                                                }}
                                            >
                                                <CreditCardOutlined />
                                                Credit Card
                                            </button>
                                        </div>
                                    </div>

                                    {activeTab === 'paypal' && (
                                        <PayPalScriptProvider options={{
                                            "client-id": clientId || "AZDxjDScFpQtjWTOUtWKbyN_bDt4OgqaF4eYXlewfBP4-8aqX3PiV8e1GWU6liB2CUXlkA59kJXE7M6R",
                                            currency: "USD",
                                            intent: "capture",
                                            components: "buttons",
                                            locale: "en_US",
                                            "buyer-country": "US",
                                            "enable-funding": "paypal,card",
                                            "disable-funding": "paylater,venmo",
                                            debug: true
                                        }}>
                                            <div>
                                                <PayPalButtons
                                                    style={{
                                                        layout: 'vertical',
                                                        color: 'blue',
                                                        shape: 'rect',
                                                        label: 'paypal'
                                                    }}
                                                    createOrder={createOrder}
                                                    onApprove={onApprove}
                                                    onError={onError}
                                                    onCancel={onCancel}
                                                    onInit={(data, actions) => {
                                                        console.log('PayPal buttons initialized:', data)
                                                    }}
                                                />
                                                {loading && (
                                                    <div style={{ textAlign: 'center', marginTop: '10px' }}>
                                                        <Spin /> Đang xử lý...
                                                    </div>
                                                )}
                                            </div>
                                        </PayPalScriptProvider>
                                    )}

                                    {activeTab === 'card' && (
                                        <PayPalScriptProvider options={{
                                            "client-id": clientId || "AZDxjDScFpQtjWTOUtWKbyN_bDt4OgqaF4eYXlewfBP4-8aqX3PiV8e1GWU6liB2CUXlkA59kJXE7M6R",
                                            currency: "USD",
                                            intent: "capture",
                                            components: "card-fields",
                                            "enable-funding": "card",
                                            locale: "en_US"
                                        }}>
                                            <PayPalCardFieldsProvider
                                                createOrder={createOrder}
                                                onApprove={onApprove}
                                                onError={onError}
                                            >
                                                <CreditCardForm
                                                    createOrder={createOrder}
                                                    onApprove={onApprove}
                                                    onError={onError}
                                                />
                                            </PayPalCardFieldsProvider>
                                        </PayPalScriptProvider>
                                    )}
                                </div>
                            )}
                            {!clientId && !paypalOptions["client-id"] && (
                                <div style={{ textAlign: 'center', padding: '20px' }}>
                                    <Spin size="large" />
                                    <p style={{ marginTop: '10px' }}>Đang tải PayPal...</p>
                                </div>
                            )}
                        </div>
                    </Spin>
                </Space>
            </div>
        </Modal>
    )
}

export default PayPalPaymentModal