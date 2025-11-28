import React, { useState, useEffect } from 'react';
import { Card, Timeline, Progress } from 'antd';
import { EnvironmentOutlined, CheckCircleOutlined, ClockCircleOutlined } from '@ant-design/icons';
import './OrderTrackMap.css';

const OrderTrackMap = ({ orderStatus, createdAt }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [shipperPosition, setShipperPosition] = useState(0);

  // Định nghĩa các điểm dừng
  const locations = [
    { 
      id: 1, 
      name: 'Kho hàng', 
      address: 'TechStore - Quận 1, TP.HCM',
      status: 'pending',
      icon: '🏢',
      position: 8
    },
    { 
      id: 2, 
      name: 'Trung tâm', 
      address: 'Phân phối - Quận 3',
      status: 'confirmed',
      icon: '📦',
      position: 38
    },
    { 
      id: 3, 
      name: 'Đang giao', 
      address: 'Trên đường đến bạn',
      status: 'shipping',
      icon: '🚚',
      position: 68
    },
    { 
      id: 4, 
      name: 'Đã giao', 
      address: 'Giao hàng thành công',
      status: 'delivered',
      icon: '✅',
      position: 92
    }
  ];

  // Map order status to step
  useEffect(() => {
    const statusMap = {
      'pending': 0,
      'confirmed': 1,
      'shipping': 2,
      'delivered': 3,
      'cancelled': -1
    };
    const step = statusMap[orderStatus] || 0;
    setCurrentStep(step);
    
    // Set shipper position based on step
    if (step >= 0 && step < 4) {
      const targetPosition = locations[step].position;
      setShipperPosition(targetPosition);
    }
  }, [orderStatus]);

  // Calculate estimated time
  const getEstimatedTime = (step) => {
    if (!createdAt) return '';
    const orderTime = new Date(createdAt);
    const estimates = [
      new Date(orderTime.getTime()), // 0h - Tiếp nhận
      new Date(orderTime.getTime() + 2 * 60 * 60 * 1000), // +2h - Xác nhận
      new Date(orderTime.getTime() + 24 * 60 * 60 * 1000), // +1 ngày - Đang giao
      new Date(orderTime.getTime() + 48 * 60 * 60 * 1000) // +2 ngày - Đã giao
    ];
    return estimates[step].toLocaleString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Calculate progress percentage
  const getProgressPercent = () => {
    const percentMap = {
      'pending': 0,
      'confirmed': 33,
      'shipping': 66,
      'delivered': 100,
      'cancelled': 0
    };
    return percentMap[orderStatus] || 0;
  };

  // Random shipper info (fake data for demo)
  const shipperInfo = {
    name: 'Nguyễn Văn Shipper',
    phone: '0901 234 567',
    vehicle: '🛵 Air Blade - 51B 12345'
  };

  if (orderStatus === 'cancelled') {
    return (
      <Card title="📍 Theo dõi đơn hàng" className="track-map-card">
        <div style={{ textAlign: 'center', padding: '40px 0', color: '#999' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>❌</div>
          <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>Đơn hàng đã bị hủy</div>
          <div style={{ fontSize: 14 }}>Tracking không khả dụng</div>
        </div>
      </Card>
    );
  }

  return (
    <Card title="📍 Theo dõi vị trí đơn hàng" className="track-map-card">
      {/* Bản đồ mô phỏng */}
      <div className="map-container">
        <div className="map-background">
          {/* Route line */}
          <div className={`route-line ${orderStatus}`} />
          
          {/* Location markers */}
          {locations.map((loc, index) => (
            <div 
              key={loc.id}
              className={`location-marker ${index <= currentStep ? 'active' : ''}`}
              style={{ left: `${loc.position}%` }}
            >
              <div className="marker-icon">{loc.icon}</div>
              <div className="marker-label">{loc.name}</div>
            </div>
          ))}
          
          {/* Shipper animated icon */}
          {currentStep >= 0 && currentStep < 4 && (
            <div 
              className="shipper-icon"
              style={{ left: `${shipperPosition}%` }}
            >
              🛵
            </div>
          )}
        </div>

        {/* Progress bar */}
        <div style={{ marginTop: 20 }}>
          <Progress 
            percent={getProgressPercent()} 
            status={orderStatus === 'cancelled' ? 'exception' : 'active'}
            strokeColor={{
              '0%': '#1890ff',
              '100%': '#52c41a',
            }}
            format={percent => `${percent}%`}
          />
        </div>
      </div>

      {/* Timeline chi tiết */}
      <Timeline
        style={{ marginTop: 30 }}
        items={locations.map((loc, index) => ({
          color: index <= currentStep ? 'green' : 'gray',
          dot: index <= currentStep ? <CheckCircleOutlined /> : <ClockCircleOutlined />,
          children: (
            <div>
              <div style={{ fontWeight: 'bold', fontSize: 15, marginBottom: 4 }}>
                {loc.icon} {loc.name}
              </div>
              <div style={{ color: '#666', fontSize: 13, marginBottom: 4 }}>
                {loc.address}
              </div>
              {index <= currentStep && (
                <div style={{ color: '#52c41a', fontSize: 12, marginTop: 4 }}>
                  ✓ Hoàn thành: {getEstimatedTime(index)}
                </div>
              )}
              {index === currentStep + 1 && (
                <div style={{ color: '#ff9800', fontSize: 12, marginTop: 4 }}>
                  ⏱ Dự kiến: {getEstimatedTime(index)}
                </div>
              )}
            </div>
          )
        }))}
      />

      {/* Thông tin shipper (nếu đang giao) */}
      {orderStatus === 'shipping' && (
        <Card 
          size="small" 
          title="👤 Thông tin người giao hàng"
          className="shipper-info-card"
        >
          <div className="shipper-info-content">
            <div className="shipper-avatar">🧑‍💼</div>
            <div className="shipper-details">
              <div className="shipper-name">{shipperInfo.name}</div>
              <div className="shipper-phone">📞 {shipperInfo.phone}</div>
              <div className="shipper-status">🛵 {shipperInfo.vehicle}</div>
              <div className="shipper-status" style={{ marginTop: 8 }}>
                ✅ Đang trên đường giao hàng đến bạn
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Note */}
      <div style={{ 
        marginTop: 16, 
        padding: 12, 
        background: '#f0f7ff', 
        borderRadius: 6,
        fontSize: 12,
        color: '#666'
      }}>
        💡 <strong>Lưu ý:</strong> Thời gian giao hàng là dự kiến và có thể thay đổi tùy theo tình trạng thực tế.
      </div>
    </Card>
  );
};

export default OrderTrackMap;
