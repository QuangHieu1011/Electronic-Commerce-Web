import { Card, Image } from 'antd'
import React from 'react'
import Meta from 'antd/lib/card/Meta'
import { StyleNameProduct, WrapperCardStyle, WrapperDiscountText, WrapperPriceText, WrapperReporText } from './style'
import { StarFilled } from '@ant-design/icons'
import Logo from '../../assets/images/Logo.png'

const CardComponent = (props) => {
  const { countInStock, description, image, name, price, rating, type, selled, discount } = props

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

        <StyleNameProduct>{name}</StyleNameProduct>
        <WrapperReporText>
          <span style={{ marginRight: '4px' }}>
            <span>{rating}</span> <StarFilled style ={{fontSize: '12px', color:'rgb(253,216,54)'}}/>
          </span>
          <span>| Đã bán {selled || 1000}+</span>
        </WrapperReporText>
         <WrapperPriceText>
              <span style={{marginRight:'8px'}}> {price} </span>
            <WrapperDiscountText> {discount || 10}% </WrapperDiscountText>
         </WrapperPriceText>
    </WrapperCardStyle>
  )
}

export default CardComponent