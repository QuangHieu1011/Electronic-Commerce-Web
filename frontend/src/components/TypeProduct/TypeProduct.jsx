import React, { useState } from 'react'
import { 
  LaptopOutlined, 
  MobileOutlined, 
  CameraOutlined, 
  AudioOutlined,
  WifiOutlined,
  AppstoreOutlined 
} from '@ant-design/icons'

const TypeProduct = ({name}) => {
  const [isHovered, setIsHovered] = useState(false)
  
  // Map product names to icons
  const getIcon = (productName) => {
    const iconMap = {
      'TV': <WifiOutlined />,
      'Laptop': <LaptopOutlined />,
      'Điện Thoại': <MobileOutlined />,
      'Máy Ảnh': <CameraOutlined />,
      'Tai Nghe': <AudioOutlined />,
    }
    return iconMap[productName] || <AppstoreOutlined />
  }

  return (
    <div 
      style={{
        padding:'10px 20px',
        cursor: 'pointer',
        borderRadius: '8px',
        backgroundColor: isHovered ? '#fff5f5' : 'transparent',
        transition: 'all 0.3s ease',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        fontSize: '14px',
        fontWeight: '500',
        color: isHovered ? '#d70018' : '#333',
        border: `1px solid ${isHovered ? '#d70018' : 'transparent'}`,
        whiteSpace: 'nowrap'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <span style={{ fontSize: '16px' }}>{getIcon(name)}</span>
      {name}
    </div>
  )
}

export default TypeProduct