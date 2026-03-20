import styled from "styled-components"

export const WrapperH5 = styled.div`
    font-size: 14px;
    font-weight: 500;
    color: #595959;
    margin-bottom: 20px;
    padding: 16px 20px;
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
    display: flex;
    align-items: center;

    span:first-child {
        font-weight: 600;
        color: #262626;
        transition: color 0.2s ease;

        &:hover {
            color: #1a94ff;
        }
    }

    @media (max-width: 768px) {
        font-size: 13px;
        padding: 12px 16px;
        margin-bottom: 16px;
    }
`