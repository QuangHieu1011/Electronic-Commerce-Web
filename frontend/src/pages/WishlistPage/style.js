import styled from 'styled-components'

export const WrapperContainer = styled.div`
    padding: 40px 20px;
    background: #f5f5f5;
    min-height: 100vh;
`

export const WrapperHeader = styled.div`
    background: #1a94ff;
    padding: 28px 40px;
    border-radius: 12px;
    margin-bottom: 32px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: white;
    box-shadow: 0 4px 12px rgba(26, 148, 255, 0.2);

    h2 {
        margin: 0;
        font-size: 26px;
        font-weight: 700;
    }
`

export const WrapperProducts = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: 20px;
    padding: 24px;
    background: white;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    border: 1px solid #e5e7eb;

    @media (max-width: 768px) {
        grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
        gap: 14px;
        padding: 16px;
    }
`

export const WrapperEmpty = styled.div`
    background: white;
    border-radius: 12px;
    padding: 60px 40px;
    text-align: center;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    border: 1px solid #e5e7eb;

    .empty-title {
        font-size: 20px;
        font-weight: 600;
        color: #333;
        margin-bottom: 12px;
    }

    .empty-description {
        color: #888;
        margin-bottom: 28px;
        font-size: 14px;
        line-height: 1.6;
    }
`
