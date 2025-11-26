import { Button, Col, Image, InputNumber, Rate, Row } from 'antd'
import React, { useState } from 'react'
import imageProduct from '../../assets/images/Iphone.png'
import imageProductSmall from '../../assets/images/Iphonesmall.png'
import { MinusOutlined, PlusOutlined, StarFilled } from '@ant-design/icons'
import {
  WrapperStyleColImage,
  WrapperStyleImageSmall,
  WrapperContainerImage,
  WrapperListImage,
  WrapperStyleNameProduct,
  WrapperStyleTextSell,
  WrapperPriceProduct,
  WrapperPriceTextProduct,
  WrapperAddressProduct,
  WrapperQualityProduct,
  WrapperInputNumber,
  WrapperBtnQualityProduct
} from './style'
import * as ProductService from '../../service/ProductService'
import { useQuery } from '@tanstack/react-query'
import Loading from '../LoadingComponent/Loading'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { addToCart } from '../../redux/slides/cartSlice'
import { message } from 'antd'


const ProductDetailsComponent = ({ idProduct }) => {
  const [numProduct, setNumProduct] = useState(1);
  const [selectedImage, setSelectedImage] = useState('');
  const user = useSelector((state) => state?.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const onChange = (value) => {
    setNumProduct(Number(value));
  }

  const fetchGetDetailsProduct = async (context) => {
    const id = context?.queryKey && context?.queryKey[1]
    if (id) {
      const res = await ProductService.getDetailsProduct(id)
      return res.data
    }
  }

  const handleChangeCount = (type) => {
    if (type === 'increase') {
      setNumProduct((prev) => prev + 1);
    } else if (type === 'decrease') {
      setNumProduct((prev) => (prev - 1) >= 1 ? prev - 1 : 1);
    }
  }

  const handleAddToCart = () => {
    if (!productDetails) {
      message.error('Không thể thêm sản phẩm vào giỏ hàng!');
      return;
    }

    if (numProduct < 1) {
      message.warning('Vui lòng chọn số lượng!');
      return;
    }

    dispatch(addToCart({
      product: productDetails,
      quantity: numProduct
    }));

    message.success(`Đã thêm ${numProduct} sản phẩm vào giỏ hàng!`);

    // Chuyển đến trang giỏ hàng
    navigate('/order');
  };


  const { isPending, data: productDetails } = useQuery({
    queryKey: ['product-details', idProduct],
    queryFn: fetchGetDetailsProduct,
    enabled: !!idProduct,
  })

  // Khởi tạo selectedImage khi productDetails load xong
  React.useEffect(() => {
    if (productDetails?.image) {
      setSelectedImage(productDetails.image);
    }
  }, [productDetails]);

  // Kết hợp ảnh chính và ảnh phụ
  const allImages = React.useMemo(() => {
    if (!productDetails) return [];
    const images = [productDetails.image];
    if (productDetails.images && productDetails.images.length > 0) {
      images.push(...productDetails.images.slice(0, 5));
    }
    return images.slice(0, 6);
  }, [productDetails]);


  return (
    <Loading isLoading={isPending}>
      <Row style={{ padding: '16px', background: '#fff', borderRadius: '4px' }}>

        <Col span={10} style={{ borderRight: '1px solid #e5e5e5', paddingRight: '10px' }}>
          <WrapperContainerImage>
            <Image
              src={selectedImage || productDetails?.image}
              alt="image product"
              preview={false}
            />
          </WrapperContainerImage>

          <WrapperListImage>
            {allImages.map((img, index) => (
              <WrapperStyleColImage 
                key={index}
                onClick={() => setSelectedImage(img)}
                style={{
                  cursor: 'pointer',
                  border: selectedImage === img ? '3px solid #1890ff' : '3px solid transparent',
                  boxShadow: selectedImage === img ? '0 4px 16px rgba(24, 144, 255, 0.3)' : 'none',
                  transform: selectedImage === img ? 'scale(1.02)' : 'scale(1)',
                  background: selectedImage === img ? '#fff' : '#f8f8f8'
                }}
              >
                <WrapperStyleImageSmall
                  src={img}
                  alt={`${productDetails?.name} ${index + 1}`}
                  preview={false}
                  style={{
                    opacity: selectedImage === img ? 1 : 0.75,
                    transition: 'opacity 0.3s ease'
                  }}
                />
              </WrapperStyleColImage>
            ))}
          </WrapperListImage>
        </Col>


        <Col span={14} style={{ paddingLeft: '10px' }}>
          <WrapperStyleNameProduct> {productDetails?.name} </WrapperStyleNameProduct>
          <div>
            <Rate allowHalf value={productDetails?.rating} disabled style={{ fontSize: '16px', color: 'rgb(253,216,54)' }} />
            <WrapperStyleTextSell>| Đã bán 1000+</WrapperStyleTextSell>
          </div>
          <WrapperPriceProduct>
            <WrapperPriceTextProduct>{productDetails?.price}</WrapperPriceTextProduct>
          </WrapperPriceProduct>
          <WrapperAddressProduct>
            <span>Giao đến </span>
            <span className='address'>{user?.address}</span> -
            <span className='change-address'>Đổi địa chỉ</span>
          </WrapperAddressProduct>
          <div style={{ margin: '10px 0 10px', borderTop: '1px solid #e5e5e5', borderBottom: '1px solid #e5e5e5', padding: '10px 0' }}>
            <div style={{ marginBottom: '10px' }}>Số lượng</div>
            <WrapperQualityProduct>
              <button style={{ border: 'none', background: 'transparent', cursor: 'pointer' }} onClick={() => handleChangeCount('decrease')}>
                <MinusOutlined style={{ color: '#000', fontSize: '20px' }} />
              </button>

              <WrapperInputNumber onChange={onChange} value={numProduct} defaultValue={1} />

              <button style={{ border: 'none', background: 'transparent', cursor: 'pointer' }} onClick={() => handleChangeCount('increase')}>
                <PlusOutlined style={{ color: '#000', fontSize: '20px' }} />
              </button>
            </WrapperQualityProduct>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <Button
              onClick={handleAddToCart}
              style={{
                backgroundColor: 'rgb(255, 57, 69)',
                height: '48px',
                width: '220px',
                border: 'none',
                borderRadius: '4px',
                color: '#fff',
                fontSize: '15px',
                fontWeight: '700',
                margin: '26px 0 10px'
              }}
            >
              Chọn mua
            </Button>

            <Button
              style={{
                backgroundColor: '#fff',
                height: '48px',
                width: '220px',
                border: '1px solid rgb(13, 92, 182)',
                borderRadius: '4px',
                color: 'rgb(13, 92, 182)',
                fontSize: '15px',
                fontWeight: '500',
                margin: '26px 0 10px'
              }}
            >
              Mua trả sau
            </Button>

          </div>
        </Col>
      </Row>

      {/* Mô tả sản phẩm */}
      <Row style={{ padding: '24px', background: '#fff', borderRadius: '12px', marginTop: '20px' }}>
        <Col span={24}>
          <h2 style={{ 
            fontSize: '22px', 
            fontWeight: '700', 
            marginBottom: '20px',
            borderBottom: '2px solid #1890ff',
            paddingBottom: '12px'
          }}>
            📝 Mô tả sản phẩm
          </h2>
          <div style={{ 
            fontSize: '15px', 
            lineHeight: '1.8',
            color: '#595959',
            whiteSpace: 'pre-wrap'
          }}>
            {productDetails?.description || 'Chưa có mô tả chi tiết cho sản phẩm này.'}
          </div>
        </Col>
      </Row>

      {/* Đánh giá và bình luận */}
      <Row style={{ padding: '24px', background: '#fff', borderRadius: '12px', marginTop: '20px' }}>
        <Col span={24}>
          <h2 style={{ 
            fontSize: '22px', 
            fontWeight: '700', 
            marginBottom: '20px',
            borderBottom: '2px solid #1890ff',
            paddingBottom: '12px'
          }}>
            ⭐ Đánh giá & Nhận xét
          </h2>

          {/* Tổng quan đánh giá */}
          <div style={{ 
            display: 'flex', 
            gap: '40px', 
            padding: '24px',
            background: '#fafafa',
            borderRadius: '8px',
            marginBottom: '24px'
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '48px', fontWeight: '700', color: '#faad14' }}>
                {productDetails?.rating || 0}
              </div>
              <Rate 
                allowHalf 
                value={productDetails?.rating || 0} 
                disabled 
                style={{ fontSize: '20px', color: '#faad14' }} 
              />
              <div style={{ marginTop: '8px', color: '#8c8c8c' }}>
                {productDetails?.selled || 0} đánh giá
              </div>
            </div>
            <div style={{ flex: 1 }}>
              {[5, 4, 3, 2, 1].map(star => (
                <div key={star} style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '12px',
                  marginBottom: '8px'
                }}>
                  <span style={{ width: '80px' }}>{star} <StarFilled style={{ color: '#faad14' }} /></span>
                  <div style={{ 
                    flex: 1, 
                    height: '8px', 
                    background: '#e8e8e8', 
                    borderRadius: '4px',
                    overflow: 'hidden'
                  }}>
                    <div style={{ 
                      width: `${star === 5 ? 70 : star === 4 ? 20 : 10}%`, 
                      height: '100%', 
                      background: '#faad14',
                      transition: 'width 0.3s ease'
                    }} />
                  </div>
                  <span style={{ width: '60px', textAlign: 'right', color: '#8c8c8c' }}>
                    {star === 5 ? 70 : star === 4 ? 20 : 10}%
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Danh sách bình luận demo */}
          <div style={{ marginTop: '24px' }}>
            {[1, 2, 3].map(index => (
              <div key={index} style={{ 
                padding: '20px',
                borderBottom: '1px solid #f0f0f0',
                transition: 'background 0.3s ease'
              }}>
                <div style={{ display: 'flex', gap: '16px' }}>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '20px',
                    fontWeight: '600'
                  }}>
                    {String.fromCharCode(65 + index)}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                      <span style={{ fontWeight: '600', fontSize: '15px' }}>
                        Khách hàng {index}
                      </span>
                      <Rate 
                        allowHalf 
                        value={5} 
                        disabled 
                        style={{ fontSize: '14px', color: '#faad14' }} 
                      />
                    </div>
                    <div style={{ color: '#8c8c8c', fontSize: '13px', marginBottom: '12px' }}>
                      {new Date(Date.now() - index * 86400000).toLocaleDateString('vi-VN')}
                    </div>
                    <div style={{ fontSize: '14px', lineHeight: '1.6', color: '#595959' }}>
                      Sản phẩm rất tốt, chất lượng đúng như mô tả. Shop phục vụ nhiệt tình, 
                      giao hàng nhanh. Mình sẽ [综 tiếp ủng hộ shop! 👍
                    </div>
                    <div style={{ 
                      marginTop: '12px',
                      display: 'flex',
                      gap: '8px',
                      flexWrap: 'wrap'
                    }}>
                      {[1, 2].map(imgIndex => (
                        <div key={imgIndex} style={{
                          width: '80px',
                          height: '80px',
                          background: '#f5f5f5',
                          borderRadius: '8px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '12px',
                          color: '#8c8c8c'
                        }}>
                          📷
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Nút xem thêm */}
          <div style={{ textAlign: 'center', marginTop: '24px' }}>
            <Button 
              size="large"
              style={{
                borderRadius: '8px',
                padding: '0 40px',
                height: '44px',
                fontWeight: '600'
              }}
            >
              Xem thêm đánh giá
            </Button>
          </div>
        </Col>
      </Row>
    </Loading>
  )
}

export default ProductDetailsComponent
