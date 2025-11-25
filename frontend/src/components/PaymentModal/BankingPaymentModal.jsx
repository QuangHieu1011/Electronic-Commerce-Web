import React, { useState, useEffect } from 'react'
import { Modal, Button, message, Spin } from 'antd'
import { CheckCircleOutlined, CopyOutlined } from '@ant-design/icons'
import { QRCodeCanvas } from 'qrcode.react'

const BankingPaymentModal = ({ visible, onClose, onSuccess, orderData }) => {
    const [verifying, setVerifying] = useState(false)
    const [countdown, setCountdown] = useState(5)

    // Thông tin chuyển khoản demo
    const bankInfo = {
        bankName: 'Vietcombank',
        accountNumber: '1234567890',
        accountName: 'CONG TY TNHH ELECTRONIC COMMERCE',
        amount: orderData?.totalAmount || 0,
        content: `DH${Date.now().toString().slice(-6)}`
    }

    // Tạo nội dung QR code theo chuẩn VietQR
    const qrContent = `2|99|${bankInfo.accountNumber}|${bankInfo.accountName}|${bankInfo.amount}|${bankInfo.content}|0|0|${bankInfo.amount}`

    const copyToClipboard = (text, label) => {
        navigator.clipboard.writeText(text)
        message.success(`Đã sao chép ${label}`)
    }

    const handleConfirmPayment = () => {
        setVerifying(true)
        // Giả lập kiểm tra thanh toán trong 5 giây
        const interval = setInterval(() => {
            setCountdown(prev => {
                if (prev <= 1) {
                    clearInterval(interval)
                    setVerifying(false)
                    message.success('Xác nhận thanh toán thành công!')
                    onSuccess()
                    return 0
                }
                return prev - 1
            })
        }, 1000)
    }

    useEffect(() => {
        if (!visible) {
            setVerifying(false)
            setCountdown(5)
        }
    }, [visible])

    return (
        <Modal
            title="Thanh toán chuyển khoản"
            open={visible}
            onCancel={onClose}
            footer={null}
            width={500}
            centered
        >
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
                {/* QR Code */}
                <div style={{ 
                    padding: 20, 
                    background: '#fff', 
                    display: 'inline-block',
                    border: '2px solid #d9d9d9',
                    borderRadius: 8,
                    marginBottom: 20
                }}>
                    <QRCodeCanvas value={qrContent} size={200} />
                </div>

                {/* Thông tin chuyển khoản */}
                <div style={{ textAlign: 'left', background: '#f5f5f5', padding: 16, borderRadius: 8 }}>
                    <div style={{ marginBottom: 12 }}>
                        <div style={{ fontSize: 12, color: '#666', marginBottom: 4 }}>Ngân hàng</div>
                        <div style={{ fontWeight: 600, fontSize: 14 }}>{bankInfo.bankName}</div>
                    </div>

                    <div style={{ marginBottom: 12 }}>
                        <div style={{ fontSize: 12, color: '#666', marginBottom: 4 }}>Số tài khoản</div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontWeight: 600, fontSize: 14 }}>{bankInfo.accountNumber}</span>
                            <Button
                                type="text"
                                size="small"
                                icon={<CopyOutlined />}
                                onClick={() => copyToClipboard(bankInfo.accountNumber, 'số tài khoản')}
                            >
                                Sao chép
                            </Button>
                        </div>
                    </div>

                    <div style={{ marginBottom: 12 }}>
                        <div style={{ fontSize: 12, color: '#666', marginBottom: 4 }}>Chủ tài khoản</div>
                        <div style={{ fontWeight: 600, fontSize: 14 }}>{bankInfo.accountName}</div>
                    </div>

                    <div style={{ marginBottom: 12 }}>
                        <div style={{ fontSize: 12, color: '#666', marginBottom: 4 }}>Số tiền</div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontWeight: 600, fontSize: 16, color: '#ff4d4f' }}>
                                {new Intl.NumberFormat('vi-VN').format(bankInfo.amount)} đ
                            </span>
                            <Button
                                type="text"
                                size="small"
                                icon={<CopyOutlined />}
                                onClick={() => copyToClipboard(bankInfo.amount.toString(), 'số tiền')}
                            >
                                Sao chép
                            </Button>
                        </div>
                    </div>

                    <div>
                        <div style={{ fontSize: 12, color: '#666', marginBottom: 4 }}>Nội dung chuyển khoản</div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontWeight: 600, fontSize: 14, color: '#1890ff' }}>{bankInfo.content}</span>
                            <Button
                                type="text"
                                size="small"
                                icon={<CopyOutlined />}
                                onClick={() => copyToClipboard(bankInfo.content, 'nội dung')}
                            >
                                Sao chép
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Hướng dẫn */}
                <div style={{ 
                    textAlign: 'left', 
                    background: '#e6f7ff', 
                    padding: 12, 
                    borderRadius: 8, 
                    marginTop: 16,
                    fontSize: 13
                }}>
                    <div style={{ fontWeight: 600, marginBottom: 8 }}>📱 Hướng dẫn thanh toán:</div>
                    <div>1. Quét mã QR bằng app ngân hàng</div>
                    <div>2. Hoặc chuyển khoản thủ công với thông tin trên</div>
                    <div>3. Nhấn "Tôi đã chuyển khoản" để xác nhận</div>
                    <div style={{ color: '#ff4d4f', marginTop: 8 }}>
                        ⚠️ Lưu ý: Nhập đúng nội dung để được xác nhận nhanh
                    </div>
                </div>

                {/* Nút xác nhận */}
                <Button
                    type="primary"
                    size="large"
                    icon={verifying ? <Spin size="small" /> : <CheckCircleOutlined />}
                    onClick={handleConfirmPayment}
                    loading={verifying}
                    disabled={verifying}
                    style={{ 
                        width: '100%', 
                        marginTop: 20,
                        height: 48,
                        fontSize: 16,
                        fontWeight: 600
                    }}
                >
                    {verifying ? `Đang xác nhận... (${countdown}s)` : 'Tôi đã chuyển khoản'}
                </Button>

                <div style={{ marginTop: 12, fontSize: 12, color: '#999' }}>
                    * Đây là chức năng demo. Trong thực tế sẽ kiểm tra tự động qua API ngân hàng
                </div>
            </div>
        </Modal>
    )
}

export default BankingPaymentModal
