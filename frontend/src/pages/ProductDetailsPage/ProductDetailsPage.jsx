import React from 'react'
import ProductDetailsComponent from '../../components/ProductDetailsComponent/ProductDetailsComponent'
import { WrapperH5 } from './style'

const ProductDetailsPage = () => {
  return (
    <div style={{padding: '20px 120px', background:'#f5f5f5',fontSize: '16px', minHeight: '100vh'}}>
        <WrapperH5>Trang chủ</WrapperH5>
        <div style={{ marginTop: '20px' }}>
            <ProductDetailsComponent />
        </div>
    </div>
  )
}

export default ProductDetailsPage 