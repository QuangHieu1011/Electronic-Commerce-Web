import React from 'react'
import ProductDetailsComponent from '../../components/ProductDetailsComponent/ProductDetailsComponent'
import { WrapperH5 } from './style'
import { useNavigate, useParams } from 'react-router-dom';

const ProductDetailsPage = () => {
  const {id} = useParams();
  const navigate = useNavigate();
  
  return (
    <div style={{width: '100%', background:'#efefef',fontSize: '16px',height: '100vh'}}>
      <div style={{width:'1270px', margin:'0 auto', height: '100%' }}>
        <WrapperH5><span style={{cursor: 'pointer', fontWeight: 'bold'}} onClick={() =>{navigate('/')}}>Trang chủ</span> - Chi tiết sản phẩm</WrapperH5>
        <div>
            <ProductDetailsComponent idProduct={id} />
        </div>
    </div>
    </div>
  )
}

export default ProductDetailsPage 