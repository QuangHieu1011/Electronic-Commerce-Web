import React from 'react'
import ProductDetailsComponent from '../../components/ProductDetailsComponent/ProductDetailsComponent'
import { WrapperH5 } from './style'

const ProductDetailsPage = () => {
  return (
    <div style={{padding: '0 120px', background:'#efefef',fontSize: '16px',height: '1000px'}}>
        <WrapperH5>Trang chủ</WrapperH5>
        <div>
            <ProductDetailsComponent />
        </div>
    </div>
  )
}

export default ProductDetailsPage 