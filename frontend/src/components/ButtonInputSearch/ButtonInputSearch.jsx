import React from 'react'
import { SearchOutlined } from '@ant-design/icons';
import InputComponent from '../InputComponent/InputComponent';
import ButtonComponent from '../ButtonComponent/ButtonComponent';

const ButtonInputSearch = (props) => {
    const {
      size,placeholder,textButton,
      bordered,backgroundColorInput='#fff',
      backgroundColorButton='#d70018',
      colorButton='#fff'
    } = props
  return (
    <div style={{ 
      display: 'flex', 
      backgroundColor: '#fff', 
      borderRadius: '8px',
      overflow: 'hidden',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      border: '2px solid transparent',
      transition: 'all 0.3s ease'
    }}
    onMouseEnter={(e) => e.currentTarget.style.borderColor = '#d70018'}
    onMouseLeave={(e) => e.currentTarget.style.borderColor = 'transparent'}
    >
      <InputComponent
        size={size}
        placeholder={placeholder}
        style={{
          backgroundColor: backgroundColorInput,
          border: 'none',
          outline: 'none',
          fontSize: '14px',
          flex: 1
        }}
      />
      <ButtonComponent
        size={size}
        style={{
          backgroundColor: backgroundColorButton,
          color: colorButton,
          border: 'none',
          fontWeight: '600',
          padding: '0 24px',
          transition: 'all 0.3s ease'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = '#b8001a'
          e.currentTarget.style.transform = 'scale(1.02)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = backgroundColorButton
          e.currentTarget.style.transform = 'scale(1)'
        }}
        icon={<SearchOutlined style={{ color: colorButton, fontSize: '16px' }} />}
        textButton={textButton}
      />
    </div>
  )
}

export default ButtonInputSearch