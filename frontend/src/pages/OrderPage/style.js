import styled from 'styled-components'

export const WrapperContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
  background: #f5f5f5;
  min-height: 100vh;
`

export const WrapperHeader = styled.div`
  background: #1a94ff;
  color: white;
  padding: 28px 40px;
  border-radius: 12px;
  margin-bottom: 28px;
  box-shadow: 0 4px 12px rgba(26, 148, 255, 0.2);
  
  h2 {
    margin: 0;
    font-size: 26px;
    font-weight: 700;
  }
`

export const WrapperProductInfo = styled.div`
  background: white;
  border-radius: 12px;
  margin-bottom: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  border: 1px solid #e5e7eb;
  
  .product-item {
    padding: 24px;
    display: flex;
    align-items: center;
    gap: 20px;
    border-bottom: 1px solid #f0f0f0;
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
  width: 100px;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fafafa;
  border-radius: 10px;
  overflow: hidden;
  border: 1px solid #e5e7eb;
  
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
    font-size: 17px;
    font-weight: 600;
    color: #1f2937;
    margin-bottom: 10px;
    line-height: 1.5;
    letter-spacing: -0.2px;
  }
  
  .product-price {
    font-size: 19px;
    font-weight: 700;
    color: #ff4d4f;
    margin-bottom: 6px;
  }
  
  .product-original-price {
    font-size: 15px;
    color: #9ca3af;
    text-decoration: line-through;
  }
`

export const WrapperSummary = styled.div`
  background: white;
  padding: 28px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  position: sticky;
  top: 20px;
  border: 1px solid #e5e7eb;
  
  .summary-title {
    font-size: 20px;
    font-weight: 700;
    color: #333;
    margin-bottom: 20px;
    text-align: center;
  }
  
  .summary-row {
    display: flex;
    justify-content: space-between;
    margin-bottom: 14px;
    font-size: 15px;
    color: #555;
    
    &.total {
      font-size: 19px;
      font-weight: 700;
      color: #ff4d4f;
      border-top: 2px solid #e5e7eb;
      padding-top: 14px;
      margin-top: 14px;
    }
  }
  
  .checkout-btn {
    width: 100%;
    height: 50px;
    font-size: 16px;
    font-weight: 600;
    border-radius: 8px;
    margin-top: 20px;
    background: #1a94ff;
    border: none;
    box-shadow: 0 2px 8px rgba(26, 148, 255, 0.3);
    transition: all 0.3s ease;
    
    &:hover {
      background: #0d7de8;
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(26, 148, 255, 0.4);
    }
    
    &:active {
      transform: translateY(0);
    }
  }
`

export const WrapperEmpty = styled.div`
  background: white;
  padding: 60px 40px;
  border-radius: 12px;
  text-align: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  border: 1px solid #e5e7eb;
  
  .empty-title {
    font-size: 18px;
    font-weight: 600;
    color: #555;
    margin-bottom: 14px;
  }
  
  .empty-description {
    color: #888;
    margin-bottom: 24px;
    font-size: 14px;
  }
  
  .shopping-btn {
    background: #1a94ff;
    border: none;
    height: 44px;
    padding: 0 28px;
    border-radius: 8px;
    font-weight: 600;
    box-shadow: 0 2px 8px rgba(26, 148, 255, 0.3);
    
    &:hover {
      background: #0d7de8;
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(26, 148, 255, 0.4);
    }
  }
`
