import React, { useState } from 'react'
import NavbarComponent from '../../components/NavbarComponent/NavbarComponent'
import CardComponent from '../../components/CardComponent/CardComponent'
import { Col, Pagination, Row, Empty, Select } from 'antd'
import { WrapperNavbar, WrapperProducts, WrapperContainer, WrapperHeader, WrapperSort } from './style'
import { useParams } from 'react-router-dom'
import * as ProductService from '../../service/ProductService'
import { useQuery } from '@tanstack/react-query'
import Loading from '../../components/LoadingComponent/Loading'
import { useSelector } from 'react-redux'
import { useDebounce } from '../../hooks/useDebounce'

const { Option } = Select;

const TypeProductPage = () => {
  const { type } = useParams();
  const searchProduct = useSelector((state) => state?.product?.search);
  const searchDebounce = useDebounce(searchProduct, 1000);
  const [page, setPage] = useState(0);
  const limit = 10;
  const [sortBy, setSortBy] = useState('');
  const [sortOrder, setSortOrder] = useState('');
  const [filters, setFilters] = useState({ rating: [], priceRange: [0, 100000000] });

  // Chuyển đổi type từ URL về format chuẩn
  const convertType = type ? decodeURIComponent(type).replace(/_/g, ' ') : '';



  const fetchProductsByType = async (context) => {
    const { page = 0, limit = 10, sortBy, sortOrder, filters: currentFilters, search = '' } = context?.queryKey?.[1] || {};

    let sort = null;
    if (sortBy && sortOrder) {
      sort = [sortOrder, sortBy];
    }

    const filter = convertType ? ['type', convertType] : null;

    let res = await ProductService.getAllProduct(search, limit, page, sort, filter);

    
    if (currentFilters && res.data) {
      let filteredData = [...res.data];
      let hasClientFilter = false;

      
      if (currentFilters.rating && currentFilters.rating.length > 0) {
        filteredData = filteredData.filter(product => {
          return currentFilters.rating.some(rating => product.rating >= rating);
        });
        hasClientFilter = true;
      }

      // Lọc theo price range
      if (currentFilters.priceRange) {
        const [minPrice, maxPrice] = currentFilters.priceRange;
        if (minPrice > 0 || maxPrice < 100000000) {
          filteredData = filteredData.filter(product => {
            return product.price >= minPrice && product.price <= maxPrice;
          });
          hasClientFilter = true;
        }
      }

      // Chỉ override total khi có client-side filter
      if (hasClientFilter) {
        res = {
          ...res,
          data: filteredData,
          total: filteredData.length,
          totalPage: 1,
          pageCurrent: 1
        };
      } else {
        res = {
          ...res,
          data: filteredData
        };
      }
    }

    return res;
  };

  const { isPending, data: products } = useQuery({
    queryKey: ['products-by-type', { page, limit, sortBy, sortOrder, type: convertType, filters, search: searchDebounce }],
    queryFn: fetchProductsByType,
    enabled: !!convertType,
    keepPreviousData: true
  });

  const handlePaginationChange = (currentPage) => {
    setPage(currentPage - 1);
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setPage(0); // Reset về trang đầu khi filter
  };

  // Reset page khi search thay đổi
  React.useEffect(() => {
    setPage(0);
  }, [searchDebounce]);

  // Reset page, filters và sort khi chuyển danh mục (type thay đổi)
  React.useEffect(() => {
    setPage(0);
    setFilters({ rating: [], priceRange: [0, 100000000] });
    setSortBy('');
    setSortOrder('');
  }, [convertType]);

  const handleSortChange = (value) => {
    if (value === 'price-asc') {
      setSortBy('price');
      setSortOrder('asc');
    } else if (value === 'price-desc') {
      setSortBy('price');
      setSortOrder('desc');
    } else if (value === 'name-asc') {
      setSortBy('name');
      setSortOrder('asc');
    } else if (value === 'name-desc') {
      setSortBy('name');
      setSortOrder('desc');
    } else if (value === 'rating-desc') {
      setSortBy('rating');
      setSortOrder('desc');
    } else if (value === 'selled-desc') {
      setSortBy('selled');
      setSortOrder('desc');
    } else {
      setSortBy('');
      setSortOrder('');
    }
  };

  return (
    <Loading isLoading={isPending}>
      <WrapperContainer>
        <WrapperHeader>
          <div>
            <h2>Sản phẩm {convertType}</h2>
            {products?.data && (
              <span style={{
                color: '#666',
                fontSize: '14px',
                fontWeight: '400'
              }}>
                Tìm thấy {products.total} sản phẩm
              </span>
            )}
          </div>
          <WrapperSort>
            <span>Sắp xếp theo: </span>
            <Select
              placeholder="Chọn cách sắp xếp"
              style={{ width: 220 }}
              onChange={handleSortChange}
              allowClear
            >
              <Option value="price-asc">Giá tăng dần</Option>
              <Option value="price-desc">Giá giảm dần</Option>
              <Option value="name-asc">Tên A-Z</Option>
              <Option value="name-desc">Tên Z-A</Option>
              <Option value="rating-desc">Đánh giá cao nhất</Option>
              <Option value="selled-desc">Bán chạy nhất</Option>
            </Select>
          </WrapperSort>
        </WrapperHeader>

        <Row gutter={16} style={{ paddingTop: '20px' }}>
          <Col span={4}>
            <WrapperNavbar>
              <NavbarComponent
                type={convertType}
                onFilterChange={handleFilterChange}
              />
            </WrapperNavbar>
          </Col>

          <Col span={20}>
            {products?.data?.length > 0 ? (
              <>
                <WrapperProducts>
                  {products?.data?.map((product) => (
                    <CardComponent
                      key={product._id}
                      id={product._id}
                      countInStock={product.countInStock}
                      description={product.description}
                      image={product.image}
                      name={product.name}
                      price={product.price}
                      rating={product.rating}
                      type={product.type}
                      selled={product.selled}
                      discount={product.discount}
                    />
                  ))}
                </WrapperProducts>

                <div style={{ display: 'flex', justifyContent: 'center', margin: '20px 0' }}>
                  <Pagination
                    current={page + 1}
                    pageSize={limit}
                    total={products?.total || 0}
                    onChange={handlePaginationChange}
                  />
                </div>
              </>
            ) : (
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '400px',
                background: '#fff',
                borderRadius: '8px'
              }}>
                <Empty
                  description={`Không tìm thấy sản phẩm nào cho danh mục "${convertType}"`}
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                />
              </div>
            )}
          </Col>
        </Row>
      </WrapperContainer>
    </Loading>
  )
}

export default TypeProductPage
