import React from 'react'
import { useNavigate } from 'react-router-dom';
import { WrapperTypeProductItem } from './style';

const TypeProduct = ({ name }) => {
  const navigate = useNavigate();
  const handleNavigatetype = (type) => {
    // Encode URL để hỗ trợ tiếng Việt
    const encodedType = encodeURIComponent(type.replace(/ /g, '_'));
    navigate(`/product/${encodedType}`);
  }
  return (
    <WrapperTypeProductItem onClick={() => handleNavigatetype(name)}>
      {name}
    </WrapperTypeProductItem>
  )
}

export default TypeProduct