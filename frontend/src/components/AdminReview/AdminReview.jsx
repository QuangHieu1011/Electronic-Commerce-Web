import React, { useState, useRef } from 'react';
import {
    Table,
    Rate,
    Tag,
    Button,
    Input,
    Space,
    Select,
    Tabs,
    Modal,
    Image,
    Row,
    Col,
    Tooltip,
    Switch,
    message,
    Popconfirm
} from 'antd';
import {
    StarFilled,
    DeleteOutlined,
    SearchOutlined,
    EyeOutlined,
    CommentOutlined,
    TrophyOutlined,
    ExclamationCircleOutlined
} from '@ant-design/icons';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { useMutationHooks } from '../../hooks/useMutationHook';
import * as ReviewService from '../../service/ReviewService';
import { formatPrice } from '../../utils';
import {
    WrapperContainer,
    WrapperHeader,
    StatCard,
    TabCard,
    ProductAvatar,
    UserAvatar,
    CommentText,
    RatingBar
} from './style';

const { Search } = Input;
const { Option } = Select;

const AdminReview = () => {
    const user = useSelector((state) => state.user);
    const queryClient = useQueryClient();

    // ---------- Tab: All Reviews ----------
    const [reviewPage, setReviewPage] = useState(1);
    const [reviewSearch, setReviewSearch] = useState('');
    const [reviewRating, setReviewRating] = useState('');
    const [reviewFlaggedOnly, setReviewFlaggedOnly] = useState(false);

    // ---------- Tab: Product Stats ----------
    const [statPage, setStatPage] = useState(1);
    const [statSort, setStatSort] = useState('rating');

    // ---------- Detail modal ----------
    const [detailVisible, setDetailVisible] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);

    // ---- Queries ----
    const { data: reviewsData, isLoading: reviewsLoading } = useQuery({
        queryKey: ['admin-reviews', reviewPage, reviewSearch, reviewRating, reviewFlaggedOnly],
        queryFn: () =>
            ReviewService.getAdminReviews(user.access_token, {
                page: reviewPage,
                limit: 10,
                search: reviewSearch,
                rating: reviewRating,
                flagged: reviewFlaggedOnly ? true : undefined
            }),
        keepPreviousData: true
    });

    const { data: statsData, isLoading: statsLoading } = useQuery({
        queryKey: ['admin-product-stats', statPage, statSort],
        queryFn: () =>
            ReviewService.getProductReviewStats(user.access_token, {
                page: statPage,
                limit: 10,
                sort: statSort
            }),
        keepPreviousData: true
    });

    // ---- Delete mutation ----
    const deleteMutation = useMutationHooks(({ reviewId }) =>
        ReviewService.deleteReview(user.access_token, reviewId)
    );

    const handleDelete = (reviewId) => {
        deleteMutation.mutate(
            { reviewId },
            {
                onSuccess: (res) => {
                    if (res?.status === 'OK') {
                        message.success('Review deleted');
                        queryClient.invalidateQueries(['admin-reviews']);
                        queryClient.invalidateQueries(['admin-product-stats']);
                    } else {
                        message.error(res?.message || 'Delete failed');
                    }
                },
                onError: () => message.error('Delete failed')
            }
        );
    };

    // ---- Summary stats ----
    const totalReviews = reviewsData?.pagination?.total || 0;
    const allStats = statsData?.data || [];
    const avgRatingOverall =
        allStats.length > 0
            ? (allStats.reduce((acc, s) => acc + s.averageRating, 0) / allStats.length).toFixed(1)
            : 0;
    const topProduct = allStats[0] || null;

    // ---- Columns: All Reviews ----
    const reviewColumns = [
        {
            title: 'Product',
            key: 'product',
            width: 220,
            render: (_, record) => (
                <ProductAvatar>
                    <img
                        src={record.product?.image || 'https://via.placeholder.com/44'}
                        alt={record.product?.name}
                    />
                    <span className="product-name" title={record.product?.name}>
                        {record.product?.name}
                    </span>
                </ProductAvatar>
            )
        },
        {
            title: 'Reviewer',
            key: 'user',
            width: 160,
            render: (_, record) => (
                <UserAvatar>
                    {record.user?.avatar ? (
                        <img src={record.user.avatar} alt={record.user?.name} />
                    ) : (
                        <div
                            style={{
                                width: 32,
                                height: 32,
                                borderRadius: '50%',
                                background: '#1a94ff',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: '#fff',
                                fontWeight: 600,
                                fontSize: 13
                            }}
                        >
                            {(record.user?.name || 'U')[0].toUpperCase()}
                        </div>
                    )}
                    <span className="user-name">{record.user?.name || 'Ẩn danh'}</span>
                </UserAvatar>
            )
        },
        {
            title: 'Rating',
            dataIndex: 'rating',
            key: 'rating',
            width: 140,
            render: (rating) => <Rate disabled value={rating} style={{ fontSize: 14 }} />
        },
        {
            title: 'Moderation',
            key: 'moderation',
            width: 130,
            render: (_, record) => {
                const moderation = record?.moderation;
                if (!moderation) {
                    return <Tag color="default">Not scanned</Tag>;
                }

                if (moderation.isFlagged) {
                    const score = Number.isFinite(moderation.score) ? moderation.score.toFixed(2) : '—';
                    const reason = moderation.reason ? ` • ${moderation.reason}` : '';
                    return (
                        <Tooltip title={`Điểm: ${score}${reason}`}>
                            <Tag color="red" icon={<ExclamationCircleOutlined />}>
                                Toxic
                            </Tag>
                        </Tooltip>
                    );
                }

                return <Tag color="green">Clean</Tag>;
            }
        },
        {
            title: 'Comment',
            dataIndex: 'comment',
            key: 'comment',
            render: (comment) => (
                <Tooltip title={comment}>
                    <CommentText>{comment}</CommentText>
                </Tooltip>
            )
        },
        {
            title: 'Images',
            dataIndex: 'images',
            key: 'images',
            width: 100,
            render: (images) =>
                images && images.length > 0 ? (
                    <Image.PreviewGroup>
                        <Image
                            src={images[0]}
                            width={40}
                            height={40}
                            style={{ objectFit: 'cover', borderRadius: 4 }}
                        />
                        {images.length > 1 && (
                            <span style={{ fontSize: 11, color: '#8c8c8c' }}>+{images.length - 1}</span>
                        )}
                    </Image.PreviewGroup>
                ) : (
                        <span style={{ color: '#d9d9d9', fontSize: 12 }}>None</span>
                )
        },
        {
                    title: 'Created',
            dataIndex: 'createdAt',
            key: 'createdAt',
            width: 120,
            render: (date) =>
                date
                    ? new Date(date).toLocaleDateString('vi-VN', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric'
                    })
                    : ''
        },
        {
            title: 'Actions',
            key: 'action',
            width: 80,
            render: (_, record) => (
                <Popconfirm
                    title="Delete this review?"
                    description="This action cannot be undone."
                    onConfirm={() => handleDelete(record._id)}
                    okText="Delete"
                    cancelText="Cancel"
                    okButtonProps={{ danger: true }}
                >
                    <Button type="text" danger icon={<DeleteOutlined />} size="small" />
                </Popconfirm>
            )
        }
    ];

    // ---- Columns: Product Stats ----
    const statColumns = [
        {
            title: '#',
            key: 'rank',
            width: 50,
            render: (_, __, index) => {
                const rank = (statPage - 1) * 10 + index + 1;
                if (rank === 1) return <TrophyOutlined style={{ color: '#faad14', fontSize: 18 }} />;
                if (rank === 2) return <TrophyOutlined style={{ color: '#bfbfbf', fontSize: 18 }} />;
                if (rank === 3) return <TrophyOutlined style={{ color: '#d46b08', fontSize: 18 }} />;
                return <span style={{ color: '#8c8c8c', fontWeight: 600 }}>{rank}</span>;
            }
        },
        {
            title: 'Product',
            key: 'product',
            render: (_, record) => (
                <ProductAvatar>
                    <img
                        src={record.productInfo?.image || 'https://via.placeholder.com/44'}
                        alt={record.productInfo?.name}
                    />
                    <div>
                        <div
                            className="product-name"
                            style={{ maxWidth: 220 }}
                            title={record.productInfo?.name}
                        >
                            {record.productInfo?.name}
                        </div>
                        <Tag color="blue" style={{ marginTop: 2, fontSize: 11 }}>
                            {record.productInfo?.type}
                        </Tag>
                    </div>
                </ProductAvatar>
            )
        },
        {
            title: 'Avg rating',
            dataIndex: 'averageRating',
            key: 'averageRating',
            width: 160,
            render: (rating) => (
                <Space>
                    <Rate
                        disabled
                        allowHalf
                        value={rating}
                        style={{ fontSize: 13 }}
                    />
                    <span style={{ fontWeight: 600, color: '#faad14' }}>{rating}</span>
                </Space>
            )
        },
        {
            title: 'Total reviews',
            dataIndex: 'totalReviews',
            key: 'totalReviews',
            width: 120,
            render: (count) => (
                <Tag color="green" icon={<CommentOutlined />}>
                    {count} reviews
                </Tag>
            )
        },
        {
            title: 'Rating breakdown',
            key: 'breakdown',
            width: 200,
            render: (_, record) => {
                const total = record.totalReviews || 1;
                return (
                    <div style={{ minWidth: 160 }}>
                        {[5, 4, 3, 2, 1].map((star) => {
                            const count = record[`star${star}`] || 0;
                            const pct = Math.round((count / total) * 100);
                            return (
                                <RatingBar key={star}>
                                    <span className="bar-label">{star}★</span>
                                    <div className="bar-track">
                                        <div className="bar-fill" style={{ width: `${pct}%` }} />
                                    </div>
                                    <span className="bar-count">{count}</span>
                                </RatingBar>
                            );
                        })}
                    </div>
                );
            }
        },
        {
            title: 'Price',
            key: 'price',
            width: 110,
            render: (_, record) => (
                <span style={{ fontWeight: 500 }}>{formatPrice(record.productInfo?.price)}</span>
            )
        },
        {
            title: 'Review details',
            key: 'view',
            width: 110,
            render: (_, record) => (
                <Button
                    type="link"
                    icon={<EyeOutlined />}
                    size="small"
                    onClick={() => {
                        setSelectedProduct(record);
                        setDetailVisible(true);
                    }}
                >
                    Details
                </Button>
            )
        }
    ];

    const tabItems = [
        {
            key: 'stats',
            label: (
                <span>
                    <TrophyOutlined /> Top rated products
                </span>
            ),
            children: (
                <div>
                    {/* Sort control */}
                    <div style={{ padding: '16px 16px 0', display: 'flex', gap: 12, alignItems: 'center' }}>
                        <span style={{ fontSize: 13, color: '#595959' }}>Sort by:</span>
                        <Select
                            value={statSort}
                            onChange={(v) => { setStatSort(v); setStatPage(1); }}
                            style={{ width: 180 }}
                        >
                            <Option value="rating">Average rating</Option>
                            <Option value="totalReviews">Total reviews</Option>
                        </Select>
                    </div>
                    <Table
                        columns={statColumns}
                        dataSource={statsData?.data || []}
                        loading={statsLoading}
                        rowKey="_id"
                        pagination={{
                            current: statPage,
                            pageSize: 10,
                            total: statsData?.pagination?.total || 0,
                            onChange: (page) => setStatPage(page),
                            showTotal: (total) => `${total} products with reviews`
                        }}
                        style={{ padding: 16 }}
                        scroll={{ x: 900 }}
                    />
                </div>
            )
        },
        {
            key: 'all',
            label: (
                <span>
                    <CommentOutlined /> All reviews
                </span>
            ),
            children: (
                <div>
                    {/* Filters */}
                    <div
                        style={{
                            padding: '16px 16px 0',
                            display: 'flex',
                            gap: 12,
                            flexWrap: 'wrap',
                            alignItems: 'center'
                        }}
                    >
                        <Search
                            placeholder="Search by product name..."
                            allowClear
                            style={{ width: 260 }}
                            onSearch={(v) => { setReviewSearch(v); setReviewPage(1); }}
                            enterButton={<SearchOutlined />}
                        />
                        <Select
                            placeholder="Filter by rating"
                            allowClear
                            style={{ width: 160 }}
                            value={reviewRating || undefined}
                            onChange={(v) => { setReviewRating(v || ''); setReviewPage(1); }}
                        >
                            {[5, 4, 3, 2, 1].map((s) => (
                                <Option key={s} value={String(s)}>
                                    <Rate disabled value={s} style={{ fontSize: 12 }} /> {s} stars
                                </Option>
                            ))}
                        </Select>
                        <Space size={8} style={{ paddingLeft: 6 }}>
                            <Switch
                                checked={reviewFlaggedOnly}
                                onChange={(checked) => {
                                    setReviewFlaggedOnly(checked);
                                    setReviewPage(1);
                                }}
                            />
                            <span style={{ fontSize: 13, color: '#595959' }}>Only toxic reviews</span>
                        </Space>
                    </div>
                    <Table
                        columns={reviewColumns}
                        dataSource={reviewsData?.data || []}
                        loading={reviewsLoading}
                        rowKey="_id"
                        rowClassName={(record) =>
                            record?.moderation?.isFlagged ? 'review-flagged-row' : ''
                        }
                        pagination={{
                            current: reviewPage,
                            pageSize: 10,
                            total: reviewsData?.pagination?.total || 0,
                            onChange: (page) => setReviewPage(page),
                            showTotal: (total) => `${total} reviews`
                        }}
                        style={{ padding: 16 }}
                        scroll={{ x: 900 }}
                    />
                </div>
            )
        }
    ];

    return (
        <WrapperContainer>
            <WrapperHeader>Product Review Management</WrapperHeader>

            {/* Summary cards */}
            <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
                <Col xs={24} sm={8}>
                    <StatCard>
                        <div
                            className="stat-icon"
                            style={{ background: '#fffbe6' }}
                        >
                            <StarFilled style={{ color: '#faad14' }} />
                        </div>
                        <div className="stat-content">
                            <div className="stat-value">{totalReviews}</div>
                            <div className="stat-label">Total reviews</div>
                        </div>
                    </StatCard>
                </Col>
                <Col xs={24} sm={8}>
                    <StatCard>
                        <div
                            className="stat-icon"
                            style={{ background: '#e6f7ff' }}
                        >
                            <StarFilled style={{ color: '#1a94ff' }} />
                        </div>
                        <div className="stat-content">
                            <div className="stat-value">{avgRatingOverall}</div>
                            <div className="stat-label">Average rating (all products)</div>
                        </div>
                    </StatCard>
                </Col>
                <Col xs={24} sm={8}>
                    <StatCard>
                        <div
                            className="stat-icon"
                            style={{ background: '#f6ffed' }}
                        >
                            <TrophyOutlined style={{ color: '#52c41a' }} />
                        </div>
                        <div className="stat-content">
                            <div
                                className="stat-value"
                                style={{ fontSize: 14, fontWeight: 600 }}
                                title={topProduct?.productInfo?.name}
                            >
                                {topProduct
                                    ? topProduct.productInfo?.name?.slice(0, 28) +
                                    (topProduct.productInfo?.name?.length > 28 ? '...' : '')
                                    : '—'}
                            </div>
                            <div className="stat-label">
                                Top rated product{' '}
                                {topProduct ? `(${topProduct.averageRating}★)` : ''}
                            </div>
                        </div>
                    </StatCard>
                </Col>
            </Row>

            {/* Main tabs */}
            <TabCard>
                <Tabs defaultActiveKey="stats" items={tabItems} style={{ padding: '0 16px' }} />
            </TabCard>

            {/* Product detail modal */}
            <Modal
                open={detailVisible}
                onCancel={() => setDetailVisible(false)}
                footer={null}
                width={520}
                title={
                    <Space>
                        <img
                            src={selectedProduct?.productInfo?.image || 'https://via.placeholder.com/32'}
                            alt=""
                            style={{ width: 32, height: 32, objectFit: 'cover', borderRadius: 4 }}
                        />
                        <span>{selectedProduct?.productInfo?.name}</span>
                    </Space>
                }
            >
                {selectedProduct && (
                    <div>
                        <div style={{ textAlign: 'center', marginBottom: 20 }}>
                            <div style={{ fontSize: 48, fontWeight: 700, color: '#faad14' }}>
                                {selectedProduct.averageRating}
                            </div>
                            <Rate
                                disabled
                                allowHalf
                                value={selectedProduct.averageRating}
                                style={{ fontSize: 20 }}
                            />
                            <div style={{ color: '#8c8c8c', marginTop: 4 }}>
                                {selectedProduct.totalReviews} reviews
                            </div>
                        </div>
                        <div>
                            {[5, 4, 3, 2, 1].map((star) => {
                                const count = selectedProduct[`star${star}`] || 0;
                                const pct =
                                    selectedProduct.totalReviews > 0
                                        ? Math.round((count / selectedProduct.totalReviews) * 100)
                                        : 0;
                                return (
                                    <RatingBar key={star}>
                                        <span className="bar-label">{star}★</span>
                                        <div className="bar-track">
                                            <div className="bar-fill" style={{ width: `${pct}%` }} />
                                        </div>
                                        <span className="bar-count">{count}</span>
                                    </RatingBar>
                                );
                            })}
                        </div>
                        <div style={{ marginTop: 16, borderTop: '1px solid #f0f0f0', paddingTop: 12 }}>
                            <Row gutter={16}>
                                <Col span={12}>
                                    <div style={{ fontSize: 12, color: '#8c8c8c' }}>Category</div>
                                    <Tag color="blue" style={{ marginTop: 4 }}>
                                        {selectedProduct.productInfo?.type || '—'}
                                    </Tag>
                                </Col>
                                <Col span={12}>
                                    <div style={{ fontSize: 12, color: '#8c8c8c' }}>Price</div>
                                    <div style={{ fontWeight: 600, marginTop: 4 }}>
                                        {formatPrice(selectedProduct.productInfo?.price)}
                                    </div>
                                </Col>
                            </Row>
                        </div>
                    </div>
                )}
            </Modal>
        </WrapperContainer>
    );
};

export default AdminReview;
