import { Upload } from "antd";
import styled from "styled-components";

export const WrapperContainer = styled.div`
    max-width: 1200px;
    margin: 0 auto;
    padding: 40px 20px;
    min-height: calc(100vh - 200px);

    @media (max-width: 768px) {
        padding: 20px 16px;
    }
`

export const WrapperHeader = styled.div`
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    padding: 32px;
    border-radius: 16px;
    margin-bottom: 32px;
    box-shadow: 0 8px 24px rgba(102, 126, 234, 0.25);
    animation: slideInDown 0.6s ease-out;

    @keyframes slideInDown {
        from {
            opacity: 0;
            transform: translateY(-30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    h1 {
        font-size: 32px;
        color: #fff;
        margin: 0;
        font-weight: 800;
        text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        display: flex;
        align-items: center;
        gap: 12px;

        &::before {
            content: '👤';
            font-size: 36px;
        }
    }

    @media (max-width: 768px) {
        padding: 24px;
        
        h1 {
            font-size: 24px;
            
            &::before {
                font-size: 28px;
            }
        }
    }
`

export const WrapperContentProfile = styled.div`
    background: #fff;
    border-radius: 16px;
    padding: 40px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    animation: fadeIn 0.8s ease-out;

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

    @media (max-width: 768px) {
        padding: 24px 16px;
    }
`

export const WrapperAvatarSection = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 32px;
    background: linear-gradient(135deg, #f5f7fa 0%, #e8eef5 100%);
    border-radius: 16px;
    margin-bottom: 32px;
    position: relative;
    overflow: hidden;

    &::before {
        content: '';
        position: absolute;
        top: -50%;
        right: -50%;
        width: 200%;
        height: 200%;
        background: radial-gradient(circle, rgba(102, 126, 234, 0.05) 0%, transparent 70%);
        animation: rotate 20s linear infinite;
    }

    @keyframes rotate {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }

    .avatar-wrapper {
        position: relative;
        z-index: 1;
        
        img {
            border: 6px solid #fff;
            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
            transition: all 0.3s ease;
            
            &:hover {
                transform: scale(1.05);
                box-shadow: 0 12px 32px rgba(0, 0, 0, 0.18);
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
    border: 2px solid #f0f0f0;
    border-radius: 12px;
    padding: 24px;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

    &:hover {
        border-color: #667eea;
        background: #fff;
        box-shadow: 0 4px 16px rgba(102, 126, 234, 0.15);
        transform: translateY(-4px);
    }

    @media (max-width: 768px) {
        padding: 20px;
    }
`

export const WrapperLabel = styled.label`
    display: block;
    color: #595959;
    font-size: 14px;
    font-weight: 600;
    margin-bottom: 12px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
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
            border: 2px solid #e8e8e8;
            padding: 12px 16px;
            font-size: 15px;
            transition: all 0.3s ease;

            &:focus {
                border-color: #667eea;
                box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
            }
        }

        button {
            border-radius: 8px;
            padding: 0 24px;
            height: auto;
            font-weight: 600;
            border: 2px solid #667eea;
            background: #667eea;
            color: #fff;
            transition: all 0.3s ease;
            white-space: nowrap;

            &:hover {
                background: #764ba2;
                border-color: #764ba2;
                transform: translateY(-2px);
                box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
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
        border: 4px dashed #d9d9d9 !important;
        transition: all 0.3s ease !important;
        overflow: hidden;

        &:hover {
            border-color: #667eea !important;
            background: rgba(102, 126, 234, 0.05) !important;
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
    gap: 16px;
    justify-content: center;
    padding-top: 24px;
    border-top: 2px solid #f0f0f0;
    margin-top: 24px;

    button {
        min-width: 160px;
        height: 48px;
        border-radius: 12px;
        font-size: 16px;
        font-weight: 700;
        transition: all 0.3s ease;

        &.primary {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border: none;
            color: #fff;

            &:hover {
                transform: translateY(-2px);
                box-shadow: 0 8px 24px rgba(102, 126, 234, 0.4);
            }
        }

        &.secondary {
            background: #fff;
            border: 2px solid #667eea;
            color: #667eea;

            &:hover {
                background: #667eea;
                color: #fff;
                transform: translateY(-2px);
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