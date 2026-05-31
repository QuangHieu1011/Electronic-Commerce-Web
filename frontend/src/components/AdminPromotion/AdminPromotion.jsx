import React, { useState, useCallback } from 'react';
import {
    Button, Form, Input, InputNumber, Select, Switch, Table, Tag,
    Modal, DatePicker, Space, Popconfirm, message
} from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, ThunderboltOutlined } from '@ant-design/icons';
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
            if (res.status === 'OK') { message.success('Tạo khuyến mãi thành công!'); closeModal(); queryClient.invalidateQueries(['promotions']); }
            else message.error(res.message);
        },
        onError: () => message.error('Có lỗi xảy ra'),
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, data }) => PromotionService.updatePromotion(id, data, getToken()),
        onSuccess: (res) => {
            if (res.status === 'OK') { message.success('Cập nhật thành công!'); closeModal(); queryClient.invalidateQueries(['promotions']); }
            else message.error(res.message);
        },
        onError: () => message.error('Có lỗi xảy ra'),
    });

    const toggleMutation = useMutation({
        mutationFn: (id) => PromotionService.togglePromotionActive(id, getToken()),
        onSuccess: (res) => {
            if (res.status === 'OK') { message.success(res.message); queryClient.invalidateQueries(['promotions']); }
            else message.error(res.message);
        },
        onError: () => message.error('Có lỗi xảy ra'),
    });

    const deleteMutation = useMutation({
        mutationFn: (id) => PromotionService.deletePromotion(id, getToken()),
        onSuccess: (res) => {
            if (res.status === 'OK') { message.success('Đã xóa khuyến mãi'); queryClient.invalidateQueries(['promotions']); }
            else message.error(res.message);
        },
        onError: () => message.error('Có lỗi xảy ra'),
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
            title: 'Tên khuyến mãi',
            dataIndex: 'name',
            key: 'name',
            width: 200,
        },
        {
            title: 'Giảm giá',
            dataIndex: 'discountPercent',
            key: 'discountPercent',
            render: (v) => <Tag color="orange" style={{ fontWeight: 700, fontSize: 14 }}>{v}%</Tag>,
            width: 100,
        },
        {
            title: 'Áp dụng cho',
            dataIndex: 'targetType',
            key: 'targetType',
            render: (v, record) => {
                if (v === 'all') return <Tag color="blue">Tất cả</Tag>;
                if (v === 'byType') return <Tag color="purple">{record.productTypes?.join(', ')}</Tag>;
                return <Tag color="cyan">{record.productIds?.length} sản phẩm</Tag>;
            },
            width: 180,
        },
        {
            title: 'Thời gian',
            key: 'time',
            render: (_, record) => (
                <span style={{ fontSize: 12, color: '#555' }}>
                    {dayjs(record.startDate).format('DD/MM/YYYY')} → {dayjs(record.endDate).format('DD/MM/YYYY')}
                </span>
            ),
            width: 180,
        },
        {
            title: 'Trạng thái',
            dataIndex: 'isActive',
            key: 'isActive',
            render: (active, record) => (
                <Switch
                    checked={active}
                    onChange={() => toggleMutation.mutate(record._id)}
                    checkedChildren="Bật"
                    unCheckedChildren="Tắt"
                    style={{ background: active ? '#52c41a' : undefined }}
                />
            ),
            width: 100,
        },
        {
            title: 'Hành động',
            key: 'action',
            render: (_, record) => (
                <Space>
                    <Button
                        icon={<EditOutlined />}
                        size="small"
                        onClick={() => openEdit(record)}
                    >
                        Sửa
                    </Button>
                    <Popconfirm
                        title="Xác nhận xóa?"
                        description="Discount trên sản phẩm sẽ được reset về 0."
                        onConfirm={() => deleteMutation.mutate(record._id)}
                        okText="Xóa"
                        cancelText="Hủy"
                        okButtonProps={{ danger: true }}
                    >
                        <Button icon={<DeleteOutlined />} size="small" danger>Xóa</Button>
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
                <ThunderboltOutlined style={{ marginRight: 8, color: '#fa8c16' }} />
                Quản lý Khuyến mãi
            </WrapperHeader>

            <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: '#555' }}>
                    Tổng: <b>{promotions.length}</b> chiến dịch &nbsp;|&nbsp;
                    Đang hoạt động: <b style={{ color: '#52c41a' }}>{promotions.filter(p => p.isActive).length}</b>
                </span>
                <Button type="primary" icon={<PlusOutlined />} onClick={openCreate} style={{ background: '#fa8c16', borderColor: '#fa8c16' }}>
                    Tạo khuyến mãi mới
                </Button>
            </div>

            <Table
                columns={columns}
                dataSource={promotions.map(p => ({ ...p, key: p._id }))}
                loading={isLoadingPromotions}
                pagination={{ pageSize: 10 }}
                scroll={{ x: 900 }}
                bordered
                style={{ background: '#fff', borderRadius: 8 }}
            />

            {/* ---- Modal tạo / chỉnh sửa ---- */}
            <Modal
                title={editingPromotion ? 'Chỉnh sửa khuyến mãi' : 'Tạo khuyến mãi mới'}
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
                    <Form.Item label="Tên chiến dịch" name="name" rules={[{ required: true, message: 'Nhập tên' }]}>
                        <Input placeholder="VD: Flash Sale cuối tuần" />
                    </Form.Item>

                    <Form.Item label="Mô tả" name="description">
                        <TextArea rows={2} placeholder="Mô tả ngắn..." />
                    </Form.Item>

                    <Form.Item
                        label="Phần trăm giảm giá (%)"
                        name="discountPercent"
                        rules={[{ required: true, message: 'Nhập % giảm giá' }]}
                    >
                        <InputNumber min={1} max={100} style={{ width: '100%' }} addonAfter="%" />
                    </Form.Item>

                    <Form.Item label="Thời gian áp dụng" name="dateRange" rules={[{ required: true, message: 'Chọn thời gian' }]}>
                        <RangePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
                    </Form.Item>

                    <Form.Item label="Áp dụng cho" name="targetType" rules={[{ required: true }]}>
                        <Select onChange={(v) => { setTargetType(v); form.setFieldValue('productTypes', []); form.setFieldValue('productIds', []); }}>
                            <Option value="all">Tất cả sản phẩm</Option>
                            <Option value="byType">Theo loại sản phẩm</Option>
                            <Option value="byIds">Chọn sản phẩm cụ thể</Option>
                        </Select>
                    </Form.Item>

                    {targetType === 'byType' && (
                        <Form.Item label="Chọn loại sản phẩm" name="productTypes" rules={[{ required: true, message: 'Chọn ít nhất một loại' }]}>
                            <Select mode="multiple" placeholder="Chọn loại..." options={typeOptions} />
                        </Form.Item>
                    )}

                    {targetType === 'byIds' && (
                        <Form.Item label="Chọn sản phẩm" name="productIds" rules={[{ required: true, message: 'Chọn ít nhất một sản phẩm' }]}>
                            <Select
                                mode="multiple"
                                placeholder="Tìm và chọn sản phẩm..."
                                options={productOptions}
                                filterOption={(input, opt) => opt.label.toLowerCase().includes(input.toLowerCase())}
                                showSearch
                            />
                        </Form.Item>
                    )}

                    <Form.Item label="Kích hoạt ngay" name="isActive" valuePropName="checked">
                        <Switch checkedChildren="Bật" unCheckedChildren="Tắt" />
                    </Form.Item>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                        <Button onClick={closeModal}>Hủy</Button>
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={createMutation.isPending || updateMutation.isPending}
                            style={{ background: '#fa8c16', borderColor: '#fa8c16' }}
                        >
                            {editingPromotion ? 'Cập nhật' : 'Tạo khuyến mãi'}
                        </Button>
                    </div>
                </Form>
            </Modal>
        </WrapperContainer>
    );
};

export default AdminPromotion;
