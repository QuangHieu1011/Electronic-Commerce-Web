import styled from 'styled-components'

export const WrapperContainer = styled.div`
    padding: 20px;
    background: #f5f5f5;
    min-height: 100vh;
`

export const WrapperHeader = styled.div`
    background: linear-gradient(135deg, rgb(26,148,255) 0%, rgb(26,180,255) 100%);
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

export const WrapperTable = styled.div`
    background: white;
    border-radius: 12px;
    padding: 30px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    overflow-x: auto;

    table {
        width: 100%;
        border-collapse: collapse;
        
        th {
            background: #f8f9fa;
            padding: 15px;
            text-align: left;
            font-weight: 600;
            border-bottom: 2px solid #dee2e6;
            position: sticky;
            left: 0;
            z-index: 10;
            background: white;
        }

        td {
            padding: 15px;
            border-bottom: 1px solid #f0f0f0;
            vertical-align: middle;
        }

        tbody tr:hover {
            background: #f8f9fa;
        }
    }
`

export const WrapperProductCell = styled.div`
    text-align: center;
    position: relative;

    img {
        width: 120px;
        height: 120px;
        object-fit: cover;
        border-radius: 8px;
        margin-bottom: 10px;
    }

    .product-name {
        font-weight: 600;
        font-size: 14px;
        margin-bottom: 8px;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
    }

    .remove-btn {
        position: absolute;
        top: -10px;
        right: -10px;
        background: #ff4d4f;
        color: white;
        border: none;
        border-radius: 50%;
        width: 24px;
        height: 24px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 16px;
        transition: all 0.3s;

        &:hover {
            background: #d32f2f;
            transform: scale(1.1);
        }
    }
`

export const WrapperEmpty = styled.div`
    background: white;
    border-radius: 12px;
    padding: 60px 20px;
    text-align: center;

    .empty-icon {
        font-size: 80px;
        color: #d9d9d9;
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
