import styled from 'styled-components';
import Slider from 'react-slick';

export const WrapperSliderStyle = styled(Slider)`
    & .slick-arrow.slick-prev {
        left: 12px;
        top: 50%;
        z-index: 10;
        &::before {
            font-size: 40px;
            color: #fff;
        }
    } 
    & .slick-arrow.slick-next {
        right: 28px;
        top: 50%;
        z-index: 10;
        &::before {
            font-size: 40px;
            color: #fff;
        }
    }
    & .slick-dots {
        z-index: 10;
        bottom: -2px !important;
        li {
            button {
                &::before {
                    color:#ff0000;
                }
            }
        }   
        li.active {
            button{
                &::before {
                color: #fff;
                }
            }
        }
    }
    
    .ant-image {
        img {
            object-fit: cover;
            width: 100%;
            height: 300px;
        }
    }
`