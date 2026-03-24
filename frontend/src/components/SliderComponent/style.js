import styled from 'styled-components';
import Slider from 'react-slick';

export const WrapperSliderStyle = styled(Slider)`
    & .slick-arrow.slick-prev {
        left: 14px;
        top: 50%;
        z-index: 10;
        &::before {
            font-size: 34px;
            color: #fff;
            opacity: 0.9;
        }
    } 
    & .slick-arrow.slick-next {
        right: 30px;
        top: 50%;
        z-index: 10;
        &::before {
            font-size: 34px;
            color: #fff;
            opacity: 0.9;
        }
    }
    & .slick-dots {
        z-index: 10;
        bottom: 8px !important;
        li {
            button {
                &::before {
                    color: rgba(255, 255, 255, 0.7);
                    font-size: 9px;
                }
            }
        }   
        li.slick-active {
            button{
                &::before {
                color: #fff;
                }
            }
        }
    }
    
    .ant-image {
        width: 100%;
        display: block;
        background: #0f2338;

        img {
            object-fit: contain;
            object-position: center;
            width: 100%;
            height: ${({ $imageHeight }) => $imageHeight || '300px'};
            display: block;
        }
    }

    @media (max-width: 768px) {
        .ant-image {
            img {
                height: ${({ $mobileImageHeight }) => $mobileImageHeight || '220px'};
            }
        }

        & .slick-arrow.slick-prev,
        & .slick-arrow.slick-next {
            display: none !important;
        }
    }
`