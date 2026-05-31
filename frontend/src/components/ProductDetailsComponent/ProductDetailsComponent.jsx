import { Avatar, Button, Col, Empty, Image, Input, Pagination, Rate, Row } from 'antd'
import React, { useState } from 'react'

import { MinusOutlined, PlusOutlined, StarFilled } from '@ant-design/icons'
import {
  WrapperStyleColImage,
  WrapperStyleImageSmall,
  WrapperContainerImage,
  WrapperListImage,
  WrapperStyleNameProduct,
  WrapperStyleTextSell,
  WrapperPriceProduct,
  WrapperPriceTextProduct,
  WrapperAddressProduct,
  WrapperQualityProduct,
  WrapperInputNumber
} from './style'
import * as ProductService from '../../service/ProductService'
import { useQuery } from '@tanstack/react-query'
import Loading from '../LoadingComponent/Loading'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { addToCart } from '../../redux/slides/cartSlice'
import { message } from 'antd'
import CardComponent from '../CardComponent/CardComponent'
import { formatPrice } from '../../utils'
import { useMutationHooks } from '../../hooks/useMutationHook'
import { useLanguage } from '../../context/LanguageContext'

const readFileAsDataUrl = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

const { TextArea } = Input;

const ProductDetailsComponent = ({ idProduct }) => {
  const [numProduct, setNumProduct] = useState(1);
  const [selectedImage, setSelectedImage] = useState('');
  const [reviewPage, setReviewPage] = useState(1);
  const [reviewFilters, setReviewFilters] = useState({
    hasImages: false,
    verifiedPurchase: false,
    ratings: []
  });
  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    comment: '',
    images: []
  });

  const user = useSelector((state) => state?.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t, language } = useLanguage();

  const onChange = (value) => {
    const parsedValue = Number(value);
    setNumProduct(parsedValue >= 1 ? parsedValue : 1);
  }

  const fetchGetDetailsProduct = async (context) => {
    const id = context?.queryKey && context?.queryKey[1]
    if (id) {
      const res = await ProductService.getDetailsProduct(id)
      return res.data
    }
  }

  const handleChangeCount = (type) => {
    if (type === 'increase') {
      setNumProduct((prev) => prev + 1);
    } else if (type === 'decrease') {
      setNumProduct((prev) => (prev - 1) >= 1 ? prev - 1 : 1);
    }
  }

  const handleAddToCart = () => {
    if (!productDetails) {
      message.error(t('productDetail.messages.cannotAddCart'));
      return;
    }

    if (numProduct < 1) {
      message.warning(t('productDetail.messages.selectQuantity'));
      return;
    }

    dispatch(addToCart({
      product: productDetails,
      quantity: numProduct
    }));

    message.success(t('productDetail.messages.addToCartSuccess', { count: numProduct }));
  };

  const handleBuyNow = () => {
    if (!productDetails) {
      message.error(t('productDetail.messages.cannotAddCart'));
      return;
    }

    if (numProduct < 1) {
      message.warning(t('productDetail.messages.selectQuantity'));
      return;
    }

    dispatch(addToCart({
      product: productDetails,
      quantity: numProduct
    }));

    message.success(t('productDetail.messages.buyNowRedirect'));

    // Chuyển đến giỏ hàng để thanh toán ngay.
    navigate('/order');
  };


  const { isPending, data: productDetails } = useQuery({
    queryKey: ['product-details', idProduct],
    queryFn: fetchGetDetailsProduct,
    enabled: !!idProduct,
  })

  // Fetch similar products based on type
  const fetchSimilarProducts = async () => {
    if (productDetails?.type) {
      const res = await ProductService.getAllProduct('', 8, 0, null, ['type', productDetails.type])
      // Filter out current product
      return res.data.filter(item => item._id !== idProduct)
    }
    return []
  }

  const { data: similarProducts = [] } = useQuery({
    queryKey: ['similar-products', productDetails?.type, idProduct],
    queryFn: fetchSimilarProducts,
    enabled: !!productDetails?.type,
  })

  const reviewFilterKey = React.useMemo(() => JSON.stringify(reviewFilters), [reviewFilters]);

  const fetchProductReviews = async (context) => {
    const [, productId, page, filterKey] = context.queryKey;
    if (!productId) return null;
    const parsedFilters = filterKey ? JSON.parse(filterKey) : {};
    const res = await ProductService.getProductReviews(productId, page, 6, parsedFilters);
    return res.data;
  };

  const {
    isPending: isReviewLoading,
    data: reviewData,
    refetch: refetchReviews
  } = useQuery({
    queryKey: ['product-reviews', idProduct, reviewPage, reviewFilterKey],
    queryFn: fetchProductReviews,
    enabled: !!idProduct,
  });

  React.useEffect(() => {
    setReviewPage(1);
  }, [reviewFilterKey]);

  const mutationReview = useMutationHooks((data) =>
    ProductService.createProductReview(idProduct, user?.access_token, data)
  );

  // Reset selected image when product changes.
  React.useEffect(() => {
    if (productDetails?.image) {
      setSelectedImage(productDetails.image);
    }
  }, [productDetails]);

  React.useEffect(() => {
    if (mutationReview.isSuccess && mutationReview.data?.status === 'OK') {
      message.success(t('productReview.messages.submitSuccess'));
      setReviewForm({
        rating: 5,
        comment: '',
        images: []
      });
      refetchReviews();
    }
    if (mutationReview.isError) {
      message.error(t('productReview.messages.submitErrorRetry'));
    }
    if (mutationReview.data && mutationReview.data.status === 'ERR') {
      message.error(mutationReview.data.message || t('productReview.messages.submitError'));
    }
  }, [mutationReview.isSuccess, mutationReview.isError, mutationReview.data, refetchReviews, t]);

  // Kết hợp ảnh chính và ảnh phụ
  const allImages = React.useMemo(() => {
    if (!productDetails) return [];
    const images = [productDetails.image];
    if (productDetails.images && productDetails.images.length > 0) {
      images.push(...productDetails.images.slice(0, 5));
    }
    return images.slice(0, 6);
  }, [productDetails]);

  const reviewSummary = reviewData?.summary || {
    totalReviews: 0,
    averageRating: 0,
    ratingBreakdown: [
      { star: 5, count: 0, percentage: 0 },
      { star: 4, count: 0, percentage: 0 },
      { star: 3, count: 0, percentage: 0 },
      { star: 2, count: 0, percentage: 0 },
      { star: 1, count: 0, percentage: 0 }
    ]
  };

  const reviewList = reviewData?.reviews || [];
  const reviewPagination = reviewData?.pagination || { pageCurrent: 1, totalPages: 1, totalReviews: 0 };

  const toggleRatingFilter = (star) => {
    setReviewFilters((prev) => {
      const existed = prev.ratings.includes(star);
      const nextRatings = existed
        ? prev.ratings.filter((item) => item !== star)
        : [...prev.ratings, star].sort((a, b) => b - a);

      return {
        ...prev,
        ratings: nextRatings
      };
    });
  };

  const toggleBooleanFilter = (key) => {
    setReviewFilters((prev) => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const resetReviewFilters = () => {
    setReviewFilters({
      hasImages: false,
      verifiedPurchase: false,
      ratings: []
    });
  };

  const isAllReviewFiltersOff =
    !reviewFilters.hasImages && !reviewFilters.verifiedPurchase && reviewFilters.ratings.length === 0;

  const getFilterButtonStyle = (active) => ({
    borderRadius: '999px',
    border: active ? '1px solid #1d67ff' : '1px solid #d9d9d9',
    background: active ? '#e8f1ff' : '#f5f5f5',
    color: active ? '#1d67ff' : '#262626',
    height: '36px',
    padding: '0 16px',
    fontWeight: 500,
    boxShadow: 'none'
  });

  const handleReviewFileChange = async (event) => {
    const selectedFiles = Array.from(event.target.files || []);
    if (!selectedFiles.length) return;

    const maxImages = 5;
    const maxFileSize = 1.5 * 1024 * 1024; // 1.5MB each image
    const remainingSlots = maxImages - reviewForm.images.length;

    if (remainingSlots <= 0) {
      message.warning(t('productReview.messages.maxImages'));
      event.target.value = '';
      return;
    }

    const filesToRead = selectedFiles.slice(0, remainingSlots);
    const oversized = filesToRead.find((file) => file.size > maxFileSize);
    if (oversized) {
      message.warning(t('productReview.messages.maxImageSize'));
      event.target.value = '';
      return;
    }

    try {
      const base64Images = await Promise.all(filesToRead.map(readFileAsDataUrl));
      setReviewForm((prev) => ({
        ...prev,
        images: [...prev.images, ...base64Images]
      }));
    } catch (error) {
      message.error(t('productReview.messages.readImageError'));
    } finally {
      event.target.value = '';
    }
  };

  const handleRemoveReviewImage = (index) => {
    setReviewForm((prev) => ({
      ...prev,
      images: prev.images.filter((_, idx) => idx !== index)
    }));
  };

  const handleSubmitReview = () => {
    if (!user?.access_token) {
      message.warning(t('productReview.messages.loginRequired'));
      return;
    }

    if (!reviewForm.comment.trim()) {
      message.warning(t('productReview.messages.commentRequired'));
      return;
    }

    mutationReview.mutate({
      rating: Number(reviewForm.rating),
      comment: reviewForm.comment.trim(),
      images: reviewForm.images
    });
  };

  return (
    <Loading isLoading={isPending}>
      <Row style={{ padding: '24px', background: '#fff', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.06)' }}>

        <Col span={10} style={{ borderRight: '1px solid #e5e5e5', paddingRight: '10px' }}>
          <WrapperContainerImage>
            <Image
              src={selectedImage || productDetails?.image}
              alt='image product'
              preview={false}
            />
          </WrapperContainerImage>

          <WrapperListImage>
            {allImages.map((img, index) => (
              <WrapperStyleColImage
                key={index}
                onClick={() => setSelectedImage(img)}
                style={{
                  cursor: 'pointer',
                  border: selectedImage === img ? '3px solid #1890ff' : '3px solid transparent',
                  boxShadow: selectedImage === img ? '0 4px 16px rgba(24, 144, 255, 0.3)' : 'none',
                  transform: selectedImage === img ? 'scale(1.02)' : 'scale(1)',
                  background: selectedImage === img ? '#fff' : '#f8f8f8'
                }}
              >
                <WrapperStyleImageSmall
                  src={img}
                  alt={`${productDetails?.name} ${index + 1}`}
                  preview={false}
                  style={{
                    opacity: selectedImage === img ? 1 : 0.75,
                    transition: 'opacity 0.3s ease'
                  }}
                />
              </WrapperStyleColImage>
            ))}
          </WrapperListImage>
        </Col>


        <Col span={14} style={{ paddingLeft: '10px' }}>
          <WrapperStyleNameProduct> {productDetails?.name} </WrapperStyleNameProduct>
          <div>
            <Rate allowHalf value={productDetails?.rating} disabled style={{ fontSize: '16px', color: 'rgb(253,216,54)' }} />
            <WrapperStyleTextSell>| Đã bán 1000+</WrapperStyleTextSell>
          </div>
          <WrapperPriceProduct>
            <WrapperPriceTextProduct>{formatPrice(productDetails?.price)}</WrapperPriceTextProduct>
          </WrapperPriceProduct>
          <WrapperAddressProduct>
            <span>{t('productDetail.deliveryTo')} </span>
            <span className='address'>{user?.address}</span> -
            <span className='change-address'>{t('productDetail.changeAddress')}</span>
          </WrapperAddressProduct>
          <div style={{ margin: '10px 0 10px', borderTop: '1px solid #e5e5e5', borderBottom: '1px solid #e5e5e5', padding: '10px 0' }}>
            <div style={{ marginBottom: '10px', fontWeight: '600', color: '#262626' }}>{t('productDetail.quantityLabel')}</div>
            <WrapperQualityProduct>
              <button
                className='quantity-btn'
                onClick={() => handleChangeCount('decrease')}
                disabled={numProduct <= 1}
                aria-label={t('productDetail.decreaseQuantity')}
              >
                <MinusOutlined style={{ fontSize: '16px' }} />
              </button>

              <WrapperInputNumber onChange={onChange} value={numProduct} defaultValue={1} />

              <button
                className='quantity-btn'
                onClick={() => handleChangeCount('increase')}
                aria-label={t('productDetail.increaseQuantity')}
              >
                <PlusOutlined style={{ fontSize: '16px' }} />
              </button>
            </WrapperQualityProduct>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
            <Button
              onClick={handleAddToCart}
              style={{
                backgroundColor: '#fff',
                height: '48px',
                width: '220px',
                border: '2px solid #1a94ff',
                borderRadius: '8px',
                color: '#1a94ff',
                fontSize: '15px',
                fontWeight: '600',
                margin: '26px 0 10px',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#1a94ff';
                e.currentTarget.style.color = '#fff';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#fff';
                e.currentTarget.style.color = '#1a94ff';
              }}
            >
              {t('productDetail.addToCartButton')}
            </Button>

            <Button
              onClick={handleBuyNow}
              style={{
                backgroundColor: '#1a94ff',
                height: '48px',
                width: '220px',
                border: 'none',
                borderRadius: '8px',
                color: '#fff',
                fontSize: '15px',
                fontWeight: '600',
                margin: '26px 0 10px',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#0d7de8';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#1a94ff';
              }}
            >
              {t('productDetail.buyNowButton')}
            </Button>

          </div>
        </Col>
      </Row>

      {/* Mô tả sản phẩm */}
      <Row style={{ padding: '24px', background: '#fff', borderRadius: '8px', marginTop: '20px', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.06)' }}>
        <Col span={24}>
          <h2 style={{
            fontSize: '20px',
            fontWeight: '600',
            marginBottom: '20px',
            color: '#262626',
            borderLeft: '4px solid #1a94ff',
            paddingLeft: '16px'
          }}>
            Mô tả sản phẩm
          </h2>
          <div style={{
            fontSize: '15px',
            lineHeight: '1.8',
            color: '#595959',
            whiteSpace: 'pre-wrap'
          }}>
            {productDetails?.description || 'Chưa có mô tả chi tiết cho sản phẩm này.'}
          </div>
        </Col>
      </Row>

      {/* Đánh giá và bình luận */}
      <Row style={{ padding: '24px', background: '#fff', borderRadius: '8px', marginTop: '20px', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.06)' }}>
        <Col span={24}>
          <h2 style={{
            fontSize: '20px',
            fontWeight: '600',
            marginBottom: '20px',
            color: '#262626',
            borderLeft: '4px solid #1a94ff',
            paddingLeft: '16px'
          }}>
            {t('productReview.sectionTitle')}
          </h2>

          {/* Tổng quan đánh giá */}
          <div style={{
            display: 'flex',
            gap: '40px',
            padding: '24px',
            background: '#fafafa',
            borderRadius: '8px',
            marginBottom: '24px'
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '48px', fontWeight: '700', color: '#faad14' }}>
                {reviewSummary.averageRating || 0}
              </div>
              <Rate
                allowHalf
                value={reviewSummary.averageRating || 0}
                disabled
                style={{ fontSize: '20px', color: '#faad14' }}
              />
              <div style={{ marginTop: '8px', color: '#8c8c8c' }}>
                {t('productReview.totalReviews', { count: reviewSummary.totalReviews || 0 })}
              </div>
            </div>
            <div style={{ flex: 1 }}>
              {reviewSummary.ratingBreakdown.map((item) => (
                <div key={item.star} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  marginBottom: '8px'
                }}>
                  <span style={{ width: '80px' }}>{item.star} <StarFilled style={{ color: '#faad14' }} /></span>
                  <div style={{
                    flex: 1,
                    height: '8px',
                    background: '#e8e8e8',
                    borderRadius: '4px',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      width: `${item.percentage}%`,
                      height: '100%',
                      background: '#faad14',
                      transition: 'width 0.3s ease'
                    }} />
                  </div>
                  <span style={{ width: '60px', textAlign: 'right', color: '#8c8c8c' }}>
                    {item.percentage}%
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: '24px' }}>
            <div style={{ fontSize: '18px', fontWeight: '700', marginBottom: '12px', color: '#262626' }}>
              {t('productReview.filterTitle')}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
              <Button
                onClick={resetReviewFilters}
                style={getFilterButtonStyle(isAllReviewFiltersOff)}
              >
                {t('productReview.filters.all')}
              </Button>
              <Button
                onClick={() => toggleBooleanFilter('hasImages')}
                style={getFilterButtonStyle(reviewFilters.hasImages)}
              >
                {t('productReview.filters.hasImages')}
              </Button>
              <Button
                onClick={() => toggleBooleanFilter('verifiedPurchase')}
                style={getFilterButtonStyle(reviewFilters.verifiedPurchase)}
              >
                {t('productReview.filters.verifiedPurchase')}
              </Button>
              {[5, 4, 3, 2, 1].map((star) => {
                const isActive = reviewFilters.ratings.includes(star);
                return (
                  <Button
                    key={`rating-filter-${star}`}
                    onClick={() => toggleRatingFilter(star)}
                    style={getFilterButtonStyle(isActive)}
                  >
                    {t('productReview.filters.star', { star })}
                  </Button>
                );
              })}
            </div>
          </div>

          <div style={{ marginBottom: '24px', padding: '16px', border: '1px solid #f0f0f0', borderRadius: '8px' }}>
            <h3 style={{ marginBottom: '12px' }}>{t('productReview.writeTitle')}</h3>
            {!user?.access_token && (
              <p style={{ color: '#8c8c8c', marginBottom: '12px' }}>{t('productReview.loginHint')}</p>
            )}
            <div style={{ marginBottom: '12px' }}>
              <Rate
                value={reviewForm.rating}
                onChange={(value) => setReviewForm((prev) => ({ ...prev, rating: value || 1 }))}
              />
            </div>
            <TextArea
              rows={4}
              maxLength={2000}
              value={reviewForm.comment}
              onChange={(e) => setReviewForm((prev) => ({ ...prev, comment: e.target.value }))}
              placeholder={t('productReview.commentPlaceholder')}
              style={{ marginBottom: '12px' }}
            />

            <div style={{ marginBottom: '12px' }}>
              <label style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input
                  type='file'
                  accept='image/*'
                  multiple
                  onChange={handleReviewFileChange}
                  style={{ display: 'none' }}
                />
                <span
                  style={{
                    border: '1px solid #d9d9d9',
                    borderRadius: '6px',
                    padding: '6px 14px',
                    background: '#fff'
                  }}
                >
                  {t('productReview.pickImages')}
                </span>
              </label>
              <div style={{ marginTop: '8px', color: '#8c8c8c', fontSize: '12px' }}>
                {t('productReview.imageHint')}
              </div>
            </div>

            {reviewForm.images.length > 0 && (
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '12px' }}>
                {reviewForm.images.map((img, index) => (
                  <div key={`${img}-${index}`} style={{ position: 'relative' }}>
                    <img
                      src={img}
                      alt={`review-${index + 1}`}
                      style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #e5e7eb' }}
                    />
                    <button
                      onClick={() => handleRemoveReviewImage(index)}
                      style={{
                        position: 'absolute',
                        top: '-6px',
                        right: '-6px',
                        border: 'none',
                        width: '20px',
                        height: '20px',
                        borderRadius: '50%',
                        background: '#ff4d4f',
                        color: '#fff',
                        cursor: 'pointer'
                      }}
                    >
                      x
                    </button>
                  </div>
                ))}
              </div>
            )}

            <Button
              loading={mutationReview.isPending}
              onClick={handleSubmitReview}
              style={{
                backgroundColor: '#1a94ff',
                borderColor: '#1a94ff',
                color: '#fff',
                fontWeight: '600',
                borderRadius: '8px',
                minWidth: '140px'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#0d7de8';
                e.currentTarget.style.borderColor = '#0d7de8';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#1a94ff';
                e.currentTarget.style.borderColor = '#1a94ff';
              }}
            >
              {t('productReview.submitButton')}
            </Button>
          </div>

          {/* Danh sách bình luận thật */}
          <div style={{ marginTop: '24px' }}>
            {isReviewLoading && <p>{t('productReview.loading')}</p>}
            {!isReviewLoading && reviewList.length === 0 && <Empty description={t('productReview.empty')} />}
            {reviewList.map((review) => (
              <div key={review._id} style={{
                padding: '20px',
                borderBottom: '1px solid #f0f0f0',
                transition: 'background 0.3s ease'
              }}>
                <div style={{ display: 'flex', gap: '16px' }}>
                  <Avatar size={48} src={review?.user?.avatar}>
                    {(review?.user?.name || 'U').charAt(0).toUpperCase()}
                  </Avatar>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                      <span style={{ fontWeight: '600', fontSize: '15px' }}>
                        {review?.user?.name || t('productReview.guest')}
                      </span>
                      <Rate
                        allowHalf
                        value={review?.rating || 0}
                        disabled
                        style={{ fontSize: '14px', color: '#faad14' }}
                      />
                    </div>
                    <div style={{ color: '#8c8c8c', fontSize: '13px', marginBottom: '12px' }}>
                      {new Date(review.createdAt).toLocaleString(language === 'vi' ? 'vi-VN' : 'en-US')}
                    </div>
                    <div style={{ fontSize: '14px', lineHeight: '1.6', color: '#595959' }}>
                      {review.comment}
                    </div>
                    {Array.isArray(review.images) && review.images.length > 0 && (
                      <div style={{ marginTop: '12px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        {review.images.map((img, idx) => (
                          <img
                            key={`${review._id}-img-${idx}`}
                            src={img}
                            alt={`review-img-${idx + 1}`}
                            style={{
                              width: '80px',
                              height: '80px',
                              objectFit: 'cover',
                              borderRadius: '8px',
                              border: '1px solid #e5e7eb'
                            }}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {reviewPagination.totalPages > 1 && (
            <div style={{ textAlign: 'center', marginTop: '24px' }}>
              <Pagination
                current={reviewPagination.pageCurrent}
                total={reviewPagination.totalReviews}
                pageSize={6}
                onChange={(page) => setReviewPage(page)}
                showSizeChanger={false}
              />
            </div>
          )}
        </Col>
      </Row>

      {/* Sản phẩm tương tự */}
      {similarProducts.length > 0 && (
        <Row style={{ padding: '24px', background: '#fff', borderRadius: '8px', marginTop: '20px', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.06)' }}>
          <Col span={24}>
            <h2 style={{
              fontSize: '20px',
              fontWeight: '600',
              marginBottom: '24px',
              color: '#262626',
              borderLeft: '4px solid #1a94ff',
              paddingLeft: '16px'
            }}>
              {t('productReview.similarProductsTitle')}
            </h2>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
              gap: '20px',
              justifyItems: 'center'
            }}>
              {similarProducts.slice(0, 6).map((product) => (
                <CardComponent
                  key={product._id}
                  countInStock={product.countInStock}
                  description={product.description}
                  image={product.image}
                  name={product.name}
                  price={product.price}
                  rating={product.rating}
                  type={product.type}
                  selled={product.selled}
                  discount={product.discount}
                  id={product._id}
                />
              ))}
            </div>
          </Col>
        </Row>
      )}
    </Loading>
  )
}

export default ProductDetailsComponent
