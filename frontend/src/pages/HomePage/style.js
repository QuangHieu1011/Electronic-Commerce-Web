import styled from 'styled-components';
import { Button } from 'antd';

export const WrapperTypeProduct = styled.div`
    display: flex;
    align-items: center;
    gap: 20px;
    justify-content: flex-start;
    min-height: 50px;
    padding: 10px 0;
    overflow-x: auto;
    overflow-y: hidden;
    scrollbar-width: thin;
    
    &::-webkit-scrollbar {
        height: 6px;
    }
    
    &::-webkit-scrollbar-thumb {
        background: #d9d9d9;
        border-radius: 3px;
    }

    @media (max-width: 768px) {
        gap: 12px;
        padding: 8px 0;
        justify-content: flex-start;
    }
`

export const WrapperButtonMore = styled(Button)`
    border: 1px solid rgb(11,116,229);
    color: rgb(11,116,229);
    width: 100%;
    max-width: 400px;
    height: 44px;
    border-radius: 8px;
    font-weight: 600;
    font-size: 15px;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: 0 2px 8px rgba(11, 116, 229, 0.15);
    
    &:hover:not(:disabled) {
        color: #fff; 
        background: linear-gradient(135deg, rgb(11,116,229) 0%, rgb(13,92,182) 100%);
        transform: translateY(-2px);
        box-shadow: 0 6px 16px rgba(11, 116, 229, 0.3);
        border-color: rgb(11,116,229);
    }

    &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }

    @media (max-width: 768px) {
        max-width: 100%;
        height: 48px;
        font-size: 16px;
    }
`

export const WrapperProducts = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: 20px;
    margin-top: 30px;
    animation: fadeIn 0.6s ease-out;

    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    @media (max-width: 1400px) {
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
        gap: 16px;
    }

    @media (max-width: 1200px) {
        grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
    }

    @media (max-width: 992px) {
        grid-template-columns: repeat(3, 1fr);
        gap: 14px;
    }

    @media (max-width: 768px) {
        grid-template-columns: repeat(2, 1fr);
        gap: 12px;
        margin-top: 20px;
    }

    @media (max-width: 480px) {
        grid-template-columns: repeat(2, 1fr);
        gap: 10px;
    }
`

export const WrapperHeroSection = styled.div`
    position: relative;
    margin: 0 -120px 40px;
    padding: 0 120px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    overflow: hidden;

    &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: url('data:image/svg+xml,<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg"><defs><pattern id="grid" width="100" height="100" patternUnits="userSpaceOnUse"><path d="M 100 0 L 0 0 0 100" fill="none" stroke="rgba(255,255,255,0.03)" stroke-width="1"/></pattern></defs><rect width="100%" height="100%" fill="url(%23grid)"/></svg>');
        opacity: 0.5;
    }

    @media (max-width: 1200px) {
        margin: 0 -80px 30px;
        padding: 0 80px;
    }

    @media (max-width: 992px) {
        margin: 0 -40px 25px;
        padding: 0 40px;
    }

    @media (max-width: 768px) {
        margin: 0 -16px 20px;
        padding: 0 16px;
    }
`

export const WrapperPageContainer = styled.div`
    position: relative;
    background: #efefef;
    overflow: hidden;

    /* Decoration Top Left */
    &::before {
        content: '';
        position: fixed;
        top: -100px;
        left: -100px;
        width: 300px;
        height: 300px;
        background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
        border-radius: 50%;
        filter: blur(60px);
        z-index: 0;
        animation: float 20s ease-in-out infinite;
    }

    /* Decoration Top Right */
    &::after {
        content: '';
        position: fixed;
        top: 100px;
        right: -150px;
        width: 400px;
        height: 400px;
        background: linear-gradient(135deg, rgba(26, 148, 255, 0.08) 0%, rgba(102, 126, 234, 0.08) 100%);
        border-radius: 50%;
        filter: blur(80px);
        z-index: 0;
        animation: float 25s ease-in-out infinite reverse;
    }

    @keyframes float {
        0%, 100% {
            transform: translateY(0) translateX(0) scale(1);
        }
        25% {
            transform: translateY(-30px) translateX(20px) scale(1.05);
        }
        50% {
            transform: translateY(-50px) translateX(-20px) scale(0.95);
        }
        75% {
            transform: translateY(-30px) translateX(20px) scale(1.05);
        }
    }
