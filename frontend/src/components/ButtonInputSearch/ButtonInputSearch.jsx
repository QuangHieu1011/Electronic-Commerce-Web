import React from 'react'
import { SearchOutlined } from '@ant-design/icons';
import InputComponent from '../InputComponent/InputComponent';
import ButtonComponent from '../ButtonComponent/ButtonComponent';

const ButtonInputSearch = (props) => {
    const {
      size,placeholder,textButton,
      bordered,backgroundColorInput='#fff',
      backgroundColorButton='rgb(13,92,182)',
      colorButton='#fff'
    } = props
  return (
    <div style={{ display: 'flex', backgroundColor: '#fff' }}>
      <InputComponent
        size={size}
        placeholder={placeholder}
        style={{
          backgroundColor: backgroundColorInput,
          borderRadius: 0,
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
          borderRadius: 0,
          border: 'none',
        }}
        icon={<SearchOutlined style={{ color: colorButton }} />}
        textButton={textButton}
      />
    </div>
  )
}

export default ButtonInputSearch