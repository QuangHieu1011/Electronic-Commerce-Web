import { Button } from 'antd'
import React from 'react'

const ButtonComponent = ({size, style: styleButton, styleText, textButton, icon, ...rests}) => {
  return (
    <Button 
      size={size}
      icon={icon}
      style={styleButton}
      {...rests}
    >
      <span style={styleText}>{textButton}</span>
    </Button>
  )
}

export default ButtonComponent