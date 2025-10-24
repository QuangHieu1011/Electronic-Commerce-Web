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
        headStyle={{width:'200px', height:'200px'}}
        style={{ width: 200 }}
        bodyStyle={{ padding: '10px' }}
        cover={
        <img
            draggable={false}
            alt="example"
            src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png"
        />
        }   
        >

        <img 
          src={Logo} 
          style={{
            width: '68px', height:'14px', position: 'absolute',top: -1, left:-1,
            borderTopLeftRadius: '3px'
          }} 
        />

        <StyleNameProduct>Iphone</StyleNameProduct>
        <WrapperReporText>
          <span style={{ marginRight: '4px' }}>
            <span>4.96</span> <StarFilled style ={{fontSize: '12px', color:'rgb(253,216,54)'}}/>
          </span>
          <span>| Đã bán 1000+</span>
        </WrapperReporText>
         <WrapperPriceText>
              <span style={{marginRight:'8px'}}> 5.000.000đ </span>
            <WrapperDiscountText> -10% </WrapperDiscountText>
         </WrapperPriceText>
    </WrapperCardStyle>
  )
}

export default CardComponent