import React, { useEffect, useState } from 'react'
import { Badge, Popover, Switch } from 'antd';
import {
  CategoryBar,
  CategoryContent,
  CategoryItem,
  HeaderShell,
  MainBar,
  SearchWrapper,
  UtilityBar,
  UtilityContent,
  UtilityLink,
  WrapperContentPopup,
  WrapperHeader,
  WrapperHeaderAccount,
  WrapperIconGroup,
  WrapperText,
  WrapperTextHeader,
  WrapperTopRight
} from './style';
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
import * as ProductService from '../../service/ProductService';






const HeaderComponent = ({ isHiddenSearch = false, isHiddenCart = false }) => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
  const cart = useSelector((state) => state.cart);
  const comparisonItems = useSelector((state) => state.comparison?.comparisonItems || []);
  const wishlistItems = useSelector((state) => state.wishlist?.wishlistItems || []);
  const dispatch = useDispatch();
  const { language, setLanguage, t } = useLanguage();
  const [typeProducts, setTypeProducts] = useState([]);

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

  useEffect(() => {
    if (isHiddenSearch) return;

    const fetchTypes = async () => {
      try {
        const res = await ProductService.getAllTypeProduct();
        if (res?.status === 'OK' && Array.isArray(res.data)) {
          setTypeProducts(res.data.slice(0, 7));
        }
      } catch (error) {
        setTypeProducts([]);
      }
    };

    fetchTypes();
  }, [isHiddenSearch]);

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

  const handleNavigateType = (type) => {
    const encodedType = encodeURIComponent(type.replace(/ /g, '_'));
    navigate(`/product/${encodedType}`);
  };

  return (
    <HeaderShell>
      {!isHiddenSearch && (
        <UtilityBar>
          <UtilityContent>
            <div style={{ opacity: 0.95 }}>{t('header.utilityMessage')}</div>
            <WrapperTopRight>
              <UtilityLink onClick={() => navigate('/order-tracking')}>{t('header.shippingReturn')}</UtilityLink>
              <UtilityLink onClick={() => navigate('/order-tracking')}>{t('header.trackOrder')}</UtilityLink>
              <Switch
                checked={language === 'en'}
                onChange={(checked) => setLanguage(checked ? 'en' : 'vi')}
                checkedChildren="EN"
                unCheckedChildren="VI"
                size="small"
                style={{ backgroundColor: language === 'en' ? '#52c41a' : '#1677ff' }}
              />
            </WrapperTopRight>
          </UtilityContent>
        </UtilityBar>
      )}

      <MainBar>
        <WrapperHeader>
          <WrapperTextHeader onClick={() => navigate('/')}>TechStore</WrapperTextHeader>

          {!isHiddenSearch && (
            <SearchWrapper>
              <ButtonInputSearch
                size="large"
                placeholder={t('common.searchPlaceholder')}
                textButton={t('common.searchButton')}
                onChange={onSearch}
              />
            </SearchWrapper>
          )}

          <WrapperIconGroup>
            <Loading isLoading={loading}>
              <WrapperHeaderAccount>
                {userAvatar ? (
                  <img src={userAvatar} alt="avatar" style={{ height: '30px', width: '30px', borderRadius: '50%', objectFit: 'cover' }} />
                ) : (
                  <UserOutlined style={{ fontSize: '26px' }} />)}
                {user?.access_token ? (
                  <Popover content={content} trigger="click">
                    <div style={{ cursor: 'pointer' }}>{userName?.length ? userName : user?.email}</div>
                  </Popover>
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
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }} onClick={() => navigate('/comparison')}>
                  <Badge count={comparisonItems.length} size="small" style={{ backgroundColor: '#52c41a' }}>
                    <SwapOutlined style={{ fontSize: '24px', color: '#ffffff' }} />
                  </Badge>
                  <WrapperText>{t('header.compare')}</WrapperText>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }} onClick={() => navigate('/wishlist')}>
                  <Badge count={wishlistItems.length} size="small" style={{ backgroundColor: '#ff4d4f' }}>
                    <HeartOutlined style={{ fontSize: '24px', color: '#ffffff' }} />
                  </Badge>
                  <WrapperText>{t('header.wishlist')}</WrapperText>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }} onClick={() => navigate('/order')}>
                  <Badge count={cart?.totalQuantity || 0} size="small">
                    <ShoppingCartOutlined style={{ fontSize: '24px', color: '#ffffff' }} />
                  </Badge>
                  <WrapperText>{t('header.cart')}</WrapperText>
                </div>
              </>
            )}
          </WrapperIconGroup>
        </WrapperHeader>
      </MainBar>

      {!isHiddenSearch && (
        <CategoryBar>
          <CategoryContent>
            <CategoryItem onClick={() => navigate('/')}>{t('header.allProducts')}</CategoryItem>
            {typeProducts.map((type) => (
              <CategoryItem key={type} onClick={() => handleNavigateType(type)}>
                {type}
              </CategoryItem>
            ))}
          </CategoryContent>
        </CategoryBar>
      )}
    </HeaderShell>
  )
}

export default HeaderComponent