`

export const WrapperDecorativeShapes = styled.div`
    position: fixed;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    pointer-events: none;
    z-index: 0;
    overflow: hidden;

    .shape {
        position: absolute;
        opacity: 0.5;
    }

    /* Bottom Left Circle */
    .shape-1 {
        bottom: -80px;
        left: -80px;
        width: 250px;
        height: 250px;
        background: linear-gradient(135deg, rgba(255, 107, 107, 0.1) 0%, rgba(255, 142, 83, 0.1) 100%);
        border-radius: 50%;
        filter: blur(50px);
        animation: pulse 15s ease-in-out infinite;
    }

    /* Bottom Right Square */
    .shape-2 {
        bottom: 150px;
        right: -50px;
        width: 200px;
        height: 200px;
        background: linear-gradient(135deg, rgba(67, 233, 123, 0.08) 0%, rgba(56, 249, 215, 0.08) 100%);
        border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%;
        filter: blur(40px);
        animation: rotate 30s linear infinite;
    }

    /* Middle Right Triangle */
    .shape-3 {
        top: 40%;
        right: 50px;
        width: 0;
        height: 0;
        border-left: 80px solid transparent;
        border-right: 80px solid transparent;
        border-bottom: 140px solid rgba(102, 126, 234, 0.06);
        filter: blur(20px);
        animation: float 18s ease-in-out infinite;
    }

    /* Top Left Small Circle */
    .shape-4 {
        top: 20%;
        left: 100px;
        width: 120px;
        height: 120px;
        background: radial-gradient(circle, rgba(255, 193, 7, 0.08) 0%, transparent 70%);
        border-radius: 50%;
        animation: pulse 12s ease-in-out infinite;
    }

    @keyframes pulse {
        0%, 100% {
            transform: scale(1);
            opacity: 0.5;
        }
        50% {
            transform: scale(1.15);
            opacity: 0.7;
        }
    }

    @keyframes rotate {
        from {
            transform: rotate(0deg);
        }
        to {
            transform: rotate(360deg);
        }
    }

    @media (max-width: 768px) {
        .shape-1, .shape-2, .shape-3 {
            display: none;
        }
    }
`

export const WrapperFloatingBadge = styled.div`
    position: fixed;
    bottom: 30px;
    right: 30px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 16px 24px;
    border-radius: 50px;
    box-shadow: 0 8px 24px rgba(102, 126, 234, 0.4);
    font-weight: 700;
    font-size: 14px;
    z-index: 100;
    cursor: pointer;
    transition: all 0.3s ease;
    animation: slideInRight 1s ease-out;

    &:hover {
        transform: translateY(-5px) scale(1.05);
        box-shadow: 0 12px 32px rgba(102, 126, 234, 0.5);
    }

    @keyframes slideInRight {
        from {
            opacity: 0;
            transform: translateX(100px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }

    @media (max-width: 768px) {
        bottom: 20px;
        right: 20px;
        padding: 12px 20px;
        font-size: 13px;
    }
`

export const WrapperContainer = styled.div`
    max-width: 1440px;
    margin: 0 auto;
    padding: 0 120px;
    background-color: #fff;
    min-height: 100vh;

    @media (max-width: 1400px) {
        padding: 0 80px;
    }

    @media (max-width: 1200px) {
        padding: 0 60px;
    }

    @media (max-width: 992px) {
        padding: 0 40px;
    }

    @media (max-width: 768px) {
        padding: 0 16px;
    }
`

export const WrapperContentContainer = styled.div`
    background-color: #efefef;
    padding: 30px 120px 50px;
    min-height: calc(100vh - 200px);

    @media (max-width: 1200px) {
        padding: 25px 80px 40px;
    }

    @media (max-width: 992px) {
        padding: 20px 40px 35px;
    }

    @media (max-width: 768px) {
        padding: 16px 16px 30px;
    }
`