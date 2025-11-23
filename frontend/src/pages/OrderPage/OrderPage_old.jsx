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
import { Button, Checkbox, Empty, Image, message } from 'antd'
import { MinusOutlined, PlusOutlined, DeleteOutlined } from '@ant-design/icons'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { updateQuantity, removeFromCart } from '../../redux/slides/cartSlice'

const OrderPage = () => {
  const [selectedItems, setSelectedItems] = useState({});
  const [selectAll, setSelectAll] = useState(false);
  const cart = useSelector((state) => state.cart);
  const user = useSelector((state) => state?.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Khởi tạo selected items khi cart thay đổi
  useEffect(() => {
    const initialSelected = {};
    cart.cartItems.forEach(item => {
      initialSelected[item.product._id] = true; // Mặc định chọn tất cả
    });
    setSelectedItems(initialSelected);
  }, [cart.cartItems]);

  // Format giá tiền
  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN').format(price);
  };

  // Tính toán tổng tiền các sản phẩm đã chọn
  const calculateTotal = () => {
    return cart.cartItems
      .filter(item => selectedItems[item.product._id])
      .reduce((total, item) => {
        const price = item.product.discount || item.product.price;
        return total + (price * item.quantity);
      }, 0);
  };

  // Đếm số sản phẩm đã chọn
  const getSelectedCount = () => {
    return cart.cartItems.filter(item => selectedItems[item.product._id]).length;
  };

  // Thay đổi số lượng sản phẩm
  const handleUpdateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) return;
    dispatch(updateQuantity({ productId, quantity: newQuantity }));
  };

  // Chọn/bỏ chọn sản phẩm
  const toggleItemSelection = (productId) => {
    setSelectedItems(prev => ({
      ...prev,
      [productId]: !prev[productId]
    }));
  };

  // Chọn/bỏ chọn tất cả
  const toggleSelectAll = () => {
    const newSelectAll = !selectAll;
    setSelectAll(newSelectAll);
    const newSelected = {};
    cart.cartItems.forEach(item => {
      newSelected[item.product._id] = newSelectAll;
    });
    setSelectedItems(newSelected);
  };

  // Xóa sản phẩm khỏi giỏ
  const handleRemoveItem = (productId) => {
    dispatch(removeFromCart(productId));
    // Remove from selected items as well
    setSelectedItems(prev => {
      const newSelected = { ...prev };
      delete newSelected[productId];
      return newSelected;
    });
  };

  // Xử lý thanh toán
  const handleCheckout = () => {
    const selectedCartItems = cart.cartItems.filter(item => selectedItems[item.product._id]);
    if (selectedCartItems.length === 0) {
      message.warning('Vui lòng chọn ít nhất một sản phẩm để mua hàng');
      return;
    }
    console.log('Proceed to checkout:', selectedCartItems);
    message.success('Chuyển đến trang thanh toán');
  };

  if (!user?.id) {
    return (
      <WrapperContainer>
        <WrapperEmpty>
          <Empty
            description="Vui lòng đăng nhập để xem giỏ hàng"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          >
            <Button type="primary" onClick={() => navigate('/sign-in')}>
              Đăng nhập
            </Button>
          </Empty>
        </WrapperEmpty>
      </WrapperContainer>
    );
  }

  return (
    <WrapperContainer>
      <WrapperHeader>
        <h2>Giỏ hàng</h2>
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
        <>
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
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Button
                    size="small"
                    icon={<MinusOutlined />}
                    onClick={() => handleUpdateQuantity(item.product._id, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                  />
                  <span style={{ margin: '0 16px', fontSize: '16px', minWidth: '30px', textAlign: 'center' }}>
                    {item.quantity}
                  </span>
                  <Button
                    size="small"
                    icon={<PlusOutlined />}
                    onClick={() => handleUpdateQuantity(item.product._id, item.quantity + 1)}
                  />
                </div>
              </div>

              {/* Total price */}
              <div style={{ width: '150px', textAlign: 'center', fontSize: '16px', fontWeight: '600', color: '#ff4d4f' }}>
                {formatPrice((item.product.discount || item.product.price) * item.quantity)}
              </div>

              {/* Delete button */}
              <div style={{ width: '80px', textAlign: 'center' }}>
                <Button
                  type="text"
                  icon={<DeleteOutlined />}
                  onClick={() => handleRemoveItem(item.product._id)}
                  style={{ color: '#ff4d4f' }}
                />
              </div>
            </div>
          ))}

          {/* Summary */}
          <WrapperSummary>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px' }}>
              <div>
                <span>Tạm tính: </span>
                <span style={{ fontSize: '16px', color: '#666' }}>0</span>
              </div>
              <div>
                <span>Giảm giá: </span>
                <span style={{ fontSize: '16px', color: '#666' }}>0</span>
              </div>
              <div>
                <span>Thuế: </span>
                <span style={{ fontSize: '16px', color: '#666' }}>0</span>
              </div>
              <div>
                <span>Phí giao hàng: </span>
                <span style={{ fontSize: '16px', color: '#666' }}>0</span>
              </div>
              <div style={{ fontSize: '24px', fontWeight: '600', color: '#ff4d4f' }}>
                <span>Tổng tiền: </span>
                <span>{formatPrice(calculateTotal())}</span>
                <div style={{ fontSize: '14px', color: '#666', fontWeight: '400' }}>
                  (Đã bao gồm VAT nếu có)
                </div>
              </div>
              <div>
                <Button
                  type="primary"
                  size="large"
                  onClick={handleCheckout}
                  disabled={getSelectedCount() === 0}
                  style={{
                    backgroundColor: '#ff4757',
                    borderColor: '#ff4757',
                    fontSize: '16px',
                    fontWeight: '600',
                    height: '50px',
                    padding: '0 40px'
                  }}
                >
                  Mua hàng ({getSelectedCount()})
                </Button>
              </div>
            </div>
          </WrapperSummary>
        </>
      )}
    </WrapperContainer>
  );
};

export default OrderPage;