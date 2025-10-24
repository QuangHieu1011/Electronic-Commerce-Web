import React from 'react'
import TypeProduct from '../../components/TypeProduct/TypeProduct'
import { WrapperButtonMore, WrapperProducts, WrapperTypeProduct } from './style'
import SliderComponent from '../../components/SliderComponent/SliderComponent'
import slider1 from '../../assets/images/Slider 1.png'
import slider2 from '../../assets/images/Slider 2.png'
import slider3 from '../../assets/images/Slider 3.png'
import CardComponent from '../../components/CardComponent/CardComponent'


const HomePage = () => {
  const arr = ['TV','Laptop','Tủ Lạnh']
  return (
    <>
    <div style={{padding: '0 120px', fontSize: '16px'}}>
      <WrapperTypeProduct>  
        {arr.map((item) => {
          return(
            <TypeProduct name={item} key ={item}/>
          )
        })}
      </WrapperTypeProduct>
    </div>

    <div id="container" style={{ backgroundColor: '#efefef', padding:'0 120px',height: '1000px'}}>
        <SliderComponent arrImages={[slider1, slider2, slider3]} />
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
        <div style={{ display: 'flex', width: '100%', justifyContent: 'center', marginTop: '20px'}}>
         <WrapperButtonMore type="default">
           Xem thêm
        </WrapperButtonMore>
        </div>
    </div>
    </>
    
  )
}

export default HomePage