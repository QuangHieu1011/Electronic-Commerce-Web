import { Card, Image, message, Tooltip } from 'antd'
import React from 'react'
import Meta from 'antd/lib/card/Meta'
import { StyleNameProduct, WrapperCardStyle, WrapperDiscountText, WrapperPriceText, WrapperReporText } from './style'
import { StarFilled, HeartOutlined, HeartFilled, SwapOutlined } from '@ant-design/icons'
import Logo from '../../assets/images/Logo.png'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { addToComparison, removeFromComparison } from '../../redux/slides/comparisonSlice'
import { addToWishlist, removeFromWishlist } from '../../redux/slides/wishlistSlice'

const CardComponent = (props) => {
  const { countInStock, description, image, name, price, rating, type, selled, discount, id } = props
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const comparisonItems = useSelector((state) => state.comparison.comparisonItems)
  const wishlistItems = useSelector((state) => state.wishlist.wishlistItems)
  
  const isInComparison = comparisonItems.some(item => item._id === id)
  const isInWishlist = wishlistItems.some(item => item._id === id)
  
  const handleDetailProduct = (id) => {
    navigate(`/product-details/${id}`);
  }

  const handleAddToComparison = (e) => {
    e.stopPropagation();
    if (comparisonItems.length >= 3 && !isInComparison) {
      message.warning('Chỉ có thể so sánh tối đa 3 sản phẩm!');
      return;
    }
    
    if (isInComparison) {
      dispatch(removeFromComparison(id));
      message.success('Đã xóa khỏi danh sách so sánh');
    } else {
      dispatch(addToComparison({ _id: id, name, image, price, rating, type, discount, countInStock, description, selled }));
      message.success('Đã thêm vào danh sách so sánh');
    }
  }

  const handleToggleWishlist = (e) => {
    e.stopPropagation();
    if (isInWishlist) {
      dispatch(removeFromWishlist(id));
      message.success('Đã xóa khỏi yêu thích');
    } else {
      dispatch(addToWishlist({ _id: id, name, image, price, rating, type, discount, countInStock, description, selled }));
      message.success('Đã thêm vào yêu thích');
    }
  }

  return (
    <WrapperCardStyle
        hoverable
        style={{ width: 200 }}
        styles={{
          header: { width: '200px', height: '200px' },
          body: { padding: '10px' }
        }}
        cover={
        <img
            draggable={false}
            alt="example"
            src={image}
        />
        } 
        onClick={() => handleDetailProduct(id)}  
        >

        <img 
          src={Logo} 
          style={{
            width: '68px', height:'14px', position: 'absolute',top: -1, left:-1,
            borderTopLeftRadius: '3px'
          }} 
        />

        {/* Action buttons */}
        <div style={{
          position: 'absolute',
          top: '8px',
          right: '8px',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px'
        }}>
          <Tooltip title={isInWishlist ? 'Bỏ yêu thích' : 'Yêu thích'}>
            <button
              onClick={handleToggleWishlist}
              style={{
                background: 'white',
                border: 'none',
                borderRadius: '50%',
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                transition: 'all 0.3s'
              }}
            >
              {isInWishlist ? (
                <HeartFilled style={{ fontSize: '16px', color: '#ff4d4f' }} />
              ) : (
                <HeartOutlined style={{ fontSize: '16px', color: '#666' }} />
              )}
            </button>
          </Tooltip>

          <Tooltip title={isInComparison ? 'Bỏ so sánh' : 'So sánh'}>
            <button
              onClick={handleAddToComparison}
              style={{
                background: isInComparison ? '#1890ff' : 'white',
                border: 'none',
                borderRadius: '50%',
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                transition: 'all 0.3s'
              }}
            >
              <SwapOutlined style={{ fontSize: '16px', color: isInComparison ? 'white' : '#666' }} />
            </button>
          </Tooltip>
        </div>

        <StyleNameProduct>{name}</StyleNameProduct>
        <WrapperReporText>
          <span style={{ marginRight: '4px' }}>
            <span>{rating}</span> <StarFilled style ={{fontSize: '12px', color:'rgb(253,216,54)'}}/>
          </span>
          <span>| Đã bán {selled || 1000}+</span>
        </WrapperReporText>
         <WrapperPriceText>
              <span style={{marginRight:'8px'}}> {price?.toLocaleString()} </span>
            <WrapperDiscountText> - {discount || 10}% </WrapperDiscountText>
         </WrapperPriceText>
    </WrapperCardStyle>
  )
}

export default CardComponent