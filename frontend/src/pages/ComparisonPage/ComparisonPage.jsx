import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { Button, Tag, Rate } from 'antd'
import { ArrowLeftOutlined, CloseOutlined, ShoppingCartOutlined } from '@ant-design/icons'
import { removeFromComparison, clearComparison } from '../../redux/slides/comparisonSlice'
import { addToCart } from '../../redux/slides/cartSlice'
import {
    WrapperContainer,
    WrapperHeader,
    WrapperTable,
    WrapperProductCell,
    WrapperEmpty
} from './style'
import { formatPrice } from '../../utils'

const ComparisonPage = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const comparisonItems = useSelector((state) => state.comparison.comparisonItems)

    const calculateDiscountedPrice = (product) => {
        if (product.discount && product.discount > 0) {
            return product.price * (1 - product.discount / 100)
        }
        return product.price
    }

    const handleRemove = (productId) => {
        dispatch(removeFromComparison(productId))
    }

    const handleClearAll = () => {
        dispatch(clearComparison())
    }

  const handleAddToCart = (product) => {
    dispatch(addToCart({ product, quantity: 1 }))
    navigate('/order')
  }

    if (comparisonItems.length === 0) {
        return (
            <WrapperContainer>
                <WrapperHeader>
                    <Button
                        icon={<ArrowLeftOutlined />}
                        onClick={() => navigate('/')}
                        style={{ background: 'rgba(255,255,255,0.2)', color: 'white', border: 'none' }}
                    >
                        Về trang chủ
                    </Button>
                    <h2>So Sánh Sản Phẩm</h2>
                    <div style={{ width: '100px' }}></div>
                </WrapperHeader>

                <WrapperEmpty>
                    <div className="empty-title">Chưa có sản phẩm để so sánh</div>
                    <div className="empty-description">
                        Hãy thêm sản phẩm vào danh sách so sánh để xem sự khác biệt
                    </div>
                    <Button type="primary" size="large" onClick={() => navigate('/')}>
                        Khám phá sản phẩm
                    </Button>
                </WrapperEmpty>
            </WrapperContainer>
        )
    }

    return (
        <WrapperContainer>
            <WrapperHeader>
                <Button
                    icon={<ArrowLeftOutlined />}
                    onClick={() => navigate('/')}
                    style={{ background: 'rgba(255,255,255,0.2)', color: 'white', border: 'none' }}
                >
                    Về trang chủ
                </Button>
                <h2>So Sánh Sản Phẩm ({comparisonItems.length}/3)</h2>
                <Button
                    danger
                    onClick={handleClearAll}
                    style={{ background: 'rgba(255,77,79,0.9)', color: 'white', border: 'none' }}
                >
                    Xóa tất cả
                </Button>
            </WrapperHeader>

            <WrapperTable>
                <table>
                    <thead>
                        <tr>
                            <th style={{ minWidth: '150px' }}>Thông số</th>
                            {comparisonItems.map((product) => (
                                <th key={product._id} style={{ minWidth: '200px', position: 'relative' }}>
                                    <WrapperProductCell>
                                        <button
                                            className="remove-btn"
                                            onClick={() => handleRemove(product._id)}
                                        >
                                            <CloseOutlined />
                                        </button>
                                        <img src={product.image} alt={product.name} />
                                        <div className="product-name">{product.name}</div>
                                    </WrapperProductCell>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td style={{ fontWeight: '600' }}>Giá gốc</td>
                            {comparisonItems.map((product) => (
                                <td key={product._id} style={{ textAlign: 'center' }}>
                                    <span style={{ textDecoration: product.discount > 0 ? 'line-through' : 'none', color: '#999' }}>
                                        {formatPrice(product.price)}
                                    </span>
                                </td>
                            ))}
                        </tr>

                        {comparisonItems.some(p => p.discount > 0) && (
                            <tr>
                                <td style={{ fontWeight: '600' }}>Giảm giá</td>
                                {comparisonItems.map((product) => (
                                    <td key={product._id} style={{ textAlign: 'center' }}>
                                        {product.discount > 0 ? (
                                            <Tag color="red">{product.discount}%</Tag>
                                        ) : (
                                            <span style={{ color: '#999' }}>-</span>
                                        )}
                                    </td>
                                ))}
                            </tr>
                        )}

                        <tr style={{ background: '#fff9e6' }}>
                            <td style={{ fontWeight: '600' }}>Giá bán</td>
                            {comparisonItems.map((product) => (
                                <td key={product._id} style={{ textAlign: 'center' }}>
                                    <span style={{ fontSize: '18px', fontWeight: '600', color: '#ff4d4f' }}>
                                        {formatPrice(calculateDiscountedPrice(product))}
                                    </span>
                                </td>
                            ))}
                        </tr>

                        <tr>
                            <td style={{ fontWeight: '600' }}>Loại sản phẩm</td>
                            {comparisonItems.map((product) => (
                                <td key={product._id} style={{ textAlign: 'center' }}>
                                    <Tag color="blue">{product.type}</Tag>
                                </td>
                            ))}
                        </tr>

                        <tr>
                            <td style={{ fontWeight: '600' }}>Đánh giá</td>
                            {comparisonItems.map((product) => (
                                <td key={product._id} style={{ textAlign: 'center' }}>
                                    <Rate disabled value={product.rating} style={{ fontSize: '14px' }} />
                                    <div style={{ fontSize: '12px', color: '#999', marginTop: '4px' }}>
                                        {product.rating} sao
                                    </div>
                                </td>
                            ))}
                        </tr>

                        <tr>
                            <td style={{ fontWeight: '600' }}>Tồn kho</td>
                            {comparisonItems.map((product) => (
                                <td key={product._id} style={{ textAlign: 'center' }}>
                                    {product.countInStock > 0 ? (
                                        <Tag color="green">{product.countInStock} sản phẩm</Tag>
                                    ) : (
                                        <Tag color="red">Hết hàng</Tag>
                                    )}
                                </td>
                            ))}
                        </tr>

                        <tr>
                            <td style={{ fontWeight: '600' }}>Đã bán</td>
                            {comparisonItems.map((product) => (
                                <td key={product._id} style={{ textAlign: 'center' }}>
                                    <span style={{ color: '#666' }}>{product.selled || 0} sản phẩm</span>
                                </td>
                            ))}
                        </tr>

                        <tr>
                            <td style={{ fontWeight: '600' }}>Mô tả</td>
                            {comparisonItems.map((product) => (
                                <td key={product._id} style={{ fontSize: '13px', color: '#666' }}>
                                    {product.description}
                                </td>
                            ))}
                        </tr>

                        <tr>
                            <td style={{ fontWeight: '600' }}>Hành động</td>
                            {comparisonItems.map((product) => (
                                <td key={product._id} style={{ textAlign: 'center' }}>
                                    <Button
                                        type="primary"
                                        icon={<ShoppingCartOutlined />}
                                        onClick={() => handleAddToCart(product)}
                                        disabled={product.countInStock === 0}
                                        style={{ marginBottom: '8px', width: '100%' }}
                                    >
                                        Thêm giỏ hàng
                                    </Button>
                                    <Button
                                        onClick={() => navigate(`/product-details/${product._id}`)}
                                        style={{ width: '100%' }}
                                    >
                                        Xem chi tiết
                                    </Button>
                                </td>
                            ))}
                        </tr>
                    </tbody>
                </table>
            </WrapperTable>
        </WrapperContainer>
    )
}

export default ComparisonPage
