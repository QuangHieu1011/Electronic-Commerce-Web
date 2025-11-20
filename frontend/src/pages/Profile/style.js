import { Upload } from "antd";
import styled from "styled-components";

export const WrapperHeader = styled.h1`
    font-size: 18px;
    color: #000;
    margin: 4px 0;

`
export const WrapperContentProfile = styled.div`
    display: flex;
    flex-direction: column;
    border: 1px solid #ccc;
    width: 600px;
    margin: 0 auto;
    padding: 30px;
    border-radius: 10px;
    gap: 30px;
`
export const WrapperLabel = styled.label`
    color: #000;
    font-size: 14px;
    line-height: 30px;
    font-weight: 600;
    width: 80px;
    text-align: left;
`
export const WrapperInput = styled.div`
    display: flex;
    align-items: center;
    gap: 20px;
`
export const WrapperUploadFile =styled(Upload)`
    & .ant-upload.ant-upload-select.ant-upload-select-picture-card {
        width: 60px;
        height: 60px;
        border-radius: 50%;
        overflow: hidden;
    }
    & .ant-upload-list-item-info {
        display: none !important;
    }
    & .ant-upload-list-item-name {
        display: none !important;
    }
        & .ant-upload-list-item-card-actions {
            display: none !important;
        }
        & .anticon-delete {
            display: none !important;
        }
        & .anticon-paper-clip {
            display: none !important;
        }
`