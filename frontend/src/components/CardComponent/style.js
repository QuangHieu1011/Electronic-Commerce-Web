import { Card } from "antd";
import styled from "styled-components";

export const WrapperCardStyle = styled(Card)`
    width: 100%;
    height: 100%;
    border-radius: 12px;
    overflow: hidden;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    cursor: pointer;
    border: 1px solid #f0f0f0;
    position: relative;
    background: #fff;
    
    & img {
        width: 100%;
        height: 200px;
        object-fit: cover;
        transition: transform 0.4s ease;
    }

    &:hover {
        transform: translateY(-8px);
        box-shadow: 0 12px 24px rgba(0, 0, 0, 0.12);
        border-color: #1a94ff;
        
        & img {
            transform: scale(1.08);
        }
    }

    .ant-card-body {
        padding: 12px;
    }

    @media (max-width: 768px) {
        & img {
            height: 160px;
        }
        
        .ant-card-body {
            padding: 10px;
        }

        &:hover {
            transform: translateY(-4px);
        }
    }

    @media (max-width: 480px) {
        & img {
            height: 140px;
        }
    }
`

export const StyleNameProduct = styled.div`
    font-weight: 500;
    font-size: 14px;
    line-height: 1.4;
    color: rgb(56,56,61);
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    height: 40px;
    margin-bottom: 8px;

    @media (max-width: 768px) {
        font-size: 13px;
        height: 36px;
    }
`

export const WrapperReporText = styled.div`
    font-size: 12px;
    color: rgb(128,128,137);
    display: flex;
    align-items: center;
    gap: 8px;
    margin: 6px 0 8px;

    @media (max-width: 768px) {
        font-size: 11px;
        gap: 6px;
    }
`

export const WrapperPriceText = styled.div`
    color: rgb(255, 66, 78);
    font-size: 18px;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 8px;

    @media (max-width: 768px) {
        font-size: 16px;
    }
`

export const WrapperDiscountText = styled.span`
    color: rgb(255,66,78);
    font-size: 12px;
    font-weight: 600;
    background: rgba(255, 66, 78, 0.1);
    padding: 2px 6px;
    border-radius: 4px;
    
    @media (max-width: 768px) {
        font-size: 11px;
        padding: 2px 4px;
    }
`

export const WrapperStockBadge = styled.div`
    position: absolute;
    top: 12px;
    right: 12px;
    background: ${props => props.inStock ? 'rgba(82, 196, 26, 0.9)' : 'rgba(255, 77, 79, 0.9)'};
    color: white;
    padding: 4px 10px;
    border-radius: 20px;
    font-size: 11px;
    font-weight: 600;
    z-index: 1;
    backdrop-filter: blur(4px);

    @media (max-width: 768px) {
        top: 8px;
        right: 8px;
        font-size: 10px;
        padding: 3px 8px;
    }
`

