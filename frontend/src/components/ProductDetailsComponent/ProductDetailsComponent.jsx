import { Button, Col, Image, InputNumber, Rate, Row } from 'antd'
import React, { useState } from 'react'
import imageProduct from '../../assets/images/Iphone.png'
import imageProductSmall from '../../assets/images/Iphonesmall.png'
import { MinusOutlined, PlusOutlined, StarFilled } from '@ant-design/icons'
import {
  WrapperStyleColImage,
  WrapperStyleImageSmall,
  WrapperContainerImage,
  WrapperListImage,
  WrapperStyleNameProduct,
  WrapperStyleTextSell,
  WrapperPriceProduct,
  WrapperPriceTextProduct,
  WrapperAddressProduct,
  WrapperQualityProduct,
  WrapperInputNumber,
  WrapperBtnQualityProduct
} from './style'
import * as ProductService from '../../service/ProductService'
import { useQuery } from '@tanstack/react-query'
import Loading from '../LoadingComponent/Loading'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { addToCart } from '../../redux/slides/cartSlice'
import { message } from 'antd'


const ProductDetailsComponent = ({ idProduct }) => {
  const [numProduct, setNumProduct] = useState(1);
  const user = useSelector((state) => state?.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const onChange = (value) => {
    setNumProduct(Number(value));
  }

  const fetchGetDetailsProduct = async (context) => {
    const id = context?.queryKey && context?.queryKey[1]
    if (id) {
      const res = await ProductService.getDetailsProduct(id)
      return res.data
    }
  }

  const handleChangeCount = (type) => {
    if (type === 'increase') {
      setNumProduct((prev) => prev + 1);
    } else if (type === 'decrease') {
      setNumProduct((prev) => (prev - 1) >= 1 ? prev - 1 : 1);
    }
  }

  const handleAddToCart = () => {
    if (!productDetails) {
      message.error('Không thể thêm sản phẩm vào giỏ hàng!');
      return;
    }

    if (numProduct < 1) {
      message.warning('Vui lòng chọn số lượng!');
      return;
    }

    dispatch(addToCart({
      product: productDetails,
      quantity: numProduct
    }));

    message.success(`Đã thêm ${numProduct} sản phẩm vào giỏ hàng!`);

    // Chuyển đến trang giỏ hàng
    navigate('/order');
  };


  const { isPending, data: productDetails } = useQuery({
    queryKey: ['product-details', idProduct],
    queryFn: fetchGetDetailsProduct,
    enabled: !!idProduct,
  })


  return (
    <Loading isLoading={isPending}>
      <Row style={{ padding: '16px', background: '#fff', borderRadius: '4px' }}>

        <Col span={10} style={{ borderRight: '1px solid #e5e5e5', paddingRight: '10px' }}>
          <WrapperContainerImage>
            <Image
              src={productDetails?.image}
              alt="image product"
              preview={false}
            />
          </WrapperContainerImage>

          <WrapperListImage>
            {[1, 2, 3, 4, 5, 6].map((_, index) => (
              <WrapperStyleColImage key={index}>
                <WrapperStyleImageSmall
                  src={imageProductSmall}
                  alt={`image small ${index + 1}`}
                  preview={false}
                />
              </WrapperStyleColImage>
            ))}
          </WrapperListImage>
        </Col>


        <Col span={14} style={{ paddingLeft: '10px' }}>
          <WrapperStyleNameProduct> {productDetails?.name} </WrapperStyleNameProduct>
          <div>
            <Rate allowHalf value={productDetails?.rating} disabled style={{ fontSize: '16px', color: 'rgb(253,216,54)' }} />
            <WrapperStyleTextSell>| Đã bán 1000+</WrapperStyleTextSell>
          </div>
          <WrapperPriceProduct>
            <WrapperPriceTextProduct>{productDetails?.price}</WrapperPriceTextProduct>
          </WrapperPriceProduct>
          <WrapperAddressProduct>
            <span>Giao đến </span>
            <span className='address'>{user?.address}</span> -
            <span className='change-address'>Đổi địa chỉ</span>
          </WrapperAddressProduct>
          <div style={{ margin: '10px 0 10px', borderTop: '1px solid #e5e5e5', borderBottom: '1px solid #e5e5e5', padding: '10px 0' }}>
            <div style={{ marginBottom: '10px' }}>Số lượng</div>
            <WrapperQualityProduct>
              <button style={{ border: 'none', background: 'transparent', cursor: 'pointer' }} onClick={() => handleChangeCount('decrease')}>
                <MinusOutlined style={{ color: '#000', fontSize: '20px' }} />
              </button>

              <WrapperInputNumber onChange={onChange} value={numProduct} defaultValue={1} />

              <button style={{ border: 'none', background: 'transparent', cursor: 'pointer' }} onClick={() => handleChangeCount('increase')}>
                <PlusOutlined style={{ color: '#000', fontSize: '20px' }} />
              </button>
            </WrapperQualityProduct>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <Button
              onClick={handleAddToCart}
              style={{
                backgroundColor: 'rgb(255, 57, 69)',
                height: '48px',
                width: '220px',
                border: 'none',
                borderRadius: '4px',
                color: '#fff',
                fontSize: '15px',
                fontWeight: '700',
                margin: '26px 0 10px'
              }}
            >
              Chọn mua
            </Button>

            <Button
              style={{
                backgroundColor: '#fff',
                height: '48px',
                width: '220px',
                border: '1px solid rgb(13, 92, 182)',
                borderRadius: '4px',
                color: 'rgb(13, 92, 182)',
                fontSize: '15px',
                fontWeight: '500',
                margin: '26px 0 10px'
              }}
            >
              Mua trả sau
            </Button>

          </div>
        </Col>
      </Row>
    </Loading>
  )
}

export default ProductDetailsComponent
