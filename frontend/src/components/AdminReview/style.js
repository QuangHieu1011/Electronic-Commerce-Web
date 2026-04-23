import styled from 'styled-components';

export const WrapperContainer = styled.div`
    padding: 24px;
    background: #f5f5f5;
    min-height: 100vh;
`;

export const WrapperHeader = styled.div`
    background: #fff;
    color: #262626;
    padding: 24px;
    border-radius: 8px;
    margin-bottom: 24px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
    border-left: 4px solid #faad14;
    font-size: 24px;
    font-weight: 600;
`;

export const StatCard = styled.div`
    background: #fff;
    border-radius: 8px;
    padding: 20px 24px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
    display: flex;
    align-items: center;
    gap: 16px;

    .stat-icon {
        font-size: 36px;
        width: 56px;
        height: 56px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .stat-content {
        .stat-value {
            font-size: 28px;
            font-weight: 700;
            color: #262626;
            line-height: 1;
        }
        .stat-label {
            font-size: 13px;
            color: #8c8c8c;
            margin-top: 4px;
        }
    }
`;

export const TabCard = styled.div`
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
    overflow: hidden;
`;

export const ProductAvatar = styled.div`
    display: flex;
    align-items: center;
    gap: 10px;

    img {
        width: 44px;
        height: 44px;
        object-fit: cover;
        border-radius: 6px;
        border: 1px solid #f0f0f0;
    }

    .product-name {
        font-weight: 500;
        font-size: 13px;
        max-width: 200px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
`;

export const UserAvatar = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;

    img {
        width: 32px;
        height: 32px;
        object-fit: cover;
        border-radius: 50%;
        border: 1px solid #f0f0f0;
    }
    .user-name {
        font-size: 13px;
    }
`;

export const CommentText = styled.div`
    font-size: 13px;
    color: #595959;
    max-width: 260px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
`;

export const RatingBar = styled.div`
    display: flex;
    align-items: center;
    gap: 6px;
    margin-bottom: 4px;

    .bar-label {
        font-size: 12px;
        width: 28px;
        text-align: right;
        color: #595959;
    }
    .bar-track {
        flex: 1;
        height: 8px;
        background: #f0f0f0;
        border-radius: 4px;
        overflow: hidden;
        .bar-fill {
            height: 100%;
            border-radius: 4px;
            background: #faad14;
            transition: width 0.3s;
        }
    }
    .bar-count {
        font-size: 12px;
        width: 24px;
        color: #8c8c8c;
    }
`;
