
import React from 'react'

import { WrapperInputStyle } from './style'

const InputForm = (props) => {
    
    const {placeholder='Nhập Text',...rests } = props
    const handleOnchangeInput = (e) => {
      if (typeof props.onChange === 'function') {
        props.onChange(e.target.value)
      }
    }

    return (
      <>
          <WrapperInputStyle placeholder={placeholder} value={props.value} {...rests} onChange={handleOnchangeInput} />
      </>
    )
}

export default InputForm