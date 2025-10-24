import { Input } from 'antd'
import React from 'react'
import { useState } from 'react'
import { WrapperInputStyle } from './style'

const InputForm = (props) => {
    const [valueInput, setValueInput] = useState('')
    const {placeholder='Nhập Text',...rests } = props
    
  return (
    <>
        <WrapperInputStyle placeholder={placeholder} valueInput={valueInput} {...rests} />
    </>
  )
}

export default InputForm