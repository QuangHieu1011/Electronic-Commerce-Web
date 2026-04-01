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
    
    .card-image-wrap {
        width: 100%;
        height: 200px;
        overflow: hidden;
        position: relative;
    }

    .product-image {
        width: 100%;
        height: 100%;
        object-fit: cover;
        display: block;
        transform: translateY(0);
        transition: transform 0.45s cubic-bezier(0.22, 1, 0.36, 1);
        will-change: transform;
    }

    &:hover {
        transform: translateY(-8px);
        box-shadow: 0 12px 24px rgba(0, 0, 0, 0.12);
        border-color: #1a94ff;
        
        .product-image {
            transform: ${props => (props.$enableQuickAdd ? 'translateY(-10px)' : 'translateY(-6px)')};
        }

        .quick-add-btn {
            opacity: 1;
            transform: translateY(0);
            pointer-events: auto;
        }
    }

    .ant-card-body {
        padding: 12px;
    }

    @media (max-width: 768px) {
        .card-image-wrap {
            height: 160px;
        }
        
        .ant-card-body {
            padding: 10px;
            padding-bottom: ${props => (props.$enableQuickAdd ? '52px' : '10px')};
        }

        &:hover {
            transform: translateY(-4px);
        }

        .quick-add-btn {
            opacity: 1;
            transform: translateY(0);
            pointer-events: auto;
        }
    }

    @media (max-width: 480px) {
        .card-image-wrap {
            height: 140px;
        }
    }
`

export const WrapperQuickAddButton = styled.button`
    position: absolute;
    left: 10px;
    right: 10px;
    bottom: 10px;
    height: 34px;
    border: none;
    border-radius: 8px;
    background: #1a94ff;
    color: #fff;
    font-size: 13px;
    font-weight: 600;
    letter-spacing: 0.2px;
    cursor: pointer;
    opacity: 0;
    transform: translateY(120%);
    pointer-events: none;
    transition: transform 0.3s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.22s ease, background-color 0.2s ease;
    z-index: 2;

    &:hover:not(:disabled) {
        background: #0b77e3;
    }

    &:disabled {
        background: #e5e7eb;
        color: #9ca3af;
        cursor: not-allowed;
        opacity: 1;
        transform: translateY(0);
        pointer-events: auto;
    }

    @media (max-width: 768px) {
        opacity: 1;
        transform: translateY(0);
        pointer-events: auto;
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

