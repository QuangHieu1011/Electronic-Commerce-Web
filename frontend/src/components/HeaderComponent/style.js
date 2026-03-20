import styled from 'styled-components';

export const HeaderShell = styled.header`
    width: 100%;
    position: sticky;
    top: 0;
    z-index: 1000;
    box-shadow: 0 6px 20px rgba(9, 68, 139, 0.2);
`;

export const UtilityBar = styled.div`
    background: #0856b0;
    color: #dcecff;
    font-size: 13px;
`;

export const UtilityContent = styled.div`
    max-width: 1280px;
    margin: 0 auto;
    padding: 8px 24px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;

    @media (max-width: 768px) {
        padding: 8px 12px;
        font-size: 12px;
    }
`;

export const WrapperTopRight = styled.div`
    display: flex;
    align-items: center;
    gap: 18px;

    @media (max-width: 768px) {
        gap: 10px;
    }
`;

export const UtilityLink = styled.span`
    cursor: pointer;
    color: #e9f2ff;
    transition: opacity 0.2s ease;

    &:hover {
        opacity: 0.78;
    }
`;

export const MainBar = styled.div`
    background: linear-gradient(90deg, #0b6fd0 0%, #1a8bfd 100%);
`;

export const WrapperHeader = styled.div`
    max-width: 1280px;
    margin: 0 auto;
    padding: 14px 24px;
    display: grid;
    grid-template-columns: 180px minmax(240px, 1fr) auto;
    align-items: center;
    gap: 20px;

    @media (max-width: 1200px) {
        grid-template-columns: 160px minmax(220px, 1fr) auto;
    }

    @media (max-width: 992px) {
        grid-template-columns: 1fr;
        gap: 12px;
        padding: 12px 16px;
    }

    @media (max-width: 768px) {
        padding: 10px 12px;
    }
`;

export const SearchWrapper = styled.div`
    width: 100%;

    @media (max-width: 768px) {
        .ant-btn {
            min-width: 96px;
        }
    }
`;

export const WrapperIconGroup = styled.div`
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 18px;

    @media (max-width: 992px) {
        justify-content: space-between;
    }

    @media (max-width: 768px) {
        gap: 12px;
    }
`;

export const CategoryBar = styled.div`
    background: #0a67c5;
    border-top: 1px solid rgba(255, 255, 255, 0.18);
`;

export const CategoryContent = styled.div`
    max-width: 1280px;
    margin: 0 auto;
    padding: 0 24px;
    display: flex;
    align-items: center;
    gap: 24px;
    overflow-x: auto;
    min-height: 42px;

    &::-webkit-scrollbar {
        display: none;
    }

    @media (max-width: 768px) {
        padding: 0 12px;
        gap: 14px;
    }
`;

export const CategoryItem = styled.button`
    border: none;
    background: transparent;
    color: #f3f8ff;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    white-space: nowrap;
    padding: 10px 0;
    opacity: 0.95;
    border-bottom: 2px solid transparent;
    transition: all 0.2s ease;

    &:hover {
        opacity: 1;
        border-bottom-color: #9ed0ff;
    }
`;

export const WrapperTextHeader = styled.span`
    font-size: 28px;
    color: #ffffff;
    font-weight: 900;
    letter-spacing: -0.8px;
    text-transform: lowercase;
    cursor: pointer;
    transition: transform 0.2s ease;

    &:hover {
        transform: translateY(-1px);
    }

    @media (max-width: 992px) {
        font-size: 24px;
    }

    @media (max-width: 768px) {
        font-size: 22px;
    }
`;

export const WrapperHeaderAccount = styled.div`
    display: flex;
    align-items: center;
    color: #ffffff;
    gap: 10px;
    cursor: pointer;
    padding: 8px 10px;
    border-radius: 8px;
    transition: all 0.2s ease;

    &:hover {
        background: rgba(255, 255, 255, 0.16);
    }

    @media (max-width: 768px) {
        gap: 6px;
        padding: 6px;
    }
`;

export const WrapperText = styled.span`
    font-size: 14px;
    color: #ffffff;
    white-space: nowrap;
    font-weight: 500;

    @media (max-width: 992px) {
        font-size: 13px;
    }

    @media (max-width: 768px) {
        display: none;
    }
`;

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
`;

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
`;

