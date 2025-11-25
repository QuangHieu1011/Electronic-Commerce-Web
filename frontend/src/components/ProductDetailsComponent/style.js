import styled from "styled-components";
import { Col, Image, InputNumber } from "antd";

export const WrapperContainerImage = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  background: #fff;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  transition: all 0.3s ease;
  
  &:hover {
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12);
  }

  .ant-image {
    width: 100%;
    height: auto;
    
    img {
      object-fit: contain;
      max-height: 500px;
      transition: transform 0.4s ease;
    }
  }

  &:hover img {
    transform: scale(1.05);
  }

  @media (max-width: 768px) {
    padding: 16px;
    
    .ant-image img {
      max-height: 350px;
    }
  }
`;

export const WrapperListImage = styled.div`
  display: flex;
  justify-content: center;
  gap: 12px; 
  padding: 16px 0;
  margin-top: 16px;
  border-radius: 8px;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    gap: 8px;
    padding: 12px 0;
  }
`;

export const WrapperStyleColImage = styled(Col)`
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const WrapperStyleImageSmall = styled(Image)`
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 2px solid transparent;

  &:hover {
    border-color: #1890ff;
    transform: scale(1.1);
    box-shadow: 0 4px 12px rgba(24, 144, 255, 0.3);
  }

  @media (max-width: 768px) {
    width: 64px;
    height: 64px;
  }
`;

export const WrapperStyleNameProduct=styled.h1`
    color: rgb(36, 36, 36);
    font-size: 28px;
    font-weight: 700;
    line-height: 1.4;
    word-break: break-word;
    margin-bottom: 16px;
    animation: fadeIn 0.6s ease-out;

    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: translateY(-10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    @media (max-width: 768px) {
        font-size: 22px;
        margin-bottom: 12px;
    }
`

export const WrapperStyleTextSell=styled.span`
    font-size: 15px;
    line-height: 24px;
    color: rgb(120, 120, 120);
    font-weight: 500;

    @media (max-width: 768px) {
        font-size: 14px;
    }
`

export const WrapperPriceProduct=styled.div`
    background: linear-gradient(135deg, #fff5f5 0%, #ffe7e7 100%);
    border-radius: 12px;
    padding: 4px;
    margin: 20px 0;
    box-shadow: 0 2px 8px rgba(255, 77, 79, 0.1);
    transition: all 0.3s ease;

    &:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(255, 77, 79, 0.2);
    }

    @media (max-width: 768px) {
        margin: 16px 0;
    }
`

export const WrapperPriceTextProduct=styled.h1`
    font-size: 36px;
    line-height: 1.4;
    margin-right: 8px;
    font-weight: 700;
    padding: 12px 16px;
    margin-top: 0;
    margin-bottom: 0;
    color: #ff4d4f;
    text-shadow: 0 2px 4px rgba(255, 77, 79, 0.1);

    @media (max-width: 768px) {
        font-size: 28px;
        padding: 10px 12px;
    }
`

export const WrapperAddressProduct=styled.div`
    padding: 16px;
    background: #f5f5f5;
    border-radius: 8px;
    margin: 16px 0;

    span.address {
        text-decoration: underline;
        font-size: 15px;
        line-height: 24px;
        font-weight: 500;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        display: inline-block;
        max-width: 70%;
    }
    
    span.change-address {
        color: rgb(11, 116, 229);
        font-size: 16px;
        line-height: 24px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s ease;

        &:hover {
            color: rgb(13, 92, 182);
            text-decoration: underline;
        }
    }

    @media (max-width: 768px) {
        padding: 12px;
        margin: 12px 0;

        span.address {
            font-size: 14px;
            max-width: 60%;
        }

        span.change-address {
            font-size: 14px;
        }
    }
`

export const WrapperQualityProduct=styled.div`
    display: flex;
    gap: 4px;
    align-items: center;
    width: 120px;
    border: 2px solid #d9d9d9;
    border-radius: 8px;
    overflow: hidden;
    transition: all 0.3s ease;

    &:hover {
        border-color: #1890ff;
    }

    @media (max-width: 768px) {
        width: 110px;
    }
`

export const WrapperInputNumber = styled(InputNumber)`
  width: 60px !important;
  text-align: center;
  border-top: none !important;
  border-bottom: none !important;
  border-left: none !important;
  border-right: none !important;

  .ant-input-number-handler-wrap {
    display: none !important;
  }

  input {
    text-align: center;
    font-weight: 600;
    font-size: 16px;
  }

  @media (max-width: 768px) {
    width: 50px !important;
    
    input {
      font-size: 14px;
    }
  }
`


