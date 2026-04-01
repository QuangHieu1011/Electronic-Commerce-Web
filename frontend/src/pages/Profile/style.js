import { Upload } from "antd";
import styled from "styled-components";

export const WrapperContainer = styled.div`
    max-width: 1200px;
    margin: 0 auto;
    padding: 32px 20px 48px;
    min-height: calc(100vh - 200px);
    background: linear-gradient(180deg, #f3f8ff 0%, #f5f5f5 45%, #f5f5f5 100%);

    @media (max-width: 768px) {
        padding: 20px 16px;
    }
`

export const WrapperHeader = styled.div`
    margin-bottom: 18px;

    h1 {
        font-size: 30px;
        color: #143f7a;
        margin: 0;
        font-weight: 700;
    }

    p {
        margin: 6px 0 0;
        color: #5e789f;
        font-size: 14px;
    }

    @media (max-width: 768px) {
        h1 {
            font-size: 22px;
        }

        p {
            font-size: 13px;
        }
    }
`

export const WrapperContentProfile = styled.div`
    display: flex;
    flex-direction: column;
    gap: 18px;

    @media (max-width: 768px) {
        gap: 14px;
    }
`

export const WrapperAvatarSection = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 20px;
    padding: 22px 24px;
    background: #ffffff;
    border-radius: 16px;
    border: 1px solid #e5e7eb;
    box-shadow: 0 6px 16px rgba(20, 63, 122, 0.08);

    .avatar-block {
        display: flex;
        align-items: center;
        gap: 16px;
        min-width: 0;
    }

    .avatar-wrapper {
        width: 92px;
        height: 92px;
        flex-shrink: 0;
        
        img {
            border: 4px solid #fff;
            box-shadow: 0 8px 20px rgba(13, 125, 232, 0.2);
            transition: all 0.3s ease;
            
            &:hover {
                transform: scale(1.02);
                box-shadow: 0 10px 22px rgba(13, 125, 232, 0.25);
            }
        }
    }

    .avatar-content {
        min-width: 0;

        h3 {
            margin: 0;
            font-size: 28px;
            color: #0f3a72;
            font-weight: 700;
            line-height: 1.25;
        }

        p {
            margin: 6px 0 0;
            color: #7288a8;
            font-size: 15px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
    }

    .avatar-actions {
        display: flex;
        align-items: center;
        gap: 10px;
        flex-wrap: wrap;
        justify-content: flex-end;
    }

    .outline-btn {
        border-radius: 10px;
        height: 42px;
        border: 1px solid #b8cae7;
        color: #1d4f91;
        background: #fff;
        font-weight: 600;
    }

    .update-btn {
        border-radius: 10px;
        height: 42px;
        border: none;
        background: linear-gradient(135deg, #1a94ff 0%, #0d7de8 100%);
        color: #fff;
        font-weight: 600;
        box-shadow: 0 8px 18px rgba(26, 148, 255, 0.3);
    }

    @media (max-width: 768px) {
        flex-direction: column;
        align-items: flex-start;
        padding: 18px;

        .avatar-content h3 {
            font-size: 22px;
        }

        .avatar-content p {
            white-space: normal;
        }

        .avatar-actions {
            width: 100%;
            justify-content: flex-start;
        }
    }
`

export const WrapperInfoGrid = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 18px 16px;

    .full-width {
        grid-column: 1 / -1;
    }

    @media (max-width: 992px) {
        grid-template-columns: 1fr;
        gap: 14px;

        .full-width {
            grid-column: auto;
        }
    }
`

export const WrapperInfoCard = styled.div`
    background: #ffffff;
    border: 1px solid #e5e7eb;
    border-radius: 16px;
    padding: 24px;
    transition: all 0.3s ease;
    box-shadow: 0 6px 16px rgba(20, 63, 122, 0.08);

    .card-title {
        font-size: 28px;
        line-height: 1.2;
        font-weight: 700;
        color: #0f3a72;
        margin-bottom: 18px;
    }

    &:hover {
        border-color: #cddff8;
        box-shadow: 0 8px 18px rgba(20, 63, 122, 0.1);
    }

    @media (max-width: 768px) {
        padding: 16px;

        .card-title {
            font-size: 21px;
            margin-bottom: 12px;
        }
    }
`

export const WrapperLabel = styled.label`
    display: block;
    color: #5d7394;
    font-size: 13px;
    font-weight: 600;
    margin-bottom: 7px;
`

export const WrapperInput = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0;

    .ant-input-affix-wrapper {
        border-radius: 10px;
        border: 1px solid #b8cae7;
        padding: 10px 12px;
        transition: all 0.3s ease;

        &:hover {
            border-color: #7fb2ea;
        }

        &.ant-input-affix-wrapper-focused {
            border-color: #1a94ff;
            box-shadow: 0 0 0 3px rgba(26, 148, 255, 0.16);
        }
    }

    .ant-input {
        font-size: 14px;
    }
`

export const WrapperUploadFile = styled(Upload)`
    .ant-upload-list-item-info {
        display: none !important;
    }
    
    .ant-upload-list-item-name {
        display: none !important;
    }
    
    .ant-upload-list-item-card-actions {
        display: none !important;
    }
    
    .anticon-delete {
        display: none !important;
    }
    
    .anticon-paper-clip {
        display: none !important;
    }

    @media (max-width: 768px) {
        .ant-upload {
            width: 120px !important;
            height: 120px !important;
        }
    }
`

export const WrapperActionButtons = styled.div`
    display: flex;
    gap: 14px;
    justify-content: flex-end;
    margin-top: 4px;

    button {
        min-width: 170px;
        height: 44px;
        border-radius: 10px;
        font-size: 14px;
        font-weight: 600;
        transition: all 0.3s ease;

        &.primary {
            background: #1a94ff;
            border: none;
            color: #fff;

            &:hover {
                background: #0d7de8;
                transform: translateY(-1px);
                box-shadow: 0 4px 12px rgba(26, 148, 255, 0.3);
            }
        }

        &.secondary {
            background: #fff;
            border: 1px solid #d9d9d9;
            color: #555;

            &:hover {
                border-color: #1a94ff;
                color: #1a94ff;
            }
        }
    }

    @media (max-width: 768px) {
        justify-content: stretch;
        flex-direction: column-reverse;
        
        button {
            width: 100%;
        }
    }
`