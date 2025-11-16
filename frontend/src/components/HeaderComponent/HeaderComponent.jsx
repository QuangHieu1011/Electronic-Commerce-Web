import React from 'react'
import { Badge, Col } from 'antd';
import { WrapperHeader , WrapperHeaderAccount, WrapperText, WrapperTextHeader} from './style';
import Search from 'antd/es/transfer/search';
import {
  UserOutlined,
  CaretDownOutlined,
  ShoppingCartOutlined
} from '@ant-design/icons';
import ButtonInputSearch from '../ButtonInputSearch/ButtonInputSearch';
import { useNavigate } from 'react-router-dom';

const HeaderComponent = () => {
  const navigate = useNavigate();
  const handleNavigatedLogin = () => {
    navigate('/sign-in');
  }
  return (
    <div style={{width: '100%', background: 'rgb(26,148,255)',display:'flex',}}>
        <WrapperHeader>
          <Col span={5}>
            <WrapperTextHeader>TECHSTORE</WrapperTextHeader>
          </Col>
          <Col span={13}>
          <ButtonInputSearch
            size="large"
            placeholder="Input search text" 
            textButton="Search"
            //onSearch={onSearch}
          />
          </Col>
          <Col span={6} style ={{display: 'flex', gap: '54px',alignItems:'center'}}>
            <WrapperHeaderAccount> 
                <UserOutlined style ={{ fontSize : '30px' }}/>
              <div onClick={handleNavigatedLogin} style ={{ cursor: 'pointer'}}>
                <WrapperText>Đăng nhập / Đăng ký</WrapperText>
                <div>
                   <WrapperText>Tài Khoản</WrapperText>
                   <CaretDownOutlined />
                </div>
              </div>
            </WrapperHeaderAccount>
              <div>
                <Badge count={5} size="small">
                    <ShoppingCartOutlined style ={{ fontSize : '30px', color :'#fff' }}/>
                </Badge>
                <WrapperText>Giỏ Hàng</WrapperText>
              </div>
          </Col>
        </WrapperHeader>
    </div>
  )
}

export default HeaderComponent