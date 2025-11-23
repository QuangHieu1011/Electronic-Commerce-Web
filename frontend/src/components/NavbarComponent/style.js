import styled from "styled-components";

export const WrapperLableText = styled.h4`
    color: rgb(56,56,61);
    font-size: 16px;
    font-weight: 600;
    margin-bottom: 12px;
    border-bottom: 2px solid #1890ff;
    padding-bottom: 8px;
`

export const WrapperTextValue = styled.span`
    color: rgb(56,56,61);
    font-size: 14px;
    font-weight: 400;
    padding: 8px 12px;
    cursor: pointer;
    border-radius: 6px;
    transition: all 0.3s ease;
    
    &:hover {
        background-color: #f0f8ff;
        color: #1890ff;
        transform: translateX(5px);
    }
`

export const WrapperContent = styled.div`
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-bottom: 16px;
    
    .ant-checkbox-wrapper {
        padding: 4px 0;
        
        &:hover {
            color: #1890ff;
        }
    }
    
    .ant-slider {
        margin: 10px 5px;
    }
`

export const WrapperTextPrice = styled.div`
    border-radius: 6px;
    color: rgb(56,56,61); 
    background-color: rgb(238, 238, 238);
    width: fit-content;
    padding: 6px 12px;
    font-size: 12px;
    margin: 2px 0;
`