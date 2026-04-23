import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { Table, Button, InputNumber, message } from 'antd';
import { EditOutlined, SaveOutlined, CloseOutlined } from '@ant-design/icons';
import { WrapperContainer, WrapperHeader, WrapperTable, WrapperAction } from './style';
import socketService from '../../service/SocketService';

const AdminInventory = () => {
    const [inventory, setInventory] = useState([]);
    const [loading, setLoading] = useState(false);
    const [editId, setEditId] = useState(null);
    const [editValue, setEditValue] = useState(0);
    const user = useSelector(state => state.user);

    const fetchInventory = async () => {
        setLoading(true);
        try {
            const res = await axios.get('/api/product/inventory', {
                headers: {
                    Authorization: `Bearer ${user.access_token}`
                }
            });
            setInventory(res.data.data);
        } catch (e) {
            message.error('Failed to load inventory');
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchInventory();
        // Lắng nghe sự kiện inventoryUpdate từ socket
        const socket = socketService.connect();
        const handleInventoryUpdate = (products) => {
            setInventory(products);
        };
        socket.on('inventoryUpdate', handleInventoryUpdate);
        return () => {
            socket.off('inventoryUpdate', handleInventoryUpdate);
        };
    }, []);

    const handleEdit = (id, current) => {
        setEditId(id);
        setEditValue(current);
    };

    const handleSave = async (id) => {
        setLoading(true);
        try {
            await axios.put('/api/product/inventory', { productId: id, quantity: editValue }, {
                headers: {
                    Authorization: `Bearer ${user.access_token}`
                }
            });
            message.success('Inventory updated successfully');
            fetchInventory();
        } catch (e) {
            message.error('Failed to update inventory');
        }
        setEditId(null);
        setLoading(false);
    };

    const columns = [
        {
            title: 'Product name',
            dataIndex: 'name',
            key: 'name',
            width: '30%',
        },
        {
            title: 'Category',
            dataIndex: 'type',
            key: 'type',
            width: '20%',
        },
        {
            title: 'In-stock quantity',
            dataIndex: 'countInStock',
            key: 'countInStock',
            width: '20%',
            render: (text, record) => (
                editId === record._id ? (
                    <InputNumber min={-9999} max={9999} value={editValue} onChange={setEditValue} />
                ) : (
                    <span>{text}</span>
                )
            )
        },
        {
            title: 'Actions',
            key: 'action',
            width: '20%',
            render: (_, record) => (
                <WrapperAction>
                    {editId === record._id ? (
                        <>
                            <Button type="primary" icon={<SaveOutlined />} onClick={() => handleSave(record._id)} size="small">Save</Button>
                            <Button icon={<CloseOutlined />} onClick={() => setEditId(null)} size="small">Cancel</Button>
                        </>
                    ) : (
                        <Button icon={<EditOutlined />} onClick={() => handleEdit(record._id, 0)} size="small">Adjust stock</Button>
                    )}
                </WrapperAction>
            )
        }
    ];

    return (
        <WrapperContainer>
            <WrapperHeader>Inventory Management</WrapperHeader>
            <WrapperTable>
                <Table
                    columns={columns}
                    dataSource={inventory.map(item => ({ ...item, key: item._id }))}
                    loading={loading}
                    pagination={{ pageSize: 10 }}
                />
            </WrapperTable>
        </WrapperContainer>
    );
};

export default AdminInventory;
