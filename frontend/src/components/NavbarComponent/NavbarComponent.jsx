import React, { useState } from 'react'
import { WrapperContent, WrapperLableText, WrapperTextValue } from './style'
import { Checkbox, Rate, Slider, Button } from 'antd'
import * as ProductService from '../../service/ProductService'
import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'

const NavbarComponent = ({ type, onFilterChange }) => {
    const [selectedRating, setSelectedRating] = useState([]);
    const [priceRange, setPriceRange] = useState([0, 100000000]);
    const navigate = useNavigate();

    const handleNavigateToType = (categoryType) => {
        const encodedType = encodeURIComponent(categoryType.replace(/ /g, '_'));
        navigate(`/product/${encodedType}`);
    };

    const fetchAllTypes = async () => {
        const res = await ProductService.getAllTypeProduct();
        return res.data || [];
    };

    const { data: allTypes } = useQuery({
        queryKey: ['all-types'],
        queryFn: fetchAllTypes
    });

    const handleRatingChange = (checkedValues) => {
        setSelectedRating(checkedValues);
        if (onFilterChange) {
            onFilterChange({ rating: checkedValues, priceRange });
        }
    };

    const handlePriceChange = (value) => {
        setPriceRange(value);
        if (onFilterChange) {
            onFilterChange({ rating: selectedRating, priceRange: value });
        }
    };

    const resetFilters = () => {
        setSelectedRating([]);
        setPriceRange([0, 100000000]);
        if (onFilterChange) {
            onFilterChange({ rating: [], priceRange: [0, 100000000] });
        }
    };

    const renderContent = (contentType, options) => {
        switch (contentType) {
            case 'text':
                return options.map((option, index) => {
                    return (
                        <WrapperTextValue
                            key={index}
                            onClick={() => handleNavigateToType(option)}
                            style={{ cursor: 'pointer' }}
                        >
                            {option}
                        </WrapperTextValue>
                    )
                })
            case 'checkbox':
                return (
                    <Checkbox.Group
                        style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '12px' }}
                        onChange={handleRatingChange}
                        value={selectedRating}
                    >
                        {options.map((option, index) => {
                            return (
                                <Checkbox key={index} value={option.value}>{option.label}</Checkbox>
                            )
                        })}
                    </Checkbox.Group>
                )

            case 'star':
                return (
                    <Checkbox.Group
                        style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '12px' }}
                        onChange={handleRatingChange}
                        value={selectedRating}
                    >
                        {options.map((option, index) => {
                            return (
                                <Checkbox key={index} value={option}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <Rate style={{ fontSize: '12px' }} disabled defaultValue={option} />
                                        <span>{`Từ ${option} sao`}</span>
                                    </div>
                                </Checkbox>
                            )
                        })}
                    </Checkbox.Group>
                )
            case 'price':
                return (
                    <div>
                        <Slider
                            range
                            min={0}
                            max={100000000}
                            step={1000000}
                            value={priceRange}
                            onChange={handlePriceChange}
                            tooltip={{
                                formatter: (value) => `${(value / 1000000).toFixed(0)}M VNĐ`
                            }}
                            trackStyle={[{ backgroundColor: '#1890ff' }]}
                            handleStyle={[{ borderColor: '#1890ff' }, { borderColor: '#1890ff' }]}
                        />
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            marginTop: '12px',
                            fontSize: '12px',
                            color: '#666'
                        }}>
                            <span style={{
                                background: '#f0f0f0',
                                padding: '2px 8px',
                                borderRadius: '4px',
                                fontWeight: '500'
                            }}>
                                {(priceRange[0] / 1000000).toFixed(0)}M
                            </span>
                            <span>-</span>
                            <span style={{
                                background: '#f0f0f0',
                                padding: '2px 8px',
                                borderRadius: '4px',
                                fontWeight: '500'
                            }}>
                                {(priceRange[1] / 1000000).toFixed(0)}M
                            </span>
                        </div>
                    </div>
                )

            default:
                return {}
        }
    }
    return (
        <div>
            <div style={{ marginBottom: '20px' }}>
                <WrapperLableText>Danh mục sản phẩm</WrapperLableText>
                <WrapperContent>
                    {renderContent('text', allTypes || ['Laptop', 'Điện thoại', 'Tablet', 'Đồng hồ'])}
                </WrapperContent>
            </div>

            <div style={{ marginBottom: '20px' }}>
                <WrapperLableText>Đánh giá</WrapperLableText>
                <WrapperContent>
                    {renderContent('star', [5, 4, 3])}
                </WrapperContent>
            </div>

            <div style={{ marginBottom: '20px' }}>
                <WrapperLableText>Khoảng giá (triệu VNĐ)</WrapperLableText>
                <WrapperContent>
                    {renderContent('price', [])}
                </WrapperContent>
            </div>

            <Button
                type="primary"
                onClick={resetFilters}
                style={{ width: '100%', marginTop: '10px' }}
            >
                Xóa bộ lọc
            </Button>
        </div>
    )
}

export default NavbarComponent