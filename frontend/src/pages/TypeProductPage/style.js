import styled from "styled-components";
import { Col } from "antd";

export const WrapperContainer = styled.div`
  padding: 0 120px;
  background: #efefef;
  min-height: 100vh;
`;

export const WrapperProducts = styled.div`
  display: flex;
  justify-content: flex-start;
  gap: 14px;
  margin-top: 20px;
  flex-wrap: wrap;
  background: #efefef;
`;

export const WrapperNavbar = styled(Col)`
  background: #fff;
  margin-right: 10px;
  padding: 10px;
  border-radius: 6px;
  height: fit-content;
  margin-top: 20px;
`;
