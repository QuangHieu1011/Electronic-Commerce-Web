import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { Button } from 'antd'
import { ArrowLeftOutlined, DeleteOutlined } from '@ant-design/icons'
import { clearWishlist } from '../../redux/slides/wishlistSlice'
import CardComponent from '../../components/CardComponent/CardComponent'
import {
    WrapperContainer,
    WrapperHeader,
    WrapperProducts,
    WrapperEmpty
} from './style'

const WishlistPage = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const wishlistItems = useSelector((state) => state.wishlist.wishlistItems)

    const handleClearAll = () => {
        dispatch(clearWishlist())
    }

    if (wishlistItems.length === 0) {
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
                    <h2>❤️ Sản Phẩm Yêu Thích</h2>
                    <div style={{ width: '100px' }}></div>
                </WrapperHeader>

                <WrapperEmpty>
                    <div className="empty-icon">💔</div>
                    <div className="empty-title">Chưa có sản phẩm yêu thích</div>
                    <div className="empty-description">
                        Hãy thêm sản phẩm yêu thích để dễ dàng tìm lại sau này
                    </div>
                    <Button type="primary" size="large" onClick={() => navigate('/')} danger>
                        Khám phá ngay
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
                <h2>❤️ Sản Phẩm Yêu Thích ({wishlistItems.length})</h2>
                <Button
                    danger
                    icon={<DeleteOutlined />}
                    onClick={handleClearAll}
                    style={{ background: 'rgba(255,255,255,0.9)', color: '#ff4d4f', border: 'none' }}
                >
                    Xóa tất cả
                </Button>
            </WrapperHeader>

            <WrapperProducts>
                {wishlistItems.map((product) => (
                    <CardComponent
                        key={product._id}
                        id={product._id}
                        name={product.name}
                        image={product.image}
                        price={product.price}
                        rating={product.rating}
                        type={product.type}
                        discount={product.discount}
                        countInStock={product.countInStock}
                        description={product.description}
                        selled={product.selled}
                    />
                ))}
            </WrapperProducts>
        </WrapperContainer>
    )
}

export default WishlistPage
