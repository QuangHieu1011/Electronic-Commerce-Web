import styled from 'styled-components'

export const WrapperContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  background: #f8f9fa;
  min-height: 100vh;
`

export const WrapperHeader = styled.div`
  background: linear-gradient(135deg, rgb(26,148,255) 0%, rgb(26,180,255) 100%);
  color: white;
  padding: 24px;
  border-radius: 12px;
  margin-bottom: 24px;
  box-shadow: 0 4px 20px rgba(26, 148, 255, 0.3);
  
  h2 {
    margin: 0;
    font-size: 24px;
    font-weight: 600;
  }
`

export const WrapperProductInfo = styled.div`
  background: white;
  border-radius: 12px;
  margin-bottom: 20px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  border: 1px solid #f0f0f0;
  
  .product-item {
    padding: 20px;
    display: flex;
    align-items: center;
    gap: 16px;
    border-bottom: 1px solid #f5f5f5;
    transition: all 0.3s ease;
    
    &:hover {
      background: #fafafa;
    }
    
    &:last-child {
      border-bottom: none;
    }
  }
`

export const WrapperProductImage = styled.div`
  width: 80px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fafafa;
  border-radius: 8px;
  overflow: hidden;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  .ant-image {
    width: 100%;
    height: 100%;
    
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
`

export const WrapperProductDetails = styled.div`
  flex: 1;
  
  .product-name {
    font-size: 16px;
    font-weight: 500;
    color: #333;
    margin-bottom: 8px;
    line-height: 1.4;
  }
  
  .product-price {
    font-size: 18px;
    font-weight: 600;
    color: #ff4d4f;
    margin-bottom: 4px;
  }
  
  .product-original-price {
    font-size: 14px;
    color: #999;
    text-decoration: line-through;
  }
`

export const WrapperSummary = styled.div`
  background: white;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  position: sticky;
  top: 20px;
  border: 1px solid #f0f0f0;
  
  .summary-title {
    font-size: 20px;
    font-weight: 600;
    color: #333;
    margin-bottom: 20px;
    text-align: center;
  }
  
  .summary-row {
    display: flex;
    justify-content: space-between;
    margin-bottom: 12px;
    font-size: 14px;
    
    &.total {
      font-size: 18px;
      font-weight: 600;
      color: #ff4d4f;
      border-top: 1px solid #f0f0f0;
      padding-top: 12px;
      margin-top: 12px;
    }
  }
  
  .checkout-btn {
    width: 100%;
    height: 48px;
    font-size: 16px;
    font-weight: 600;
    border-radius: 8px;
    margin-top: 20px;
    background: linear-gradient(135deg, rgb(26,148,255) 0%, rgb(26,180,255) 100%);
    border: none;
    
    &:hover {
      background: linear-gradient(135deg, rgb(20,130,235) 0%, rgb(20,160,235) 100%);
      transform: translateY(-1px);
    }
  }
`

export const WrapperEmpty = styled.div`
  background: white;
  padding: 60px 40px;
  border-radius: 12px;
  text-align: center;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  
  .empty-title {
    font-size: 18px;
    color: #666;
    margin-bottom: 16px;
  }
  
  .empty-description {
    color: #999;
    margin-bottom: 24px;
  }
  
  .shopping-btn {
    background: linear-gradient(135deg, rgb(26,148,255) 0%, rgb(26,180,255) 100%);
    border: none;
    height: 40px;
    padding: 0 24px;
    border-radius: 8px;
    font-weight: 500;
  }
`
