import { Menu } from 'antd'
import React, { useState } from 'react'
import { getItem } from '../../utils';
import { UserOutlined, AppstoreOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import HeaderComponent from '../../components/HeaderComponent/HeaderComponent';
import AdminUser from '../../components/AdminUser/AdminUser';
import AdminProduct from '../../components/AdminProduct/AdminProduct';

const AdminPage = () => {
    const items = [
        getItem('Người Dùng', 'user', <UserOutlined />),
        getItem('Sản Phẩm', 'product', <AppstoreOutlined />),
        getItem('Quản lý đơn hàng', 'orders', <ShoppingCartOutlined />),
    ];

    const [keySelected, setKeySelected] = useState('');

    const renderPage = (key) => {
        switch (key) {
            case 'user':
                return (<AdminUser />);
            case 'product':
                return (<AdminProduct />);
            case 'orders':
                // Navigate to order management page
                window.location.href = '/admin/orders';
                return null;
            default:
                return <></>

        }

    }


    const handleOnClick = ({ key }) => {
        setKeySelected(key);
    }
    console.log('keySelected', keySelected)

    return (
        <>
            <HeaderComponent isHiddenSearch isHiddenCart />
            <div style={{ display: 'flex' }} >
                <Menu
                    mode="inline"
                    style={{
                        width: 256,
                        boxShadow: '2px 0 6px #ccc',
                        height: '100vh',
                    }}
                    items={items}
                    onClick={handleOnClick}
                />
                <div style={{ flex: 1, padding: '15px' }}>
                    {renderPage(keySelected)}
                </div>
            </div>
        </>
    )
}

export default AdminPage