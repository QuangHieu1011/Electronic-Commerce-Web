import styled from 'styled-components';
import Slider from 'react-slick';

export const WrapperSliderStyle = styled(Slider)`
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    margin-top: 20px;
    
    & .slick-arrow.slick-prev {
        left: 20px;
        top: 50%;
        z-index: 10;
        width: 48px;
        height: 48px;
        background-color: rgba(255, 255, 255, 0.9);
        border-radius: 50%;
        transition: all 0.3s ease;
        
        &:hover {
            background-color: #fff;
            transform: scale(1.1);
        }
        
        &::before {
            font-size: 24px;
            color: #d70018;
            opacity: 1;
        }
    } 
    & .slick-arrow.slick-next {
        right: 20px;
        top: 50%;
        z-index: 10;
        width: 48px;
        height: 48px;
        background-color: rgba(255, 255, 255, 0.9);
        border-radius: 50%;
        transition: all 0.3s ease;
        
        &:hover {
            background-color: #fff;
            transform: scale(1.1);
        }
        
        &::before {
            font-size: 24px;
            color: #d70018;
            opacity: 1;
        }
    }
    & .slick-dots {
        z-index: 10;
        bottom: 20px !important;
        li {
            margin: 0 4px;
            button {
                width: 12px;
                height: 12px;
                border-radius: 50%;
                &::before {
                    color: rgba(255, 255, 255, 0.7);
                    font-size: 12px;
                }
            }
        }   
        li.active {
            button{
                width: 32px;
                border-radius: 6px;
                &::before {
                    color: #fff;
                    opacity: 1;
                }
            }
        }
    }
`