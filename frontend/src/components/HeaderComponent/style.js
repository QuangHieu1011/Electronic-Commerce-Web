import { Row } from 'antd';
import styled from 'styled-components';

export const WrapperHeader = styled(Row)`
    padding: 12px 120px;
    background: linear-gradient(135deg, #d70018 0%, #e02027 100%);
    align-items: center;  
    width: 100%;
    box-sizing: border-box;
    gap: 20px;
    flex-wrap: nowrap;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  `
export const WrapperTextHeader = styled.span`
    font-size: 28px;
    color: #fff;
    font-weight: 800;
    letter-spacing: -0.5px;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    cursor: pointer;
    transition: transform 0.2s ease;
    
    &:hover {
        transform: scale(1.05);
    }
`
export const WrapperHeaderAccount = styled.div`
    display: flex;
    align-items: center;
    color: #fff;
    gap: 10px;
    padding: 8px 12px;
    border-radius: 8px;
    transition: all 0.3s ease;
    cursor: pointer;
    
    &:hover {
        background-color: rgba(255, 255, 255, 0.15);
    }
`
export const WrapperText = styled.span`
    font-size: 13px;
    color: #fff;
    white-space: nowrap;
    font-weight: 500;
`
export const WrapperContentPopup = styled.p`
    cursor: pointer;
    padding: 8px 12px;
    margin: 4px 0;
    border-radius: 6px;
    transition: all 0.2s ease;
    
    &:hover {
        color: #d70018;
        background-color: #f5f5f5;
    }
`

