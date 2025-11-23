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
import { searchProduct } from '../../redux/slides/productSlide';






const HeaderComponent = ({ isHiddenSearch = false, isHiddenCart = false }) => {
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
  const [search, setSearch] = useState('');

  useEffect(() => {
    setUserName(user?.name || user?.email || 'User');
    setUserAvatar(user?.avatar || '');
  }, [user?.name, user?.email]);


  const content = (
  <div>
    <WrapperContentPopup onClick={() => navigate('/profile-user')}>Thông tin người dùng</WrapperContentPopup>
    {user.isAdmin && (
      <WrapperContentPopup onClick={() => navigate('/system/admin')}>Quản lí hệ thống</WrapperContentPopup>
    )}
    <WrapperContentPopup onClick={handleLogout}>Đăng xuất</WrapperContentPopup>
  </div>
  );
  const onSearch = (e) => {
    setSearch(e.target.value);
    dispatch(searchProduct(e.target.value));
  }
  
  return (
    <div style={{width: '100%', background: 'rgb(26,148,255)',display:'flex'}}>
      <WrapperHeader style ={{ justifyContent: isHiddenSearch && isHiddenSearch ? 'space-between' : 'unset'}}>
        <Col span={5}>
          <WrapperTextHeader>TECHSTORE</WrapperTextHeader>
        </Col>
        {!isHiddenSearch && (
          <Col span={13}>
          <ButtonInputSearch
            size="large"
            placeholder="Input search text" 
            textButton="Search"
            onChange={onSearch}
          />
          </Col>
        )}
        
        <Col span={6}>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%'}}>
            <Loading isLoading={loading}>
            <WrapperHeaderAccount> 
              {userAvatar ? (
                <img src={userAvatar} alt="avatar" style={{ height:'30px', width: '30px', borderRadius: '50%', objectFit: 'cover' }}/>
              ) : (
              <UserOutlined style ={{ fontSize : '30px' }}/>)}
              {user?.access_token ? (
              <>
                <Popover content={content} trigger="click">
                    <div style ={{ cursor: 'pointer'}}> {userName?.length ? userName : user?.email } </div>
                </Popover>
              </>
              ): (
                <div onClick={handleNavigatedLogin} style ={{ cursor: 'pointer'}}>
                  <WrapperText>Đăng nhập / Đăng ký</WrapperText>
                  <div>
                    <WrapperText>Tài Khoản</WrapperText>
                    <CaretDownOutlined />
                  </div>
                </div>
              )}
            </WrapperHeaderAccount>
            </Loading>
            {!isHiddenCart && (
              <div style={{display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer'}} onClick={()=>navigate('/order')}>
                <Badge count={5} size="small">
                  <ShoppingCartOutlined style ={{ fontSize : '30px', color :'#fff' }}/>
                </Badge>
                <WrapperText>Giỏ Hàng</WrapperText>
              </div>
            )}
          </div>
        </Col>
      </WrapperHeader>
    </div>
  )
}

export default HeaderComponent