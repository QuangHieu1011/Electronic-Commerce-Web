import { Card, Image } from 'antd'
import React from 'react'
import Meta from 'antd/lib/card/Meta'
import { StyleNameProduct, WrapperCardStyle, WrapperDiscountText, WrapperPriceText, WrapperReporText } from './style'
import { StarFilled } from '@ant-design/icons'
import Logo from '../../assets/images/Logo.png'

const CardComponent = () => {
  return (
    <WrapperCardStyle
        hoverable
        cover={
          <div style={{ position: 'relative', overflow: 'hidden' }}>
            <img
                draggable={false}
                alt="example"
                src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png"
            />
            <div style={{
              position: 'absolute',
              top: '8px',
              left: '8px',
              background: 'linear-gradient(135deg, #d70018 0%, #ff3838 100%)',
              color: '#fff',
              padding: '4px 10px',
              borderRadius: '6px',
              fontSize: '11px',
              fontWeight: '700',
              boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
            }}>
              GIẢM 10%
            </div>
            <img 
              src={Logo} 
              style={{
                width: '68px', height:'14px', position: 'absolute', bottom: '8px', left:'8px',
                borderRadius: '4px'
              }} 
            />
          </div>
        }   
        >

        <StyleNameProduct>iPhone 15 Pro Max 256GB - Chính hãng VN/A</StyleNameProduct>
        <WrapperReporText>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ fontWeight: '600', color: '#333' }}>4.9</span> 
            <StarFilled style ={{fontSize: '12px', color:'#ffc107'}}/>
          </span>
          <span style={{ color: '#999' }}>| Đã bán 1.2k</span>
        </WrapperReporText>
         <WrapperPriceText>
              <span>29.990.000đ</span>
            <WrapperDiscountText>-10%</WrapperDiscountText>
         </WrapperPriceText>
         <div style={{ fontSize: '12px', color: '#999', textDecoration: 'line-through', marginTop: '4px' }}>
           33.290.000đ
         </div>
    </WrapperCardStyle>
  )
}

export default CardComponent