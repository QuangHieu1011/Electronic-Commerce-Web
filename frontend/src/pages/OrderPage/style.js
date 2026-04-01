import styled from 'styled-components'

export const WrapperContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
  background: #f5f5f5;
  min-height: 100vh;

  .order-layout {
    display: flex;
    gap: 20px;
    align-items: flex-start;
  }

  .order-main {
    flex: 1;
    min-width: 0;
  }

  .order-summary-col {
    width: 350px;
    flex-shrink: 0;
  }

  @media (max-width: 1200px) {
    .order-layout {
      flex-direction: column;
    }

    .order-summary-col {
      width: 100%;
    }
  }
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

  .table-row {
    display: grid;
    grid-template-columns: 44px minmax(0, 1fr) 140px 170px 140px 44px;
    align-items: center;
    column-gap: 12px;
    padding: 18px 20px;
  }

  .table-head {
    background-color: #fafafa;
    border-bottom: 1px solid #f0f0f0;
    font-weight: 600;
    color: #666;
  }

  .col {
    min-width: 0;
  }

  .col.unit-price,
  .col.quantity,
  .col.total,
  .col.action,
  .col.checkbox {
    text-align: center;
  }

  .product-cell {
    display: flex;
    align-items: center;
    gap: 14px;
    min-width: 0;
  }

  .quantity-controls {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
  }
  
  .product-item {
    border-bottom: 1px solid #f0f0f0;
    transition: all 0.3s ease;
    
    &:hover {
      background: #fafafa;
    }
    
    &:last-child {
      border-bottom: none;
    }
  }

  @media (max-width: 1024px) {
    .table-row {
      grid-template-columns: 44px minmax(220px, 1fr) 120px 150px 120px 40px;
      padding: 16px;
    }
  }

  @media (max-width: 768px) {
    .table-head {
      display: none;
    }

    .table-row.product-item {
      grid-template-columns: 32px minmax(0, 1fr);
      row-gap: 10px;
      align-items: start;
    }

    .table-row.product-item .col.checkbox {
      grid-column: 1;
      grid-row: 1;
      text-align: left;
      padding-top: 6px;
    }

    .table-row.product-item .col.product {
      grid-column: 2;
      grid-row: 1;
    }

    .table-row.product-item .col.unit-price,
    .table-row.product-item .col.quantity,
    .table-row.product-item .col.total,
    .table-row.product-item .col.action {
      grid-column: 2;
      text-align: left;
    }

    .table-row.product-item .col.unit-price::before,
    .table-row.product-item .col.quantity::before,
    .table-row.product-item .col.total::before {
      content: attr(data-label) ':';
      display: inline-block;
      min-width: 88px;
      font-weight: 600;
      color: #6b7280;
      margin-right: 8px;
    }

    .table-row.product-item .col.action {
      margin-top: -4px;
    }

    .product-cell {
      align-items: flex-start;
    }
  }
`

export const WrapperProductImage = styled.div`
  width: 88px;
  height: 88px;
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
  min-width: 0;
  
  .product-name {
    font-size: 18px;
    font-weight: 600;
    color: #1f2937;
    margin-bottom: 8px;
    line-height: 1.35;
    letter-spacing: -0.2px;
    white-space: normal;
    word-break: keep-all;
    overflow-wrap: break-word;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .product-tags {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 6px;
    margin-bottom: 8px;
  }

  .tag {
    display: inline-flex;
    align-items: center;
    padding: 2px 7px;
    border-radius: 4px;
    font-size: 11px;
    font-weight: 700;
    line-height: 1;
  }

  .tag.discount {
    color: #ffffff;
    background: #ee4d2d;
  }

  .tag.type {
    color: #1d4ed8;
    background: #e8f1ff;
    text-transform: capitalize;
  }
  
  .product-price {
    font-size: 19px;
    font-weight: 700;
    color: #ff4d4f;
    margin-bottom: 6px;
  }
  
  .product-original-price {
    font-size: 14px;
    color: #9ca3af;
    text-decoration: line-through;
  }

  @media (max-width: 992px) {
    .product-name {
      font-size: 16px;
    }
  }

  @media (max-width: 768px) {
    .product-name {
      font-size: 15px;
      -webkit-line-clamp: 3;
    }
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
