import React from 'react'
import ProductDetailsComponent from '../../components/ProductDetailsComponent/ProductDetailsComponent'
import { WrapperH5 } from './style'
import { useNavigate, useParams } from 'react-router-dom';

const ProductDetailsPage = () => {
  const {id} = useParams();
  const navigate = useNavigate();
  
  return (
    <div style={{padding: '0 120px', background:'#efefef',fontSize: '16px',height: '1000px'}}>
        <WrapperH5><span style={{cursor: 'pointer', fontWeight: 'bold'}} onClick={() =>{navigate('/')}}>Trang chủ</span> - Chi tiết sản phẩm</WrapperH5>
        <div>
            <ProductDetailsComponent idProduct={id} />
        </div>
    </div>
  )
}

export default ProductDetailsPage 