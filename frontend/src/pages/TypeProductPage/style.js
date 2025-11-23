import styled from "styled-components";
import { Col } from "antd";

export const WrapperContainer = styled.div`
  padding: 0 120px;
  background: #efefef;
  min-height: 100vh;
  
  @media (max-width: 768px) {
    padding: 0 20px;
  }
`;

export const WrapperHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 0 10px;
  
  h2 {
    margin: 0;
    color: #333;
    font-size: 24px;
    font-weight: 600;
    text-transform: capitalize;
  }
`;

export const WrapperSort = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  
  span {
    color: #666;
    font-weight: 500;
  }
`;

export const WrapperProducts = styled.div`
  display: flex;
  justify-content: flex-start;
  gap: 14px;
  margin-top: 20px;
  flex-wrap: wrap;
  background: #efefef;
  min-height: 400px;
`;

export const WrapperNavbar = styled(Col)`
  background: #fff;
  margin-right: 10px;
  padding: 15px;
  border-radius: 8px;
  height: fit-content;
  margin-top: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;
