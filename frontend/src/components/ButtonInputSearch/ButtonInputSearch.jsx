import React from 'react'
import { SearchOutlined } from '@ant-design/icons';
import InputComponent from '../InputComponent/InputComponent';
import ButtonComponent from '../ButtonComponent/ButtonComponent';

const ButtonInputSearch = (props) => {
    const {
      size,placeholder,textButton,
      backgroundColorInput='#fff',
      backgroundColorButton='rgb(13,92,182)',
      colorButton='#fff'
    } = props
  return (
    <div style={{ display: 'flex', backgroundColor: '#fff', borderRadius: '10px', overflow: 'hidden' }}>
      <InputComponent
        size={size}
        placeholder={placeholder}
        style={{
          backgroundColor: backgroundColorInput,
          borderRadius: '10px 0 0 10px',
          border: 'none',
          outline: 'none',
        }}
        {...props}
        // Xóa prop textButton khỏi InputComponent
      />
      <ButtonComponent
        size={size}
        style={{
          backgroundColor: backgroundColorButton,
          color: colorButton,
          borderRadius: '0 10px 10px 0',
          border: 'none',
          fontWeight: 800,
          letterSpacing: '0.02em',
          textTransform: 'uppercase'
        }}
        icon={<SearchOutlined style={{ color: colorButton }} />}
        textButton={textButton}
      />
    </div>
  )
}

export default ButtonInputSearch