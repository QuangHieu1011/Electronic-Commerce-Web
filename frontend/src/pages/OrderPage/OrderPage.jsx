import React, { useState, useEffect } from 'react'
import {
  WrapperContainer,
  WrapperHeader,
  WrapperProductInfo,
  WrapperProductImage,
  WrapperProductDetails,
  WrapperSummary,
  WrapperEmpty
} from './style'
import { Button, Checkbox, Image, message } from 'antd'
import { MinusOutlined, PlusOutlined, DeleteOutlined } from '@ant-design/icons'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { updateQuantity, removeFromCart } from '../../redux/slides/cartSlice'

const OrderPage = () => {
  const [selectedItems, setSelectedItems] = useState({});
  const [selectAll, setSelectAll] = useState(false);
  const cart = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Khởi tạo selected items khi cart thay đổi
  useEffect(() => {
    setSelectedItems(prev => {
      const newSelectedItems = { ...prev };
      // Thêm sản phẩm mới vào selected items (mặc định chọn)
      cart.cartItems.forEach(item => {
        if (!(item.product._id in newSelectedItems)) {
          newSelectedItems[item.product._id] = true;
        }
      });

      // Xóa những item không còn trong cart
      Object.keys(newSelectedItems).forEach(productId => {
        if (!cart.cartItems.find(item => item.product._id === productId)) {
          delete newSelectedItems[productId];
        }
      });

      return newSelectedItems;
    });
  }, [cart.cartItems]);

  // Cập nhật selectAll state
  useEffect(() => {
    const allSelected = cart.cartItems.length > 0 && cart.cartItems.every(item => selectedItems[item.product._id]);
    setSelectAll(allSelected);
  }, [cart.cartItems, selectedItems]);

  // Format price function
  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  // Handle quantity update
  const handleUpdateQuantity = (productId, newQuantity) => {
    if (newQuantity >= 1) {
      dispatch(updateQuantity({ productId, quantity: newQuantity }));
    }
  };

  // Handle remove item
  const handleRemoveItem = (productId) => {
    dispatch(removeFromCart({ productId }));
    // Remove from selected items
    setSelectedItems(prev => {
      const updated = { ...prev };
      delete updated[productId];
      return updated;
    });
  };

  // Toggle item selection
  const toggleItemSelection = (productId) => {
    setSelectedItems(prev => ({
      ...prev,
      [productId]: !prev[productId]
    }));
  };

  // Toggle select all
  const toggleSelectAll = () => {
    const newSelectAll = !selectAll;
    setSelectAll(newSelectAll);
    const newSelectedItems = {};
    cart.cartItems.forEach(item => {
      newSelectedItems[item.product._id] = newSelectAll;
    });
    setSelectedItems(newSelectedItems);
  };

  // Calculate total for selected items
  const calculateTotal = () => {
    return cart.cartItems
      .filter(item => selectedItems[item.product._id])
      .reduce((total, item) => {
        const price = item.product.discount || item.product.price;
        return total + (price * item.quantity);
      }, 0);
  };

  // Get selected count
  const getSelectedCount = () => {
    return Object.values(selectedItems).filter(Boolean).length;
  };

  // Handle proceed to checkout
  const handleProceedToCheckout = () => {
    const selectedProducts = cart.cartItems.filter(item => selectedItems[item.product._id]);
    if (selectedProducts.length === 0) {
      message.warning('Vui lòng chọn sản phẩm để đặt hàng!');
      return;
    }

    // Chuyển đến trang thanh toán với thông tin sản phẩm đã chọn
    navigate('/checkout', {
      state: {
        selectedProducts: selectedProducts,
        totalAmount: calculateTotal()
      }
    });
  };

  return (
    <WrapperContainer>
      <WrapperHeader>
        <h2>Giỏ hàng của tôi</h2>
        <Button
          type="link"
          onClick={() => navigate('/order-tracking')}
          style={{ color: 'white', marginLeft: 'auto' }}
        >
          Xem đơn hàng đã đặt →
        </Button>
      </WrapperHeader>

      {cart.cartItems.length === 0 ? (
        <WrapperEmpty>
          <div className="empty-title">Giỏ hàng của bạn đang trống</div>
          <div className="empty-description">Hãy thêm sản phẩm vào giỏ hàng để tiếp tục mua sắm</div>
          <Button className="shopping-btn" type="primary" onClick={() => navigate('/')}>
            Tiếp tục mua sắm
          </Button>
        </WrapperEmpty>
      ) : (
        <div style={{ display: 'flex', gap: '20px' }}>
          {/* Left Column - Cart Items */}
          <div style={{ flex: 1 }}>
            <WrapperProductInfo>
              {/* Header */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                padding: '20px',
                backgroundColor: '#fafafa',
                borderBottom: '1px solid #f0f0f0',
                fontWeight: '600',
                color: '#666'
              }}>
                <div style={{ width: '50px' }}>
                  <Checkbox
                    checked={selectAll}
                    onChange={toggleSelectAll}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  Tất cả ({cart.cartItems.length} sản phẩm)
                </div>
                <div style={{ width: '120px', textAlign: 'center' }}>Đơn giá</div>
                <div style={{ width: '150px', textAlign: 'center' }}>Số lượng</div>
                <div style={{ width: '120px', textAlign: 'center' }}>Thành tiền</div>
                <div style={{ width: '60px' }}></div>
              </div>

              {/* Cart items */}
              {cart.cartItems.map((item) => (
                <div key={item.product._id} className="product-item">
                  {/* Checkbox */}
                  <div style={{ width: '50px' }}>
                    <Checkbox
                      checked={selectedItems[item.product._id] || false}
                      onChange={() => toggleItemSelection(item.product._id)}
                    />
                  </div>

                  {/* Product info */}
                  <div style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
                    <WrapperProductImage>
                      <Image
                        src={item.product.image}
                        alt={item.product.name}
                        width={80}
                        height={80}
                        preview={false}
                      />
                    </WrapperProductImage>
                    <WrapperProductDetails>
                      <div className="product-name">{item.product.name}</div>
                      {item.product.discount && (
                        <div className="product-original-price">
                          {formatPrice(item.product.price)}
                        </div>
                      )}
                    </WrapperProductDetails>
                  </div>

                  {/* Price */}
                  <div style={{ width: '120px', textAlign: 'center' }}>
                    <div className="product-price">
                      {formatPrice(item.product.discount || item.product.price)}
                    </div>
                  </div>

                  {/* Quantity controls */}
                  <div style={{ width: '150px', textAlign: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                      <Button
                        size="small"
                        icon={<MinusOutlined />}
                        onClick={() => handleUpdateQuantity(item.product._id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                        style={{ borderRadius: '6px' }}
                      />
                      <span style={{
                        minWidth: '40px',
                        textAlign: 'center',
                        fontSize: '16px',
                        fontWeight: '500',
                        padding: '4px 8px',
                        backgroundColor: '#f5f5f5',
                        borderRadius: '4px'
                      }}>
                        {item.quantity}
                      </span>
                      <Button
                        size="small"
                        icon={<PlusOutlined />}
                        onClick={() => handleUpdateQuantity(item.product._id, item.quantity + 1)}
                        style={{ borderRadius: '6px' }}
                      />
                    </div>
                  </div>

                  {/* Total price */}
                  <div style={{ width: '120px', textAlign: 'center' }}>
                    <div style={{ fontSize: '16px', fontWeight: '600', color: '#ff4d4f' }}>
                      {formatPrice((item.product.discount || item.product.price) * item.quantity)}
                    </div>
                  </div>

                  {/* Delete button */}
                  <div style={{ width: '60px', textAlign: 'center' }}>
                    <Button
                      type="text"
                      icon={<DeleteOutlined />}
                      onClick={() => handleRemoveItem(item.product._id)}
                      style={{ color: '#ff4d4f', borderRadius: '6px' }}
                      size="small"
                    />
                  </div>
                </div>
              ))}
            </WrapperProductInfo>
          </div>

          {/* Right Column - Summary */}
          <div style={{ width: '350px' }}>
            <WrapperSummary>
              <div className="summary-title">Tóm tắt đơn hàng</div>

              <div className="summary-row">
                <span>Đã chọn:</span>
                <span>{getSelectedCount()} sản phẩm</span>
              </div>

              <div className="summary-row">
                <span>Tạm tính:</span>
                <span>{formatPrice(calculateTotal())}</span>
              </div>

              <div className="summary-row">
                <span>Phí vận chuyển:</span>
                <span>Miễn phí</span>
              </div>

              <div className="summary-row total">
                <span>Tổng cộng:</span>
                <span>{formatPrice(calculateTotal())}</span>
              </div>

              <Button
                className="checkout-btn"
                type="primary"
                onClick={handleProceedToCheckout}
                disabled={getSelectedCount() === 0}
              >
                Thanh toán ({getSelectedCount()})
              </Button>
            </WrapperSummary>
          </div>
        </div>
      )}
    </WrapperContainer>
  );
};

export default OrderPage;
