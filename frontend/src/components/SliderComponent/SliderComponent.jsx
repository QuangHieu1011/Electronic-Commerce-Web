import { Image } from 'antd';
import React from 'react'
import { WrapperSliderStyle } from './style';


const SliderComponent = ({
    arrImages,
    imageHeight = '300px',
    mobileImageHeight = '220px',
    autoplay = true,
    autoplaySpeed = 3000
}) => {
    const settings = {
        dots: true,
        infinite: true,
                speed: 550,
        slidesToShow: 1,
        slidesToScroll: 1,
                autoplay,
                autoplaySpeed
  };

  return (
        <WrapperSliderStyle
            {...settings}
            $imageHeight={imageHeight}
            $mobileImageHeight={mobileImageHeight}
        >
        {arrImages.map((image)=> {
            return (
                                <Image key={image} src={image} alt="slider" preview={false} width="100%" />
            )
        })}
    </WrapperSliderStyle>
  )
}

export default SliderComponent