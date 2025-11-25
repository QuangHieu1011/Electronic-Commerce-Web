import styled from 'styled-components'

export const WrapperContainer = styled.div`
  max-width: 1440px;
  margin: 0 auto;
  padding: 20px;
  background: linear-gradient(180deg, #f8f9fa 0%, #ffffff 100%);
  min-height: 100vh;

  @media (max-width: 1200px) {
    padding: 16px;
  }

  @media (max-width: 768px) {
    padding: 12px;
  }
`

export const WrapperHeader = styled.div`
  background: white;
  padding: 24px;
  border-radius: 12px;
  margin-bottom: 24px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  display: flex;
  align-items: center;
  gap: 16px;
  transition: all 0.3s ease;
  animation: slideInDown 0.5s ease-out;

  @keyframes slideInDown {
    from {
      opacity: 0;
      transform: translateY(-20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  h3 {
    margin: 0;
    color: #262626;
    font-weight: 700;
    font-size: 22px;
  }

  @media (max-width: 768px) {
    padding: 16px;
    
    h3 {
      font-size: 18px;
    }
  }
`

export const WrapperContent = styled.div`
  animation: fadeIn 0.6s ease-out;

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  .ant-row {
    @media (max-width: 992px) {
      flex-direction: column-reverse;
    }
  }

  .ant-card {
    margin-bottom: 8px;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    cursor: pointer;
    border-radius: 10px;
    
    &:hover {
      border-color: #1890ff;
      transform: translateX(4px);
    }
    
    &.selected {
      border-color: #1890ff;
      background: linear-gradient(135deg, #e6f7ff 0%, #f0f5ff 100%);
      box-shadow: 0 4px 12px rgba(24, 144, 255, 0.15);
    }
  }
`

export const WrapperSection = styled.div`
  background: white;
  padding: 28px;
  border-radius: 12px;
  margin-bottom: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  animation: slideInLeft 0.6s ease-out;

  @keyframes slideInLeft {
    from {
      opacity: 0;
      transform: translateX(-30px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  &:hover {
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12);
  }

  h4 {
    margin-bottom: 24px;
    color: #262626;
    border-bottom: 2px solid #f0f0f0;
    padding-bottom: 12px;
    font-weight: 700;
    font-size: 18px;
  }

  @media (max-width: 768px) {
    padding: 20px 16px;
    
    h4 {
      font-size: 16px;
      margin-bottom: 16px;
    }
  }
`

export const WrapperSummary = styled.div`
  background: white;
  padding: 28px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  position: sticky;
  top: 90px;
  transition: all 0.3s ease;
  animation: slideInRight 0.6s ease-out;
  border: 2px solid #f0f0f0;

  @keyframes slideInRight {
    from {
      opacity: 0;
      transform: translateX(30px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  &:hover {
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
    border-color: #1890ff;
  }

  h4 {
    margin-bottom: 20px;
    color: #262626;
    text-align: center;
    border-bottom: 2px solid #f0f0f0;
    padding-bottom: 14px;
    font-weight: 700;
    font-size: 18px;
  }

  @media (max-width: 992px) {
    position: static;
    margin-bottom: 20px;
  }

  @media (max-width: 768px) {
    padding: 20px 16px;
    
    h4 {
      font-size: 16px;
      margin-bottom: 16px;
    }
  }
`