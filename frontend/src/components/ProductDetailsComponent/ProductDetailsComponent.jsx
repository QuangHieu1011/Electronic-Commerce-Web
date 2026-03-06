import { Button, Col, Image,Rate, Row } from 'antd'
import React, { useState } from 'react'

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
  WrapperInputNumber
} from './style'
import * as ProductService from '../../service/ProductService'
import { useQuery } from '@tanstack/react-query'
import Loading from '../LoadingComponent/Loading'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { addToCart } from '../../redux/slides/cartSlice'
import { message } from 'antd'
import CardComponent from '../CardComponent/CardComponent'
import { formatPrice } from '../../utils'


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

  // Fetch similar products based on type
  const fetchSimilarProducts = async () => {
    if (productDetails?.type) {
      const res = await ProductService.getAllProduct('', 8, 0, null, ['type', productDetails.type])
      // Filter out current product
      return res.data.filter(item => item._id !== idProduct)
    }
    return []
  }

  const { data: similarProducts = [] } = useQuery({
    queryKey: ['similar-products', productDetails?.type, idProduct],
    queryFn: fetchSimilarProducts,
    enabled: !!productDetails?.type,
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
      <Row style={{ padding: '24px', background: '#fff', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.06)' }}>

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
            <WrapperPriceTextProduct>{formatPrice(productDetails?.price)}</WrapperPriceTextProduct>
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
                backgroundColor: '#1a94ff',
                height: '48px',
                width: '220px',
                border: 'none',
                borderRadius: '8px',
                color: '#fff',
                fontSize: '15px',
                fontWeight: '600',
                margin: '26px 0 10px',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#0d7de8'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#1a94ff'}
            >
              Chọn mua
            </Button>

            <Button
              style={{
                backgroundColor: '#fff',
                height: '48px',
                width: '220px',
                border: '2px solid #1a94ff',
                borderRadius: '8px',
                color: '#1a94ff',
                fontSize: '15px',
                fontWeight: '600',
                margin: '26px 0 10px',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#1a94ff';
                e.currentTarget.style.color = '#fff';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#fff';
                e.currentTarget.style.color = '#1a94ff';
              }}
            >
              Mua trả sau
            </Button>

          </div>
        </Col>
      </Row>

      {/* Mô tả sản phẩm */}
      <Row style={{ padding: '24px', background: '#fff', borderRadius: '8px', marginTop: '20px', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.06)' }}>
        <Col span={24}>
          <h2 style={{ 
            fontSize: '20px', 
            fontWeight: '600', 
            marginBottom: '20px',
            color: '#262626',
            borderLeft: '4px solid #1a94ff',
            paddingLeft: '16px'
          }}>
            Mô tả sản phẩm
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
      <Row style={{ padding: '24px', background: '#fff', borderRadius: '8px', marginTop: '20px', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.06)' }}>
        <Col span={24}>
          <h2 style={{ 
            fontSize: '20px', 
            fontWeight: '600', 
            marginBottom: '20px',
            color: '#262626',
            borderLeft: '4px solid #1a94ff',
            paddingLeft: '16px'
          }}>
            Đánh giá & Nhận xét
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
                    background: '#1a94ff',
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
                      giao hàng nhanh. Mình sẽ tiếp tục ủng hộ shop!
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
                          border: '1px solid #e5e7eb',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '12px',
                          color: '#8c8c8c'
                        }}>
                          Ảnh {imgIndex}
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
                fontWeight: '600',
                border: '1px solid #1a94ff',
                color: '#1a94ff'
              }}
            >
              Xem thêm đánh giá
            </Button>
          </div>
        </Col>
      </Row>

      {/* Sản phẩm tương tự */}
      {similarProducts.length > 0 && (
        <Row style={{ padding: '24px', background: '#fff', borderRadius: '8px', marginTop: '20px', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.06)' }}>
          <Col span={24}>
            <h2 style={{ 
              fontSize: '20px', 
              fontWeight: '600', 
              marginBottom: '24px',
              color: '#262626',
              borderLeft: '4px solid #1a94ff',
              paddingLeft: '16px'
            }}>
              Có thể bạn cũng thích
            </h2>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
              gap: '20px',
              justifyItems: 'center'
            }}>
              {similarProducts.slice(0, 6).map((product) => (
                <CardComponent
                  key={product._id}
                  countInStock={product.countInStock}
                  description={product.description}
                  image={product.image}
                  name={product.name}
                  price={product.price}
                  rating={product.rating}
                  type={product.type}
                  selled={product.selled}
                  discount={product.discount}
                  id={product._id}
                />
              ))}
            </div>
          </Col>
        </Row>
      )}
    </Loading>
  )
}

export default ProductDetailsComponent
