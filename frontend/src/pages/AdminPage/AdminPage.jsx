import { Menu } from 'antd'
import React, { useEffect, useMemo, useState } from 'react'
import { getItem } from '../../utils';
import { UserOutlined, AppstoreOutlined, ShoppingCartOutlined, StarOutlined, ThunderboltOutlined } from '@ant-design/icons';
import HeaderComponent from '../../components/HeaderComponent/HeaderComponent';
import AdminUser from '../../components/AdminUser/AdminUser';
import AdminProduct from '../../components/AdminProduct/AdminProduct';
import AdminInventory from '../../components/AdminInventory/AdminInventory';
import AdminReview from '../../components/AdminReview/AdminReview';
import AdminOrderManagement from '../AdminOrderManagement/AdminOrderManagement';
import AdminPromotion from '../../components/AdminPromotion/AdminPromotion';
import { useLocation, useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';

const AdminPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { language, setLanguage } = useLanguage();

    const getInitialTab = () => {
        const params = new URLSearchParams(location.search);
        const tabFromQuery = params.get('tab');
        if (tabFromQuery) return tabFromQuery;
        if (location.pathname === '/admin/orders') return 'orders';
        return 'user';
    };

    const items = [
        getItem('Users', 'user', <UserOutlined />),
        getItem('Products', 'product', <AppstoreOutlined />),
        getItem('Orders', 'orders', <ShoppingCartOutlined />),
        getItem('Inventory', 'inventory', <AppstoreOutlined />),
        getItem('Reviews', 'reviews', <StarOutlined />),
        getItem('Promotions', 'promotions', <ThunderboltOutlined />),
    ];

    const [keySelected, setKeySelected] = useState(getInitialTab());

    useEffect(() => {
        if (language !== 'en') {
            setLanguage('en');
        }
    }, [language, setLanguage]);

    useEffect(() => {
        const nextTab = getInitialTab();
        setKeySelected(nextTab);
    }, [location.pathname, location.search]);

    const renderPage = (key) => {
        switch (key) {
            case 'user':
                return (<AdminUser />);
            case 'product':
                return (<AdminProduct />);
            case 'orders':
                return (<AdminOrderManagement />);
            case 'inventory':
                return (<AdminInventory />);
            case 'reviews':
                return (<AdminReview />);
            case 'promotions':
                return (<AdminPromotion />);
            default:
                return (<AdminUser />);
        }
    }

    const activeTitle = useMemo(() => {
        const current = items.find((item) => item.key === keySelected);
        return current?.label || 'Users';
    }, [items, keySelected]);

    const handleOnClick = ({ key }) => {
        setKeySelected(key);
        navigate(`/system/admin?tab=${key}`, { replace: true });
    }

    return (
        <>
            <HeaderComponent isHiddenSearch isHiddenCart />
            <div style={{ display: 'flex', minHeight: 'calc(100vh - 72px)', background: '#f5f7fb' }}>
                <Menu
                    mode="inline"
                    style={{
                        width: 256,
                        boxShadow: '2px 0 12px rgba(15, 23, 42, 0.08)',
                        minHeight: 'calc(100vh - 72px)',
                        borderRight: 0,
                        paddingTop: 12,
                    }}
                    items={items}
                    selectedKeys={[keySelected]}
                    onClick={handleOnClick}
                />
                <div style={{ flex: 1, padding: '20px 24px' }}>
                    <div style={{ marginBottom: 12, fontSize: 22, fontWeight: 700, color: '#0f172a' }}>
                        {activeTitle} Management
                    </div>
                    {renderPage(keySelected)}
                </div>
            </div>
        </>
    )
}

export default AdminPage