import styled from "styled-components";
import { Col, Image, InputNumber } from "antd";

export const WrapperContainerImage = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  background: #fff;
  padding: 12px;
  
  .ant-image {
    width: 100%;
    height: auto;
    
    img {
      object-fit: contain;
      max-height: 400px;
    }
  }
`;

export const WrapperListImage = styled.div`
  display: flex;
  justify-content: center;
  gap: 16px; 
  padding: 12px 0;
  margin-top: 10px;
  border-radius: 6px;
`;

export const WrapperStyleColImage = styled(Col)`
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const WrapperStyleImageSmall = styled(Image)`
  width: 64px;
  height: 64px;
  object-fit: cover;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    border: 2px solid #1890ff;
    transform: scale(1.05);
  }
`;

export const WrapperStyleNameProduct=styled.h1`
    color: rgb(36, 36, 36);
    font-size: 24px;
    font-weight: 300;
    line-height: 32px;
    word-break: break-word;
`

export const WrapperStyleTextSell=styled.span`
    font-size: 15px;
    line-height: 24px;
    color: rgb(120, 120, 120)
`
export const WrapperPriceProduct=styled.div`
    background: rgb(250, 250, 250);
    border-radius: 4px;
`
export const WrapperPriceTextProduct=styled.h1`
    font-size: 32px;
    line-height: 40px;
    margin-right: 8px;
    font-weight: 500;
    padding: 10px;
    margin-top:10px;
`
export const WrapperAddressProduct=styled.div`
    span.address {
        text-decoration: underline;
        font-size: 15px;
        line-height: 24px;
        font-weight: 500;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsisl
    };
    span.change-address {
        color: rgb(11, 116, 229);
        font-size: 16px;
        line-height: 24px;
        font-weight: 500;
    }
`

export const WrapperQualityProduct=styled.div`
    display: flex;
    gap: 4px;
    align-items: center;
    width:110px;
    border: 1px solid #ccc;
    borrder-radius: 4px;
`


export const WrapperInputNumber = styled(InputNumber)`
  width: 60px !important;
  text-align: center;
  border-top: none !important;
  border-bottom: none !important;

  .ant-input-number-handler-wrap {
    display: none !important;
  }

  input {
    text-align: center;
  }
`


