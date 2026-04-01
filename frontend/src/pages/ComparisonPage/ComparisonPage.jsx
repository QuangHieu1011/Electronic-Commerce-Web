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
import { formatPrice, toSlug } from '../../utils'
import { useLanguage } from '../../context/LanguageContext'

const ComparisonPage = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const comparisonItems = useSelector((state) => state.comparison.comparisonItems)
    const { t } = useLanguage()

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
                        {t('comparison.backHome')}
                    </Button>
                    <h2>{t('comparison.title')}</h2>
                    <div style={{ width: '100px' }}></div>
                </WrapperHeader>

                <WrapperEmpty>
                    <div className="empty-title">{t('comparison.emptyTitle')}</div>
                    <div className="empty-description">
                        {t('comparison.emptyDescription')}
                    </div>
                    <Button type="primary" size="large" onClick={() => navigate('/')}>
                        {t('comparison.exploreProducts')}
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
                    {t('comparison.backHome')}
                </Button>
                <h2>{t('comparison.titleWithCount', { count: comparisonItems.length })}</h2>
                <Button
                    danger
                    onClick={handleClearAll}
                    style={{ background: 'rgba(255,77,79,0.9)', color: 'white', border: 'none' }}
                >
                    {t('comparison.clearAll')}
                </Button>
            </WrapperHeader>

            <WrapperTable>
                <table>
                    <thead>
                        <tr>
                            <th style={{ minWidth: '150px' }}>{t('comparison.specifications')}</th>
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
                            <td style={{ fontWeight: '600' }}>{t('comparison.originalPrice')}</td>
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
                                <td style={{ fontWeight: '600' }}>{t('comparison.discount')}</td>
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
                            <td style={{ fontWeight: '600' }}>{t('comparison.salePrice')}</td>
                            {comparisonItems.map((product) => (
                                <td key={product._id} style={{ textAlign: 'center' }}>
                                    <span style={{ fontSize: '18px', fontWeight: '600', color: '#ff4d4f' }}>
                                        {formatPrice(calculateDiscountedPrice(product))}
                                    </span>
                                </td>
                            ))}
                        </tr>

                        <tr>
                            <td style={{ fontWeight: '600' }}>{t('comparison.productType')}</td>
                            {comparisonItems.map((product) => (
                                <td key={product._id} style={{ textAlign: 'center' }}>
                                    <Tag color="blue">{product.type}</Tag>
                                </td>
                            ))}
                        </tr>

                        <tr>
                            <td style={{ fontWeight: '600' }}>{t('comparison.rating')}</td>
                            {comparisonItems.map((product) => (
                                <td key={product._id} style={{ textAlign: 'center' }}>
                                    <Rate disabled value={product.rating} style={{ fontSize: '14px' }} />
                                    <div style={{ fontSize: '12px', color: '#999', marginTop: '4px' }}>
                                        {t('comparison.stars', { rating: product.rating })}
                                    </div>
                                </td>
                            ))}
                        </tr>

                        <tr>
                            <td style={{ fontWeight: '600' }}>{t('comparison.stock')}</td>
                            {comparisonItems.map((product) => (
                                <td key={product._id} style={{ textAlign: 'center' }}>
                                    {product.countInStock > 0 ? (
                                        <Tag color="green">{t('comparison.stockCount', { count: product.countInStock })}</Tag>
                                    ) : (
                                        <Tag color="red">{t('comparison.outOfStock')}</Tag>
                                    )}
                                </td>
                            ))}
                        </tr>

                        <tr>
                            <td style={{ fontWeight: '600' }}>{t('comparison.sold')}</td>
                            {comparisonItems.map((product) => (
                                <td key={product._id} style={{ textAlign: 'center' }}>
                                    <span style={{ color: '#666' }}>{t('comparison.soldCount', { count: product.selled || 0 })}</span>
                                </td>
                            ))}
                        </tr>

                        <tr>
                            <td style={{ fontWeight: '600' }}>{t('comparison.description')}</td>
                            {comparisonItems.map((product) => (
                                <td key={product._id} style={{ fontSize: '13px', color: '#666' }}>
                                    {product.description}
                                </td>
                            ))}
                        </tr>

                        <tr>
                            <td style={{ fontWeight: '600' }}>{t('comparison.actions')}</td>
                            {comparisonItems.map((product) => (
                                <td key={product._id} style={{ textAlign: 'center' }}>
                                    <Button
                                        type="primary"
                                        icon={<ShoppingCartOutlined />}
                                        onClick={() => handleAddToCart(product)}
                                        disabled={product.countInStock === 0}
                                        style={{
                                            marginBottom: '8px',
                                            width: '100%',
                                            backgroundColor: product.countInStock === 0 ? '#d9d9d9' : '#1a94ff',
                                            borderColor: product.countInStock === 0 ? '#d9d9d9' : '#1a94ff',
                                            color: product.countInStock === 0 ? 'rgba(0, 0, 0, 0.35)' : '#fff',
                                            fontWeight: 600
                                        }}
                                    >
                                        {t('comparison.addToCart')}
                                    </Button>
                                    <Button
                                        onClick={() => {
                                            const productSlug = toSlug(product.name) || 'product';
                                            navigate(`/product-details/${product._id}/${productSlug}`)
                                        }}
                                        style={{ width: '100%' }}
                                    >
                                        {t('comparison.viewDetails')}
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
