import React, { useEffect, useState } from 'react'
import { Badge, Col, Popover, Switch } from 'antd';
import { WrapperContentPopup, WrapperHeader, WrapperHeaderAccount, WrapperText, WrapperTextHeader } from './style';
// import Search from 'antd/es/transfer/search'; (không sử dụng)
import {
  UserOutlined,
  CaretDownOutlined,
  ShoppingCartOutlined,
  HeartOutlined,
  SwapOutlined
} from '@ant-design/icons';
import ButtonInputSearch from '../ButtonInputSearch/ButtonInputSearch';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import * as UserService from '../../service/UserService'
import { resetUser } from '../../redux/slides/userSlide'
import Loading from '../LoadingComponent/Loading';
import { searchProduct } from '../../redux/slides/productSlide';
import { useLanguage } from '../../context/LanguageContext';






const HeaderComponent = ({ isHiddenSearch = false, isHiddenCart = false }) => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
  const cart = useSelector((state) => state.cart);
  const comparisonItems = useSelector((state) => state.comparison?.comparisonItems || []);
  const wishlistItems = useSelector((state) => state.wishlist?.wishlistItems || []);
  const dispatch = useDispatch();
  const { language, setLanguage, t } = useLanguage();
  const handleNavigatedLogin = () => {
    navigate('/sign-in');
  }



  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    try {
      await UserService.logoutUser();
    } catch (e) { }
    localStorage.removeItem('access_token');
    dispatch(resetUser());
    setLoading(false);
    window.location.href = '/';
  }

  const [userName, setUserName] = useState(user?.name || user?.email || t('common.user'));
  const [userAvatar, setUserAvatar] = useState('');

  useEffect(() => {
    setUserName(user?.name || user?.email || t('common.user'));
    setUserAvatar(user?.avatar || '');
  }, [user?.name, user?.email, user?.avatar, t]);

  const content = (
    <div>
      <WrapperContentPopup onClick={() => navigate('/profile-user')}>{t('header.userInfo')}</WrapperContentPopup>
      {!user.isAdmin && (
        <WrapperContentPopup onClick={() => navigate('/order-tracking')}>{t('header.trackOrder')}</WrapperContentPopup>
      )}
      {user.isAdmin && (
        <WrapperContentPopup onClick={() => navigate('/system/admin')}>{t('header.adminSystem')}</WrapperContentPopup>
      )}
      <WrapperContentPopup onClick={handleLogout}>{t('header.logout')}</WrapperContentPopup>
    </div>
  );
  const onSearch = (e) => {
    dispatch(searchProduct(e.target.value));
  }

  return (
    <div style={{ width: '100%', background: 'rgb(26,148,255)', display: 'flex' }}>
      <WrapperHeader style={{ justifyContent: isHiddenSearch && isHiddenSearch ? 'space-between' : 'unset' }}>
        <Col span={4}>
          <WrapperTextHeader onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>TECHSTORE</WrapperTextHeader>
        </Col>
        {!isHiddenSearch && (
          <Col span={12}>
            <ButtonInputSearch
              size="large"
              placeholder={t('common.searchPlaceholder')}
              textButton={t('common.searchButton')}
              onChange={onSearch}
            />
          </Col>
        )}

        <Col span={8}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
            <Switch
              checked={language === 'en'}
              onChange={(checked) => setLanguage(checked ? 'en' : 'vi')}
              checkedChildren="EN"
              unCheckedChildren="VI"
              style={{ backgroundColor: language === 'en' ? '#52c41a' : '#1677ff' }}
            />
            <Loading isLoading={loading}>
              <WrapperHeaderAccount>
                {userAvatar ? (
                  <img src={userAvatar} alt="avatar" style={{ height: '30px', width: '30px', borderRadius: '50%', objectFit: 'cover' }} />
                ) : (
                  <UserOutlined style={{ fontSize: '30px' }} />)}
                {user?.access_token ? (
                  <>
                    <Popover content={content} trigger="click">
                      <div style={{ cursor: 'pointer' }}> {userName?.length ? userName : user?.email} </div>
                    </Popover>
                  </>
                ) : (
                  <div onClick={handleNavigatedLogin} style={{ cursor: 'pointer' }}>
                    <WrapperText>{t('header.signInSignUp')}</WrapperText>
                    <div>
                      <WrapperText>{t('header.account')}</WrapperText>
                      <CaretDownOutlined />
                    </div>
                  </div>
                )}
              </WrapperHeaderAccount>
            </Loading>
            {!isHiddenCart && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }} onClick={() => navigate('/comparison')}>
                  <Badge count={comparisonItems.length} size="small" style={{ backgroundColor: '#52c41a' }}>
                    <SwapOutlined style={{ fontSize: '28px', color: '#fff' }} />
                  </Badge>
                  <WrapperText>{t('header.compare')}</WrapperText>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }} onClick={() => navigate('/wishlist')}>
                  <Badge count={wishlistItems.length} size="small" style={{ backgroundColor: '#ff4d4f' }}>
                    <HeartOutlined style={{ fontSize: '28px', color: '#fff' }} />
                  </Badge>
                  <WrapperText>{t('header.wishlist')}</WrapperText>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }} onClick={() => navigate('/order')}>
                  <Badge count={cart?.totalQuantity || 0} size="small">
                    <ShoppingCartOutlined style={{ fontSize: '28px', color: '#fff' }} />
                  </Badge>
                  <WrapperText>{t('header.cart')}</WrapperText>
                </div>
              </div>
            )}
          </div>
        </Col>
      </WrapperHeader>
    </div>
  )
}

export default HeaderComponent