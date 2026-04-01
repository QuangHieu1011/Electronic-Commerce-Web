import styled from "styled-components";
import { Image, InputNumber } from "antd";

export const WrapperContainerImage = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  background: #fff;
  padding: 24px;
  height: 520px;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  transition: all 0.3s ease;
  
  &:hover {
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12);
  }

  .ant-image {
    width: 100%;
    height: 100%;
  }

  .ant-image img {
    width: 100% !important;
    height: 100% !important;
    object-fit: contain;
    transition: transform 0.4s ease;
  }

  &:hover img {
    transform: scale(1.05);
  }

  @media (max-width: 768px) {
    padding: 16px;
    height: 360px;
  }
`;

export const WrapperListImage = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px; 
  padding: 20px 8px;
  margin-top: 20px;
  border-radius: 8px;

  @media (max-width: 768px) {
    grid-template-columns: repeat(3, 1fr);
    gap: 10px;
    padding: 12px 4px;
  }
`;

export const WrapperStyleColImage = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  aspect-ratio: 1 / 1;
  overflow: hidden;
  border-radius: 10px;
  background: #f8f8f8;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  &:hover {
    background: #fff;
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.12);
    transform: translateY(-4px);
  }
`;

export const WrapperStyleImageSmall = styled(Image)`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  img {
    width: 100% !important;
    height: 100% !important;
    object-fit: cover !important;
  }

  @media (max-width: 768px) {
    border-radius: 6px;
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
  background: linear-gradient(135deg, #f0f8ff 0%, #ffffff 55%, #eef7ff 100%);
  border-radius: 14px;
  padding: 6px;
    margin: 20px 0;
  border: 2px solid #1a94ff;
  box-shadow: 0 6px 20px rgba(26, 148, 255, 0.15);
    transition: all 0.3s ease;

    @media (max-width: 768px) {
        margin: 16px 0;
    border-radius: 12px;
    padding: 4px;
    }
`

export const WrapperPriceTextProduct=styled.h1`
  font-size: 34px;
    line-height: 1.4;
  margin-right: 0;
  font-weight: 800;
  letter-spacing: 0.4px;
  padding: 12px 18px;
    margin-top: 0;
    margin-bottom: 0;
  color: #0a6ed1;
  text-shadow: 0 1px 0 rgba(255, 255, 255, 0.8);

    @media (max-width: 768px) {
        font-size: 28px;
        padding: 10px 12px;
    letter-spacing: 0.2px;
    }
`

export const WrapperAddressProduct=styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 4px;
    padding: 16px;
    background: #f5f5f5;
    border-radius: 8px;
    margin: 16px 0;

  > span {
    display: inline-flex;
    align-items: center;
    line-height: 24px;
  }

    span.address {
        text-decoration: underline;
        font-size: 15px;
        line-height: 24px;
        font-weight: 500;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    display: inline-flex;
    align-items: center;
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
    align-items: center;
    width: 168px;
    border: 1px solid #cbd5e1;
    border-radius: 12px;
    overflow: hidden;
    background: #f8fbff;
    transition: all 0.3s ease;
    box-shadow: 0 2px 8px rgba(15, 23, 42, 0.08);

    &:hover {
        border-color: #1a94ff;
        box-shadow: 0 6px 16px rgba(26, 148, 255, 0.18);
    }

    .quantity-btn {
        width: 44px;
        height: 44px;
        border: none;
        background: linear-gradient(180deg, #ffffff 0%, #f1f5f9 100%);
        color: #334155;
        cursor: pointer;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s ease;
    }

    .quantity-btn:hover:not(:disabled) {
        background: linear-gradient(180deg, #eff6ff 0%, #dbeafe 100%);
        color: #1d4ed8;
    }

    .quantity-btn:disabled {
        cursor: not-allowed;
        opacity: 0.45;
    }

    @media (max-width: 768px) {
        width: 156px;

        .quantity-btn {
            width: 40px;
            height: 40px;
        }
    }
`

export const WrapperInputNumber = styled(InputNumber)`
  width: calc(100% - 88px) !important;
  text-align: center;
  border: none !important;
  background: #fff !important;
  border-radius: 0 !important;

  &.ant-input-number {
    box-shadow: none !important;
  }

  .ant-input-number-handler-wrap {
    display: none !important;
  }

  input {
    text-align: center;
    font-weight: 700;
    font-size: 17px;
    color: #0f172a;
  }

  @media (max-width: 768px) {
    width: calc(100% - 80px) !important;
    
    input {
      font-size: 15px;
    }
  }
`


