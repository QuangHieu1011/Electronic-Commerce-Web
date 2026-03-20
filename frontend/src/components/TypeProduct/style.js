import styled from 'styled-components';

export const WrapperTypeProductItem = styled.div`
    position: relative;
    padding: 14px 28px;
    background: #ffffff;
    border: 2px solid transparent;
    border-radius: 24px;
    cursor: pointer;
    white-space: nowrap;
    font-size: 15px;
    font-weight: 600;
    color: #1f2937;
    letter-spacing: 0.3px;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    overflow: hidden;
    
    &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        opacity: 0;
        transition: opacity 0.3s ease;
        z-index: -1;
    }
    
    &:hover {
        border-color: #667eea;
        color: #667eea;
        transform: translateY(-2px);
        box-shadow: 0 8px 20px rgba(102, 126, 234, 0.25);
    }

    &:active {
        transform: translateY(0);
        box-shadow: 0 4px 12px rgba(102, 126, 234, 0.2);
    }

    @media (max-width: 768px) {
        padding: 12px 20px;
        font-size: 14px;
        border-radius: 20px;
    }
`
