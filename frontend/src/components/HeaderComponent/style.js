import { Row } from 'antd';
import styled from 'styled-components';

export const WrapperHeader = styled(Row)`
    padding: 15px 120px;
    background: linear-gradient(135deg, rgb(26, 148, 255) 0%, rgb(13, 110, 253) 100%);
    align-items: center;  
    width: 100%;
    box-sizing: border-box;
    gap: 16px;
    flex-wrap: nowrap;
    position: sticky;
    top: 0;
    z-index: 999;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
    transition: all 0.3s ease;
    backdrop-filter: blur(10px);

    @media (max-width: 1200px) {
        padding: 15px 60px;
        gap: 12px;
    }

    @media (max-width: 992px) {
        padding: 12px 40px;
        gap: 10px;
    }

    @media (max-width: 768px) {
        padding: 10px 16px;
        gap: 8px;
        flex-wrap: wrap;
    }
`

export const WrapperTextHeader = styled.span`
    font-size: 24px;
    color: #fff;
    font-weight: 800;
    letter-spacing: -0.5px;
    cursor: pointer;
    transition: transform 0.3s ease;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);

    &:hover {
        transform: scale(1.05);
    }

    @media (max-width: 992px) {
        font-size: 20px;
    }

    @media (max-width: 768px) {
        font-size: 18px;
    }
`

export const WrapperHeaderAccount = styled.div`
    display: flex;
    align-items: center;
    color: #fff;
    gap: 12px;
    cursor: pointer;
    padding: 8px 12px;
    border-radius: 8px;
    transition: all 0.3s ease;

    &:hover {
        background: rgba(255, 255, 255, 0.15);
        transform: translateY(-1px);
    }

    @media (max-width: 768px) {
        gap: 8px;
        padding: 6px 8px;
    }
`

export const WrapperText = styled.span`
    font-size: 14px;
    color: #fff;
    white-space: nowrap;
    font-weight: 500;

    @media (max-width: 992px) {
        font-size: 13px;
    }

    @media (max-width: 768px) {
        display: none;
    }
`

export const WrapperContentPopup = styled.p`
    cursor: pointer;
    padding: 10px 16px;
    margin: 0;
    border-radius: 6px;
    transition: all 0.2s ease;
    font-size: 14px;

    &:hover {
        background: rgba(26, 148, 255, 0.1);
        color: rgb(26, 148, 255);
        transform: translateX(4px);
    }
`

export const WrapperCartBadge = styled.div`
    position: relative;
    cursor: pointer;
    padding: 8px;
    border-radius: 8px;
    transition: all 0.3s ease;

    &:hover {
        background: rgba(255, 255, 255, 0.15);
        transform: translateY(-2px);
    }

    .ant-badge-count {
        background: linear-gradient(135deg, #ff4d4f 0%, #ff7875 100%);
        box-shadow: 0 2px 8px rgba(255, 77, 79, 0.4);
    }
`

