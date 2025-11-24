import styled from 'styled-components'

export const WrapperContainer = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px;
  background: #f8f9fa;
  min-height: 100vh;
`

export const WrapperHeader = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 24px;
  border-radius: 12px;
  margin-bottom: 24px;
  box-shadow: 0 4px 20px rgba(102, 126, 234, 0.3);
  display: flex;
  align-items: center;
  gap: 16px;
  
  h2 {
    margin: 0;
    font-size: 24px;
    font-weight: 600;
  }
`

export const WrapperStats = styled.div`
  margin-bottom: 20px;
  
  .ant-card {
    text-align: center;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    
    .ant-statistic-content {
      font-size: 20px;
      font-weight: 600;
    }
    
    .ant-statistic-title {
      color: #666;
      font-size: 12px;
    }
  }
`

export const WrapperProductInfo = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  border: 1px solid #f0f0f0;
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
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
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
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border: none;
    height: 40px;
    padding: 0 24px;
    border-radius: 8px;
    font-weight: 500;
  }
`