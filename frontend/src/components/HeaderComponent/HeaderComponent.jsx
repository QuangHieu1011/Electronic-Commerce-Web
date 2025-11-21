import React, { use, useEffect, useState } from 'react'
import { Badge, Button, Col, Popover } from 'antd';
import { WrapperContentPopup, WrapperHeader , WrapperHeaderAccount, WrapperText, WrapperTextHeader} from './style';
import Search from 'antd/es/transfer/search';
import {
  UserOutlined,
  CaretDownOutlined,
  ShoppingCartOutlined
} from '@ant-design/icons';
import ButtonInputSearch from '../ButtonInputSearch/ButtonInputSearch';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import * as UserService from '../../service/UserService'
import { resetUser } from '../../redux/slides/userSlide'
import Loading from '../LoadingComponent/Loading';




const HeaderComponent = () => {
  const navigate = useNavigate();
  const user =useSelector((state) => state.user);
  const dispatch = useDispatch();
  const handleNavigatedLogin = () => {
    navigate('/sign-in');
  }
  

  const [loading, setLoading] = useState(false);
  
  const handleLogout = async() => {
    setLoading(true);
    try {
      await UserService.logoutUser();
    } catch (e) {}
    localStorage.removeItem('access_token');
    dispatch(resetUser());
    setLoading(false);
    window.location.href = '/';
  }

  const [userName, setUserName] = useState(user?.name || user?.email || 'User');
  const [userAvatar, setUserAvatar] = useState('');

  useEffect(() => {
    setUserName(user?.name || user?.email || 'User');
    setUserAvatar(user?.avatar || '');
  }, [user?.name, user?.email]);


  const content = (
  <div>
    <WrapperContentPopup onClick={handleLogout}>Đăng xuất</WrapperContentPopup>
    <WrapperContentPopup onClick={() => navigate('/profile-user')}>Thông tin người dùng</WrapperContentPopup>
  </div>
  );
  
  return (
    <div style={{width: '100%', background: 'linear-gradient(135deg, #d70018 0%, #e02027 100%)', display:'flex', position: 'sticky', top: 0, zIndex: 1000}}>
      <WrapperHeader>
        <Col span={5}>
          <WrapperTextHeader onClick={() => navigate('/')}>⚡ TECHSTORE</WrapperTextHeader>
        </Col>
        <Col span={13}>
          <ButtonInputSearch
            size="large"
            placeholder="Bạn cần tìm gì hôm nay?" 
            textButton="Tìm kiếm"
          />
        </Col>
        <Col span={6}>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', gap: '12px'}}>
            <Loading isLoading={loading}>
            <WrapperHeaderAccount> 
              {userAvatar ? (
                <img src={userAvatar} alt="avatar" style={{ height:'32px', width: '32px', borderRadius: '50%', objectFit: 'cover', border: '2px solid rgba(255,255,255,0.5)' }}/>
              ) : (
              <UserOutlined style ={{ fontSize : '28px' }}/>)}
              {user?.access_token ? (
              <>
                <Popover content={content} trigger="click" placement="bottomRight">
                    <div style ={{ cursor: 'pointer', fontSize: '13px', fontWeight: '500'}}> {userName?.length ? userName : user?.email } </div>
                </Popover>
              </>
              ): (
                <div onClick={handleNavigatedLogin} style ={{ cursor: 'pointer'}}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                    <WrapperText style={{ fontSize: '12px', opacity: 0.9 }}>Đăng nhập / Đăng ký</WrapperText>
                    <WrapperText style={{ fontSize: '13px', fontWeight: '600' }}>Tài Khoản <CaretDownOutlined style={{ fontSize: '10px' }}/></WrapperText>
                  </div>
                </div>
              )}
            </WrapperHeaderAccount>
            </Loading>
            <div style={{display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', borderRadius: '8px', cursor: 'pointer', transition: 'all 0.3s ease'}} 
                 onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.15)'}
                 onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
              <Badge count={5} size="small" style={{ backgroundColor: '#ff9900' }}>
                <ShoppingCartOutlined style ={{ fontSize : '28px', color :'#fff' }}/>
              </Badge>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                <WrapperText style={{ fontSize: '12px', opacity: 0.9 }}>Giỏ hàng</WrapperText>
                <WrapperText style={{ fontSize: '13px', fontWeight: '600' }}>của tôi</WrapperText>
              </div>
            </div>
          </div>
        </Col>
      </WrapperHeader>
    </div>
  )
}

export default HeaderComponent