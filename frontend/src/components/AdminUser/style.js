import { Upload } from "antd";
import styled from "styled-components";

export const WrapperContainer = styled.div`
    padding: 24px;
    background: #f5f5f5;
    min-height: 100vh;
`

export const WrapperHeader = styled.div`
    background: #fff;
    color: #262626;
    padding: 24px;
    border-radius: 8px;
    margin-bottom: 24px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
    border-left: 4px solid #1a94ff;
    font-size: 24px;
    font-weight: 600;
`

export const WrapperUploadFile = styled(Upload)`
    & .ant-upload.ant-upload-select.ant-upload-select-picture-card {
        width: 60px;
        height: 60px;
        border-radius: 50%;
        overflow: hidden;
    }
    & .ant-upload-list-item-info {
        display: none !important
    }
    & .ant-upload-list-item {
        display: none !important;
    }   
`