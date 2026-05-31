import React, { useState, useCallback } from 'react';
import {
    Button, Form, Input, InputNumber, Select, Switch, Table, Tag,
    Modal, DatePicker, Space, Popconfirm, message
} from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import dayjs from 'dayjs';
import * as PromotionService from '../../service/PromotionService';
import * as ProductService from '../../service/ProductService';
import { WrapperContainer, WrapperHeader } from './style';

const { RangePicker } = DatePicker;
const { Option } = Select;
const { TextArea } = Input;

const getToken = () => {
    const raw = localStorage.getItem('access_token');
    if (!raw) return '';
    try { return JSON.parse(raw); } catch { return raw; }
};

const AdminPromotion = () => {
    const queryClient = useQueryClient();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPromotion, setEditingPromotion] = useState(null);
    const [targetType, setTargetType] = useState('all');
    const [form] = Form.useForm();

    // ----- Fetch promotions -----
    const { data: promotionsData, isPending: isLoadingPromotions } = useQuery({
        queryKey: ['promotions'],
        queryFn: () => PromotionService.getAllPromotions(getToken()),
    });

    // ----- Fetch product types -----
    const { data: typesData } = useQuery({
        queryKey: ['type-product'],
        queryFn: () => ProductService.getAllTypeProduct(),
    });

    // ----- Fetch all products (for byIds selection) -----
    const { data: productsData } = useQuery({
        queryKey: ['products-all'],
        queryFn: () => ProductService.getAllProduct('', 10000),
    });

    const productOptions = (productsData?.data || []).map((p) => ({
        label: p.name,
        value: p._id,
    }));

    const typeOptions = (typesData?.data || []).map((t) => ({ label: t, value: t }));

    // ----- Mutations -----
    const createMutation = useMutation({
        mutationFn: (data) => PromotionService.createPromotion(data, getToken()),
        onSuccess: (res) => {
            if (res.status === 'OK') { message.success('Promotion created successfully.'); closeModal(); queryClient.invalidateQueries(['promotions']); }
            else message.error(res.message || 'Unable to create promotion.');
        },
        onError: () => message.error('Something went wrong.'),
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, data }) => PromotionService.updatePromotion(id, data, getToken()),
        onSuccess: (res) => {
            if (res.status === 'OK') { message.success('Promotion updated successfully.'); closeModal(); queryClient.invalidateQueries(['promotions']); }
            else message.error(res.message || 'Unable to update promotion.');
        },
        onError: () => message.error('Something went wrong.'),
    });

    const toggleMutation = useMutation({
        mutationFn: (id) => PromotionService.togglePromotionActive(id, getToken()),
        onSuccess: (res) => {
            if (res.status === 'OK') { message.success(res.message || 'Status updated.'); queryClient.invalidateQueries(['promotions']); }
            else message.error(res.message || 'Unable to update status.');
        },
        onError: () => message.error('Something went wrong.'),
    });

    const deleteMutation = useMutation({
        mutationFn: (id) => PromotionService.deletePromotion(id, getToken()),
        onSuccess: (res) => {
            if (res.status === 'OK') { message.success('Promotion deleted.'); queryClient.invalidateQueries(['promotions']); }
            else message.error(res.message || 'Unable to delete promotion.');
        },
        onError: () => message.error('Something went wrong.'),
    });

    // ----- Modal helpers -----
    const openCreate = () => {
        setEditingPromotion(null);
        setTargetType('all');
        form.resetFields();
        form.setFieldsValue({ targetType: 'all', isActive: false });
        setIsModalOpen(true);
    };

    const openEdit = (record) => {
        setEditingPromotion(record);
        setTargetType(record.targetType);
        form.setFieldsValue({
            name: record.name,
            description: record.description,
            discountPercent: record.discountPercent,
            targetType: record.targetType,
            productTypes: record.productTypes,
            productIds: record.productIds,
            dateRange: [dayjs(record.startDate), dayjs(record.endDate)],
            isActive: record.isActive,
        });
        setIsModalOpen(true);
    };

    const closeModal = useCallback(() => {
        setIsModalOpen(false);
        setEditingPromotion(null);
        form.resetFields();
    }, [form]);

    const onFinish = (values) => {
        const { dateRange, ...rest } = values;
        const payload = {
            ...rest,
            startDate: dateRange[0].toISOString(),
            endDate: dateRange[1].toISOString(),
            productTypes: rest.productTypes || [],
            productIds: rest.productIds || [],
        };
        if (editingPromotion) {
            updateMutation.mutate({ id: editingPromotion._id, data: payload });
        } else {
            createMutation.mutate(payload);
        }
    };

    // ----- Columns -----
    const columns = [
        {
            title: 'Promotion Name',
            dataIndex: 'name',
            key: 'name',
            width: 200,
        },
        {
            title: 'Discount',
            dataIndex: 'discountPercent',
            key: 'discountPercent',
            render: (v) => <Tag color="orange" style={{ fontWeight: 700, fontSize: 14 }}>{v}%</Tag>,
            width: 100,
        },
        {
            title: 'Applies To',
            dataIndex: 'targetType',
            key: 'targetType',
            render: (v, record) => {
                if (v === 'all') return <Tag color="blue">All products</Tag>;
                if (v === 'byType') return <Tag color="purple">{record.productTypes?.join(', ')}</Tag>;
                return <Tag color="cyan">{record.productIds?.length} products</Tag>;
            },
            width: 180,
        },
        {
            title: 'Duration',
            key: 'time',
            render: (_, record) => (
                <span style={{ fontSize: 12, color: '#555' }}>
                    {dayjs(record.startDate).format('DD/MM/YYYY')} → {dayjs(record.endDate).format('DD/MM/YYYY')}
                </span>
            ),
            width: 180,
        },
        {
            title: 'Status',
            dataIndex: 'isActive',
            key: 'isActive',
            render: (active, record) => (
                <Switch
                    checked={active}
                    onChange={() => toggleMutation.mutate(record._id)}
                    checkedChildren="On"
                    unCheckedChildren="Off"
                    style={{ background: active ? '#52c41a' : undefined }}
                />
            ),
            width: 100,
        },
        {
            title: 'Actions',
            key: 'action',
            render: (_, record) => (
                <Space>
                    <Button
                        icon={<EditOutlined />}
                        size="small"
                        onClick={() => openEdit(record)}
                    >
                        Edit
                    </Button>
                    <Popconfirm
                        title="Confirm delete?"
                        description="Product discounts will be reset to 0."
                        onConfirm={() => deleteMutation.mutate(record._id)}
                        okText="Delete"
                        cancelText="Cancel"
                        okButtonProps={{ danger: true }}
                    >
                        <Button icon={<DeleteOutlined />} size="small" danger>Delete</Button>
                    </Popconfirm>
                </Space>
            ),
            width: 160,
        },
    ];

    const promotions = promotionsData?.data || [];

    return (
        <WrapperContainer>
            <WrapperHeader>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    <div style={{ fontSize: 24, fontWeight: 600, color: '#111827' }}>
                        Promotion Management
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                            <div style={{ background: '#f8fafc', border: '1px solid #e5e7eb', borderRadius: 10, padding: '8px 12px', minWidth: 150 }}>
                                <div style={{ fontSize: 12, color: '#6b7280' }}>Total campaigns</div>
                                <div style={{ fontSize: 18, fontWeight: 700, color: '#111827' }}>{promotions.length}</div>
                            </div>
                            <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 10, padding: '8px 12px', minWidth: 150 }}>
                                <div style={{ fontSize: 12, color: '#166534' }}>Active</div>
                                <div style={{ fontSize: 18, fontWeight: 700, color: '#166534' }}>{promotions.filter(p => p.isActive).length}</div>
                            </div>
                        </div>
                        <Button
                            type="primary"
                            icon={<PlusOutlined />}
                            onClick={openCreate}
                            style={{ background: '#fa8c16', borderColor: '#fa8c16' }}
                        >
                            New Promotion
                        </Button>
                    </div>
                </div>
            </WrapperHeader>

            <Table
                columns={columns}
                dataSource={promotions.map(p => ({ ...p, key: p._id }))}
                loading={isLoadingPromotions}
                pagination={{ pageSize: 10 }}
                scroll={{ x: 900 }}
                bordered
                style={{ background: '#fff', borderRadius: 8 }}
            />

            {/* ---- Create / edit modal ---- */}
            <Modal
                title={editingPromotion ? 'Edit Promotion' : 'Create Promotion'}
                open={isModalOpen}
                onCancel={closeModal}
                footer={null}
                width={600}
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                    initialValues={{ targetType: 'all', isActive: false, discountPercent: 10 }}
                >
                    <Form.Item label="Campaign name" name="name" rules={[{ required: true, message: 'Enter a name' }]}>
                        <Input placeholder="e.g., Weekend Flash Sale" />
                    </Form.Item>

                    <Form.Item label="Description" name="description">
                        <TextArea rows={2} placeholder="Short description..." />
                    </Form.Item>

                    <Form.Item
                        label="Discount percentage (%)"
                        name="discountPercent"
                        rules={[{ required: true, message: 'Enter a discount' }]}
                    >
                        <InputNumber min={1} max={100} style={{ width: '100%' }} addonAfter="%" />
                    </Form.Item>

                    <Form.Item label="Active period" name="dateRange" rules={[{ required: true, message: 'Select a date range' }]}> 
                        <RangePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
                    </Form.Item>

                    <Form.Item label="Applies to" name="targetType" rules={[{ required: true }]}>
                        <Select onChange={(v) => { setTargetType(v); form.setFieldValue('productTypes', []); form.setFieldValue('productIds', []); }}>
                            <Option value="all">All products</Option>
                            <Option value="byType">By product type</Option>
                            <Option value="byIds">Specific products</Option>
                        </Select>
                    </Form.Item>

                    {targetType === 'byType' && (
                        <Form.Item label="Select product types" name="productTypes" rules={[{ required: true, message: 'Select at least one type' }]}>
                            <Select mode="multiple" placeholder="Select types..." options={typeOptions} />
                        </Form.Item>
                    )}

                    {targetType === 'byIds' && (
                        <Form.Item label="Select products" name="productIds" rules={[{ required: true, message: 'Select at least one product' }]}>
                            <Select
                                mode="multiple"
                                placeholder="Search and select products..."
                                options={productOptions}
                                filterOption={(input, opt) => opt.label.toLowerCase().includes(input.toLowerCase())}
                                showSearch
                            />
                        </Form.Item>
                    )}

                    <Form.Item label="Activate now" name="isActive" valuePropName="checked">
                        <Switch checkedChildren="On" unCheckedChildren="Off" />
                    </Form.Item>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                        <Button onClick={closeModal}>Cancel</Button>
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={createMutation.isPending || updateMutation.isPending}
                            style={{ background: '#fa8c16', borderColor: '#fa8c16' }}
                        >
                            {editingPromotion ? 'Update Promotion' : 'Create Promotion'}
                        </Button>
                    </div>
                </Form>
            </Modal>
        </WrapperContainer>
    );
};

export default AdminPromotion;
