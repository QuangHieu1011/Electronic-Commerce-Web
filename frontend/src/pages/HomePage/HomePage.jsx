import React from 'react'
import TypeProduct from '../../components/TypeProduct/TypeProduct'
import { WrapperButtonMore, WrapperProducts, WrapperTypeProduct } from './style'
import SliderComponent from '../../components/SliderComponent/SliderComponent'
import slider1 from '../../assets/images/Slider 1.png'
import slider2 from '../../assets/images/Slider 2.png'
import slider3 from '../../assets/images/Slider 3.png'
import CardComponent from '../../components/CardComponent/CardComponent'


const HomePage = () => {
  const arr = ['TV','Laptop','Tủ Lạnh', 'Điện Thoại', 'Máy Ảnh', 'Tai Nghe', 'Đồng Hồ']
  return (
    <>
    <div style={{backgroundColor: '#f5f5f5', minHeight: '100vh', paddingBottom: '40px'}}>
      <div style={{padding: '20px 120px 0', fontSize: '16px'}}>
        <WrapperTypeProduct>  
          {arr.map((item) => {
            return(
              <TypeProduct name={item} key ={item}/>
            )
          })}
        </WrapperTypeProduct>
      </div>

      <div id="container" style={{ padding:'0 120px'}}>
          <SliderComponent arrImages={[slider1, slider2, slider3]} />
          
          <div style={{ marginTop: '24px' }}>
            <div style={{ 
              backgroundColor: '#fff', 
              borderRadius: '12px', 
              padding: '20px', 
              marginBottom: '20px',
              boxShadow: '0 1px 4px rgba(0,0,0,0.08)'
            }}>
              <div style={{ 
                fontSize: '24px', 
                fontWeight: '700', 
                color: '#333', 
                marginBottom: '20px',
                paddingLeft: '12px',
                borderLeft: '4px solid #d70018'
              }}>
                Sản Phẩm Nổi Bật
              </div>
              <WrapperProducts>
                <CardComponent />
                <CardComponent />
                <CardComponent />
                <CardComponent />
                <CardComponent />
                <CardComponent />
                <CardComponent />
                <CardComponent />
                <CardComponent />
                <CardComponent />
              </WrapperProducts>
            </div>
          </div>
          
          <div style={{ display: 'flex', width: '100%', justifyContent: 'center', marginTop: '32px'}}>
           <WrapperButtonMore type="default">
             Xem thêm sản phẩm
          </WrapperButtonMore>
          </div>
      </div>
    </div>
    </>
    
  )
}

export default HomePage