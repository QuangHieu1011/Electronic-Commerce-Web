import styled from 'styled-components'

export const WrapperContainer = styled.div`
    padding: 20px;
    background: #f5f5f5;
    min-height: 100vh;
`

export const WrapperHeader = styled.div`
    background: linear-gradient(135deg, #ff4d4f 0%, #ff7875 100%);
    padding: 20px 40px;
    border-radius: 12px;
    margin-bottom: 30px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: white;

    h2 {
        margin: 0;
        font-size: 28px;
        font-weight: 600;
    }
`

export const WrapperProducts = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: 20px;
    padding: 20px;
    background: white;
    border-radius: 12px;
`

export const WrapperEmpty = styled.div`
    background: white;
    border-radius: 12px;
    padding: 60px 20px;
    text-align: center;

    .empty-icon {
        font-size: 80px;
        color: #ff4d4f;
        margin-bottom: 20px;
    }

    .empty-title {
        font-size: 20px;
        font-weight: 600;
        color: #333;
        margin-bottom: 10px;
    }

    .empty-description {
        color: #999;
        margin-bottom: 30px;
    }
`
