import styled from 'styled-components';
import { Button } from 'antd';

export const WrapperTypeProduct = styled.div`
    display: flex;
    align-items: center;
    gap: 16px;
    justify-content: flex-start;
    padding: 16px 0;
    background-color: #fff;
    border-radius: 12px;
    margin-bottom: 20px;
    box-shadow: 0 1px 4px rgba(0,0,0,0.08);
    padding-left: 20px;
    overflow-x: auto;
    scrollbar-width: thin;
    
    &::-webkit-scrollbar {
        height: 6px;
    }
    
    &::-webkit-scrollbar-thumb {
        background-color: #d0d0d0;
        border-radius: 3px;
    }
`

export const WrapperButtonMore = styled(Button)`
    border: 1px solid #d70018;
    color: #d70018;
    width: 240px;
    height: 44px;
    border-radius: 8px;
    font-weight: 600;
    font-size: 15px;
    transition: all 0.3s ease;
    box-shadow: 0 2px 8px rgba(215, 0, 24, 0.15);
    
    &:hover {
        color: #fff !important; 
        background-color: #d70018 !important;
        border-color: #d70018 !important;
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(215, 0, 24, 0.3);
    }
`
export const WrapperProducts = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: 16px;
    margin-top: 20px;
`

export const WrapperSection = styled.div`
    background-color: #fff;
    border-radius: 12px;
    padding: 20px;
    margin-bottom: 20px;
    box-shadow: 0 1px 4px rgba(0,0,0,0.08);
`

export const SectionTitle = styled.h2`
    font-size: 24px;
    font-weight: 700;
    color: #333;
    margin-bottom: 16px;
    padding-left: 12px;
    border-left: 4px solid #d70018;
`