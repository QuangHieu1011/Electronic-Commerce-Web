import styled from 'styled-components'

export const WrapperContainer = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px;
  background: #f8f9fa;
  min-height: 100vh;
`

export const WrapperHeader = styled.div`
  background: white;
  padding: 20px 24px;
  border-radius: 8px;
  margin-bottom: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 16px;

  h3 {
    margin: 0;
    color: #333;
  }
`

export const WrapperContent = styled.div`
  .ant-card {
    margin-bottom: 8px;
    transition: all 0.3s ease;
    cursor: pointer;
    
    &:hover {
      border-color: #1890ff;
    }
    
    &.selected {
      border-color: #1890ff;
      background: #f6ffed;
    }
  }
`

export const WrapperSection = styled.div`
  background: white;
  padding: 24px;
  border-radius: 8px;
  margin-bottom: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

  h4 {
    margin-bottom: 20px;
    color: #333;
    border-bottom: 1px solid #f0f0f0;
    padding-bottom: 12px;
  }
`

export const WrapperSummary = styled.div`
  background: white;
  padding: 24px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 20px;

  h4 {
    margin-bottom: 20px;
    color: #333;
    text-align: center;
    border-bottom: 1px solid #f0f0f0;
    padding-bottom: 12px;
  }
`