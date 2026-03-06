import React from 'react'
import ProductDetailsComponent from '../../components/ProductDetailsComponent/ProductDetailsComponent'
import { WrapperH5 } from './style'
import { useNavigate, useParams } from 'react-router-dom';

const ProductDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  return (
    <div style={{ width: '100%', background: '#f5f5f5', fontSize: '16px', minHeight: '100vh', padding: '24px 0' }}>
      <div style={{ maxWidth: '1270px', margin: '0 auto', padding: '0 20px' }}>
        <WrapperH5>
          <span style={{ cursor: 'pointer' }} onClick={() => { navigate('/') }}>Trang chủ</span> 
          <span style={{ margin: '0 8px', color: '#d9d9d9' }}>/</span>
          <span style={{ color: '#1a94ff' }}>Chi tiết sản phẩm</span>
        </WrapperH5>
        <ProductDetailsComponent idProduct={id} />
      </div>
    </div>
  )
}

export default ProductDetailsPage 