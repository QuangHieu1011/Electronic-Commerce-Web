import React from 'react'
import NavbarComponent from '../../components/NavbarComponent/NavbarComponent'
import CardComponent from '../../components/CardComponent/CardComponent'
import { Col, Pagination, Row } from 'antd'
import { WrapperNavbar, WrapperProducts, WrapperContainer } from './style'

const TypeProductPage = () => {
  const onChange = (page) => {
    console.log('Page: ', page);
  };

  return (
    <WrapperContainer>
      <Row gutter={16} style={{ paddingTop: '20px' }}>
        <Col span={4}>
          <WrapperNavbar>
            <NavbarComponent />
          </WrapperNavbar>
        </Col>

        <Col span={20}>
          <WrapperProducts>
            <CardComponent />   
            <CardComponent /> 
            <CardComponent /> 
            <CardComponent /> 
            <CardComponent /> 
            <CardComponent /> 
            <CardComponent /> 
            <CardComponent />
          </WrapperProducts>

          <div style={{ display: 'flex', justifyContent: 'center', margin: '20px 0' }}>
            <Pagination
              defaultCurrent={2}
              total={100}
              showSizeChanger
              onChange={onChange}
            />
          </div>
        </Col>
      </Row>
    </WrapperContainer>
  )
}

export default TypeProductPage
