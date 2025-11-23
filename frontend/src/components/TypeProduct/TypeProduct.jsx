import React from 'react'
import { useNavigate } from 'react-router-dom';

const TypeProduct = ({ name }) => {
  const navigate = useNavigate();
  const handleNavigatetype = (type) => {
    // Encode URL để hỗ trợ tiếng Việt
    const encodedType = encodeURIComponent(type.replace(/ /g, '_'));
    navigate(`/product/${encodedType}`);
  }
  return (
    <div style={{ padding: '0 10px', cursor: 'pointer' }} onClick={() => handleNavigatetype(name)}>
      {name}
    </div>
  )
}

export default TypeProduct