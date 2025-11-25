import React, { useState } from 'react'
import { Modal, Input, Button, Tag, Divider, message, Space } from 'antd'
import { GiftOutlined, PercentageOutlined, CheckCircleOutlined } from '@ant-design/icons'

const VoucherModal = ({ visible, onClose, onApply, totalAmount }) => {
    const [voucherCode, setVoucherCode] = useState('')
    const [selectedVoucher, setSelectedVoucher] = useState(null)

    // Danh sách voucher demo
    const availableVouchers = [
        {
            code: 'FREESHIP',
            title: 'Miễn phí vận chuyển',
            description: 'Giảm 30,000đ phí ship',
            discountType: 'shipping',
            discountValue: 30000,
            minOrder: 0,
            maxDiscount: 30000,
            icon: '🚚'
        },
        {
            code: 'GIAM50K',
            title: 'Giảm 50K',
            description: 'Giảm 50,000đ cho đơn từ 500K',
            discountType: 'fixed',
            discountValue: 50000,
            minOrder: 500000,
            maxDiscount: 50000,
            icon: '💰'
        },
        {
            code: 'GIAM10',
            title: 'Giảm 10%',
            description: 'Giảm 10% tối đa 100K',
            discountType: 'percent',
            discountValue: 10,
            minOrder: 200000,
            maxDiscount: 100000,
            icon: '🎁'
        },
        {
            code: 'NEWUSER',
            title: 'Khách hàng mới',
            description: 'Giảm 100,000đ cho đơn đầu tiên',
            discountType: 'fixed',
            discountValue: 100000,
            minOrder: 300000,
            maxDiscount: 100000,
            icon: '🌟'
        },
        {
            code: 'GIAM20',
            title: 'Giảm 20%',
            description: 'Giảm 20% tối đa 200K cho đơn từ 1 triệu',
            discountType: 'percent',
            discountValue: 20,
            minOrder: 1000000,
            maxDiscount: 200000,
            icon: '🔥'
        }
    ]

    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price)
    }

    const checkVoucherValidity = (voucher) => {
        if (totalAmount < voucher.minOrder) {
            return {
                valid: false,
                message: `Đơn hàng tối thiểu ${formatPrice(voucher.minOrder)}`
            }
        }
        return { valid: true, message: 'Có thể áp dụng' }
    }

    const calculateDiscount = (voucher) => {
        if (voucher.discountType === 'shipping') {
            return voucher.discountValue
        } else if (voucher.discountType === 'percent') {
            const discount = (totalAmount * voucher.discountValue) / 100
            return Math.min(discount, voucher.maxDiscount)
        } else {
            return voucher.discountValue
        }
    }

    const handleSelectVoucher = (voucher) => {
        const validity = checkVoucherValidity(voucher)
        if (!validity.valid) {
            message.warning(validity.message)
            return
        }
        setSelectedVoucher(voucher)
        setVoucherCode(voucher.code)
    }

    const handleApplyCode = () => {
        const voucher = availableVouchers.find(v => v.code === voucherCode.toUpperCase())
        
        if (!voucher) {
            message.error('Mã voucher không tồn tại!')
            return
        }

        const validity = checkVoucherValidity(voucher)
        if (!validity.valid) {
            message.warning(validity.message)
            return
        }

        const discount = calculateDiscount(voucher)
        message.success(`Áp dụng voucher thành công! Giảm ${formatPrice(discount)}`)
        onApply({ ...voucher, appliedDiscount: discount })
        onClose()
    }

    const handleApply = () => {
        if (!selectedVoucher) {
            message.warning('Vui lòng chọn hoặc nhập mã voucher!')
            return
        }
        
        const discount = calculateDiscount(selectedVoucher)
        message.success(`Áp dụng voucher thành công! Giảm ${formatPrice(discount)}`)
        onApply({ ...selectedVoucher, appliedDiscount: discount })
        onClose()
    }

    return (
        <Modal
            title={
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <GiftOutlined style={{ fontSize: 20, color: '#ff4d4f' }} />
                    <span>Chọn mã giảm giá</span>
                </div>
            }
            open={visible}
            onCancel={onClose}
            footer={null}
            width={600}
            centered
        >
            <div style={{ padding: '10px 0' }}>
                {/* Input nhập mã */}
                <div style={{ marginBottom: 20 }}>
                    <Input.Search
                        placeholder="Nhập mã voucher"
                        value={voucherCode}
                        onChange={(e) => setVoucherCode(e.target.value.toUpperCase())}
                        onSearch={handleApplyCode}
                        enterButton="Áp dụng"
                        size="large"
                    />
                </div>

                <Divider style={{ margin: '16px 0' }}>Hoặc chọn voucher có sẵn</Divider>

                {/* Danh sách voucher */}
                <div style={{ maxHeight: 400, overflowY: 'auto' }}>
                    {availableVouchers.map((voucher, index) => {
                        const validity = checkVoucherValidity(voucher)
                        const discount = calculateDiscount(voucher)
                        const isSelected = selectedVoucher?.code === voucher.code

                        return (
                            <div
                                key={index}
                                onClick={() => validity.valid && handleSelectVoucher(voucher)}
                                style={{
                                    padding: 16,
                                    border: isSelected ? '2px solid #1890ff' : '1px solid #d9d9d9',
                                    borderRadius: 8,
                                    marginBottom: 12,
                                    cursor: validity.valid ? 'pointer' : 'not-allowed',
                                    opacity: validity.valid ? 1 : 0.6,
                                    background: isSelected ? '#e6f7ff' : '#fff',
                                    transition: 'all 0.3s',
                                    position: 'relative'
                                }}
                            >
                                {isSelected && (
                                    <CheckCircleOutlined
                                        style={{
                                            position: 'absolute',
                                            top: 12,
                                            right: 12,
                                            fontSize: 20,
                                            color: '#1890ff'
                                        }}
                                    />
                                )}

                                <div style={{ display: 'flex', gap: 12 }}>
                                    <div style={{ fontSize: 32 }}>{voucher.icon}</div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ 
                                            display: 'flex', 
                                            alignItems: 'center', 
                                            gap: 8,
                                            marginBottom: 6
                                        }}>
                                            <span style={{ 
                                                fontWeight: 600, 
                                                fontSize: 15,
                                                color: validity.valid ? '#000' : '#999'
                                            }}>
                                                {voucher.title}
                                            </span>
                                            <Tag 
                                                color={validity.valid ? 'success' : 'default'}
                                                style={{ fontSize: 11 }}
                                            >
                                                {voucher.code}
                                            </Tag>
                                        </div>
                                        
                                        <div style={{ 
                                            fontSize: 13, 
                                            color: '#666',
                                            marginBottom: 8
                                        }}>
                                            {voucher.description}
                                        </div>

                                        <div style={{ 
                                            display: 'flex', 
                                            justifyContent: 'space-between',
                                            alignItems: 'center'
                                        }}>
                                            <Space size={4} split="|">
                                                {voucher.minOrder > 0 && (
                                                    <span style={{ fontSize: 12, color: '#999' }}>
                                                        Đơn tối thiểu {formatPrice(voucher.minOrder)}
                                                    </span>
                                                )}
                                                {validity.valid && (
                                                    <span style={{ 
                                                        fontSize: 13, 
                                                        color: '#ff4d4f',
                                                        fontWeight: 600
                                                    }}>
                                                        <PercentageOutlined /> Giảm {formatPrice(discount)}
                                                    </span>
                                                )}
                                            </Space>
                                            
                                            {!validity.valid && (
                                                <Tag color="warning" style={{ fontSize: 11 }}>
                                                    {validity.message}
                                                </Tag>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>

                {/* Nút áp dụng */}
                <Button
                    type="primary"
                    size="large"
                    block
                    onClick={handleApply}
                    disabled={!selectedVoucher}
                    style={{ 
                        marginTop: 20,
                        height: 48,
                        fontSize: 16,
                        fontWeight: 600
                    }}
                >
                    Áp dụng
                </Button>
            </div>
        </Modal>
    )
}

export default VoucherModal
