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

export const WrapperTable = styled.div`
    background: white;
    border-radius: 12px;
    padding: 32px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    overflow-x: auto;
    border: 1px solid #e5e7eb;

    table {
        width: 100%;
        border-collapse: collapse;
        
        th {
            background: #fafafa;
            padding: 18px;
            text-align: left;
            font-weight: 700;
            font-size: 15px;
            color: #333;
            border-bottom: 2px solid #e5e7eb;
            position: sticky;
            left: 0;
            z-index: 10;
        }

        td {
            padding: 18px;
            border-bottom: 1px solid #f0f0f0;
            vertical-align: middle;
            font-size: 14px;
            color: #555;
        }

        tbody tr {
            transition: all 0.3s ease;
        }

        tbody tr:hover {
            background: #fafafa;
        }
    }
`

export const WrapperProductCell = styled.div`
    text-align: center;
    position: relative;
    padding: 8px;

    img {
        width: 130px;
        height: 130px;
        object-fit: cover;
        border-radius: 10px;
        margin-bottom: 10px;
        border: 1px solid #e5e7eb;
        transition: all 0.3s ease;
    }

    &:hover img {
        transform: scale(1.03);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }

    .product-name {
        font-weight: 600;
        font-size: 14px;
        color: #333;
        margin-bottom: 8px;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
        line-height: 1.4;
    }

    .remove-btn {
        position: absolute;
        top: 0;
        right: 0;
        background: #ff4d4f;
        color: white;
        border: none;
        border-radius: 50%;
        width: 26px;
        height: 26px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 14px;
        transition: all 0.3s ease;
        box-shadow: 0 2px 6px rgba(255, 77, 79, 0.3);

        &:hover {
            background: #d9363e;
            transform: scale(1.1);
            box-shadow: 0 3px 10px rgba(255, 77, 79, 0.4);
        }
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
