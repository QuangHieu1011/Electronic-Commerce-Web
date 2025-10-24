import { Row } from 'antd';
import styled from 'styled-components';

export const WrapperHeader = styled(Row)`
    padding: 15px 120px;
    background-color: rgb(26, 148, 255);
    align-items: center;  
    width: 100%;
    box-sizing: border-box;
    gap: 16px;
    flex-wrap: nowrap;
  `
export const WrapperTextHeader = styled.span`
    font-size: 20px;
    color: #fff;
    font-weight: bold;
`
export const WrapperHeaderAccount = styled.div`
    display: flex;
    align-items: center;
    color: #fff;
    gap: 10px;
`
export const WrapperText = styled.span`
    font-size: 14px;
    color: #fff;
    white-space: nowrap;
`

