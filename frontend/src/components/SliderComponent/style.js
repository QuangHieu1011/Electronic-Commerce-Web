import styled from 'styled-components';
import Slider from 'react-slick';

export const WrapperSliderStyle = styled(Slider)`
    border-radius: inherit;

    .slick-list,
    .slick-track,
    .slick-slide,
    .slick-slide > div {
        height: 100%;
    }

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
        height: ${({ $imageHeight }) => $imageHeight || '500px'};
        display: block;
        background: #0f2338;
        overflow: hidden;

        img {
            object-fit: cover;
            object-position: center;
            width: 100%;
            height: 100%;
            display: block;
        }
    }

    .hero-slide-1 img {
        object-position: 58% center;
    }

    .hero-slide-2 img {
        object-position: center 55%;
    }

    .hero-slide-3 img {
        object-position: 35% center;
    }

    @media (max-width: 768px) {
        .ant-image {
            height: ${({ $mobileImageHeight }) => $mobileImageHeight || '240px'};

            img {
                object-position: center;
            }
        }

        & .slick-arrow.slick-prev,
        & .slick-arrow.slick-next {
            display: none !important;
        }
    }
`