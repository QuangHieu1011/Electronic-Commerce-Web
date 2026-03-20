import { Upload } from "antd";
import styled from "styled-components";

export const WrapperContainer = styled.div`
    max-width: 1200px;
    margin: 0 auto;
    padding: 40px 20px;
    min-height: calc(100vh - 200px);
    background: #f5f5f5;

    @media (max-width: 768px) {
        padding: 20px 16px;
    }
`

export const WrapperHeader = styled.div`
    background: #1a94ff;
    padding: 28px 40px;
    border-radius: 12px;
    margin-bottom: 28px;
    box-shadow: 0 4px 12px rgba(26, 148, 255, 0.2);

    h1 {
        font-size: 28px;
        color: #fff;
        margin: 0;
        font-weight: 700;
    }

    @media (max-width: 768px) {
        padding: 20px 24px;
        
        h1 {
            font-size: 22px;
        }
    }
`

export const WrapperContentProfile = styled.div`
    background: #fff;
    border-radius: 12px;
    padding: 36px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    border: 1px solid #e5e7eb;

    @media (max-width: 768px) {
        padding: 24px 16px;
    }
`

export const WrapperAvatarSection = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 32px;
    background: #fafafa;
    border-radius: 12px;
    margin-bottom: 28px;
    border: 1px solid #e5e7eb;

    .avatar-wrapper {
        
        img {
            border: 4px solid #fff;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
            transition: all 0.3s ease;
            
            &:hover {
                transform: scale(1.02);
                box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
            }
        }
    }

    @media (max-width: 768px) {
        padding: 24px;
    }
`

export const WrapperInfoGrid = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 24px;
    margin-bottom: 32px;

    @media (max-width: 992px) {
        grid-template-columns: 1fr;
        gap: 20px;
    }
`

export const WrapperInfoCard = styled.div`
    background: #fafafa;
    border: 1px solid #e5e7eb;
    border-radius: 10px;
    padding: 20px;
    transition: all 0.3s ease;

    &:hover {
        border-color: #1a94ff;
        background: #fff;
        box-shadow: 0 2px 8px rgba(26, 148, 255, 0.15);
    }

    @media (max-width: 768px) {
        padding: 18px;
    }
`

export const WrapperLabel = styled.label`
    display: block;
    color: #555;
    font-size: 14px;
    font-weight: 600;
    margin-bottom: 10px;
`

export const WrapperInput = styled.div`
    display: flex;
    flex-direction: column;
    gap: 12px;

    .input-group {
        display: flex;
        gap: 12px;
        align-items: stretch;

        .ant-input {
            flex: 1;
            border-radius: 8px;
            border: 1px solid #d9d9d9;
            padding: 10px 14px;
            font-size: 14px;
            transition: all 0.3s ease;

            &:focus {
                border-color: #1a94ff;
                box-shadow: 0 0 0 2px rgba(26, 148, 255, 0.1);
            }
        }

        button {
            border-radius: 8px;
            padding: 0 20px;
            height: auto;
            font-weight: 600;
            border: 1px solid #1a94ff;
            background: #1a94ff;
            color: #fff;
            transition: all 0.3s ease;
            white-space: nowrap;

            &:hover {
                background: #0d7de8;
                border-color: #0d7de8;
                transform: translateY(-1px);
                box-shadow: 0 2px 8px rgba(26, 148, 255, 0.3);
            }

            &:active {
                transform: translateY(0);
            }
        }
    }

    @media (max-width: 768px) {
        .input-group {
            flex-direction: column;
            
            button {
                width: 100%;
            }
        }
    }
`

export const WrapperUploadFile = styled(Upload)`
    .ant-upload {
        width: 140px !important;
        height: 140px !important;
        border-radius: 50% !important;
        border: 3px dashed #d9d9d9 !important;
        transition: all 0.3s ease !important;
        overflow: hidden;

        &:hover {
            border-color: #1a94ff !important;
            background: rgba(26, 148, 255, 0.05) !important;
        }
    }

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
    justify-content: center;
    padding-top: 24px;
    border-top: 1px solid #e5e7eb;
    margin-top: 24px;

    button {
        min-width: 160px;
        height: 46px;
        border-radius: 8px;
        font-size: 15px;
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
        flex-direction: column;
        
        button {
            width: 100%;
        }
    }
`