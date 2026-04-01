import React, { useEffect, useState } from 'react'
import { Badge, Popover } from 'antd';
import {
  ActionIconItem,
  ActionLabel,
  CategoryBar,
  CategoryContent,
  CategoryItem,
  HeaderShell,
  LogoAccent,
  LogoBase,
  MainBar,
  SearchWrapper,
  UtilityBar,
  UtilityContent,
  UtilityLanguageBadge,
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
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import * as UserService from '../../service/UserService'
import { resetUser } from '../../redux/slides/userSlide'
import Loading from '../LoadingComponent/Loading';
import { searchProduct } from '../../redux/slides/productSlide';
import { useLanguage } from '../../context/LanguageContext';
import * as ProductService from '../../service/ProductService';






const HeaderComponent = ({ isHiddenSearch = false, isHiddenCart = false }) => {
  const navigate = useNavigate();
  const location = useLocation();
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
    localStorage.removeItem('auth_session');
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

  const getActiveType = () => {
    if (!location.pathname.startsWith('/product/')) return '';

    try {
      const currentType = location.pathname.replace('/product/', '');
      return decodeURIComponent(currentType).replace(/_/g, ' ').toLowerCase();
    } catch (error) {
      return '';
    }
  };

  const activeType = getActiveType();

  return (
    <HeaderShell>
      {!isHiddenSearch && (
        <UtilityBar>
          <UtilityContent>
            <div>{t('header.utilityMessage')}</div>
            <WrapperTopRight>
              <UtilityLink onClick={() => navigate('/order-tracking')}>{t('header.shippingReturn')}</UtilityLink>
              <UtilityLink onClick={() => navigate('/order-tracking')}>{t('header.trackOrder')}</UtilityLink>
              <UtilityLanguageBadge
                type="button"
                onClick={() => setLanguage(language === 'en' ? 'vi' : 'en')}
              >
                {language === 'en' ? 'EN' : 'VI'}
              </UtilityLanguageBadge>
            </WrapperTopRight>
          </UtilityContent>
        </UtilityBar>
      )}

      <MainBar>
        <WrapperHeader>
          <WrapperTextHeader onClick={() => navigate('/')}>
            <LogoBase>Tech</LogoBase>
            <LogoAccent>Store</LogoAccent>
          </WrapperTextHeader>

          {!isHiddenSearch && (
            <SearchWrapper>
              <ButtonInputSearch
                size="large"
                placeholder={t('common.searchPlaceholder')}
                textButton={t('common.searchButton').toUpperCase()}
                backgroundColorInput="#ffffff"
                backgroundColorButton="#f59e0b"
                colorButton="#0a1f3d"
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
                <ActionIconItem onClick={() => navigate('/comparison')}>
                  <Badge count={comparisonItems.length} size="small" style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)', color: '#ffffff' }}>
                    <SwapOutlined className="action-icon" />
                  </Badge>
                  <ActionLabel>{t('header.compare')}</ActionLabel>
                </ActionIconItem>
                <ActionIconItem onClick={() => navigate('/wishlist')}>
                  <Badge count={wishlistItems.length} size="small" style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)', color: '#ffffff' }}>
                    <HeartOutlined className="action-icon" />
                  </Badge>
                  <ActionLabel>{t('header.wishlist')}</ActionLabel>
                </ActionIconItem>
                <ActionIconItem onClick={() => navigate('/order')}>
                  <Badge
                    count={cart?.totalQuantity || 0}
                    size="small"
                    style={{ backgroundColor: '#f59e0b', color: '#0a1f3d', fontWeight: 800 }}
                  >
                    <ShoppingCartOutlined className="action-icon" />
                  </Badge>
                  <ActionLabel>{t('header.cart')}</ActionLabel>
                </ActionIconItem>
              </>
            )}
          </WrapperIconGroup>
        </WrapperHeader>
      </MainBar>

      {!isHiddenSearch && (
        <CategoryBar>
          <CategoryContent>
            <CategoryItem $active={location.pathname === '/'} onClick={() => navigate('/')}>
              {t('header.allProducts')}
            </CategoryItem>
            {typeProducts.map((type) => (
              <CategoryItem
                key={type}
                $active={type.toLowerCase() === activeType}
                onClick={() => handleNavigateType(type)}
              >
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