import { Card } from "antd";
import styled from "styled-components";

export const WrapperCardStyle = styled(Card)`
    width: 100%;
    border-radius: 12px;
    overflow: hidden;
    transition: all 0.3s ease;
    border: 1px solid #e0e0e0;
    background: #fff;
    position: relative;
    
    & img {
        width: 100%;
        height: 220px;
        object-fit: cover;
        transition: transform 0.3s ease;
    }
    
    &:hover {
        transform: translateY(-4px);
        box-shadow: 0 8px 20px rgba(0,0,0,0.12);
        border-color: #d70018;
    }
    
    &:hover img {
        transform: scale(1.05);
    }
    
    .ant-card-body {
        padding: 12px;
    }
`

export const StyleNameProduct = styled.div`
    font-weight: 500;
    font-size: 14px;
    line-height: 20px;
    color: #333;
    margin-bottom: 8px;
    height: 40px;
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    text-overflow: ellipsis;
`
export const WrapperReporText = styled.div`
    font-size: 12px;
    color: rgb(128,128,137);
    display: flex;
    align-items: center;
    gap: 8px;
    margin: 8px 0;
`
export const WrapperPriceText = styled.div`
    color: #d70018;
    font-size: 18px;
    font-weight: 700;
    margin-top: 8px;
    display: flex;
    align-items: center;
    gap: 8px;
`

export const WrapperDiscountText = styled.span`
    color: #fff;
    background-color: #d70018;
    font-size: 12px;
    font-weight: 600;
    padding: 2px 6px;
    border-radius: 4px;
`

export const PromotionBadge = styled.div`
    position: absolute;
    top: 8px;
    left: 8px;
    background: linear-gradient(135deg, #d70018 0%, #ff3838 100%);
    color: #fff;
    padding: 4px 8px;
    border-radius: 6px;
    font-size: 11px;
    font-weight: 700;
    z-index: 2;
    box-shadow: 0 2px 4px rgba(0,0,0,0.2);
`

