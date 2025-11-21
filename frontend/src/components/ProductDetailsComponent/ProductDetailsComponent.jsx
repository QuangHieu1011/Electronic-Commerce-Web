import { Button, Col, Image, InputNumber, Row } from 'antd'
import React from 'react'
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

const ProductDetailsComponent = () => {
  const onChange = () => { }
  return (
    <Row style={{ padding: '24px', background: '#fff', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>

      <Col span={10} style={{ borderRight: '1px solid #e5e5e5', paddingRight: '10px' }}>
        <WrapperContainerImage>
          <Image 
            src={imageProduct} 
            alt="image product" 
            preview={false} 
          />
        </WrapperContainerImage>

        <WrapperListImage>
          {[1, 2, 3, 4, 5, 6].map((_, index) => (
            <WrapperStyleColImage key={index}>
              <WrapperStyleImageSmall 
                src={imageProductSmall} 
                alt={`image small ${index + 1}`} 
                preview={false} 
              />
            </WrapperStyleColImage>
          ))}
        </WrapperListImage>
      </Col>

      
      <Col span={14} style={{ paddingLeft: '10px' }}>
          <WrapperStyleNameProduct> Apple Iphone 16 Promax</WrapperStyleNameProduct>
          <div>
            <StarFilled style ={{fontSize: '12px', color:'rgb(253,216,54)'}}/>
            <StarFilled style ={{fontSize: '12px', color:'rgb(253,216,54)'}}/>
            <StarFilled style ={{fontSize: '12px', color:'rgb(253,216,54)'}}/>
            <WrapperStyleTextSell>| Đã bán 1000+</WrapperStyleTextSell>
          </div>
          <WrapperPriceProduct>
            <WrapperPriceTextProduct>16.000.000</WrapperPriceTextProduct>
          </WrapperPriceProduct>
          <WrapperAddressProduct>
            <span>Giao đến </span>
            <span className='address'> Q. 1,P. Bến Nghé, Hồ Chí Minh</span> -
            <span className='change-address'>Đổi địa chỉ</span>
          </WrapperAddressProduct>
          <div style={{margin:'10px 0 10px', borderTop: '1px solid #e5e5e5', borderBottom: '1px solid #e5e5e5', padding:'10px 0'}}>
            <div style={{marginBottom:'10px'}}>Số lượng</div>
            <WrapperQualityProduct>
             <button style={{border: 'none', background: 'transparent', cursor: 'pointer'}}>
                  <MinusOutlined style={{color: '#000', fontSize:'20px'}}/>
              </button>

              <WrapperInputNumber  defaultValue={3} onChange={onChange} />
              
             <button style={{border: 'none', background: 'transparent', cursor: 'pointer'}}>
                  <PlusOutlined style={{color: '#000', fontSize:'20px'}}/>
              </button>
            </WrapperQualityProduct>
          </div>
          <div style ={{ display:'flex', alignItems:'center', gap: '16px'}}>
            <Button
                  style={{
                    backgroundColor: '#d70018',
                    height: '52px',
                    width: '220px',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#fff', 
                    fontSize: '16px', 
                    fontWeight: '700',
                    margin:'26px 0 10px',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 4px 12px rgba(215, 0, 24, 0.3)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#b8001a'
                    e.currentTarget.style.transform = 'translateY(-2px)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#d70018'
                    e.currentTarget.style.transform = 'translateY(0)'
                  }}
                >
                  Chọn mua
            </Button>

            <Button
                  style={{
                    backgroundColor: '#fff',
                    height: '52px',
                    width: '220px',
                    border: '2px solid #d70018',
                    borderRadius: '8px',
                    color: '#d70018', 
                    fontSize: '16px', 
                    fontWeight: '600',
                    margin:'26px 0 10px',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#fff5f5'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#fff'
                  }}
                >
                  Mua trả sau
            </Button>

          </div>
      </Col>
    </Row>
  )
}

export default ProductDetailsComponent
