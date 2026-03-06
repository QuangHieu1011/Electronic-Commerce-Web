import styled from 'styled-components'

export const WrapperContainer = styled.div`
  max-width: 1400px;
  margin: 0 auto;
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
  display: flex;
  align-items: center;
  gap: 16px;
  border-left: 4px solid #1a94ff;
  
  h2 {
    margin: 0;
    font-size: 24px;
    font-weight: 600;
    color: #262626;
    flex: 1;
  }

  button {
    border: 1px solid #1a94ff;
    color: #1a94ff;
    
    &:hover {
      background: #1a94ff;
      color: #fff;
    }
  }
`

export const WrapperStats = styled.div`
  margin-bottom: 24px;
  
  .ant-card {
    text-align: center;
    border-radius: 8px;
    border: 1px solid #e5e7eb;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
    
    .ant-statistic-content {
      font-size: 24px;
      font-weight: 600;
      color: #1a94ff;
    }
    
    .ant-statistic-title {
      color: #666;
      font-size: 14px;
      font-weight: 500;
    }
  }
`

export const WrapperProductInfo = styled.div`
  background: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
  overflow: hidden;
  border: 1px solid #e5e7eb;
`

export const WrapperProductImage = styled.div`
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fafafa;
  border-radius: 8px;
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

export const WrapperEmpty = styled.div`
  background: white;
  padding: 60px 40px;
  border-radius: 8px;
  text-align: center;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
  
  .empty-title {
    font-size: 18px;
    color: #666;
    margin-bottom: 16px;
    font-weight: 500;
  }
  
  .empty-description {
    color: #999;
    margin-bottom: 24px;
  }
  
  .shopping-btn {
    background: #1a94ff;
    border: none;
    height: 40px;
    padding: 0 24px;
    border-radius: 8px;
    font-weight: 500;
    
    &:hover {
      background: #0d7de8;
    }
  }
`