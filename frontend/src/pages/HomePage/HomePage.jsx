import React, { use, useEffect, useRef, useState } from 'react'
import TypeProduct from '../../components/TypeProduct/TypeProduct'
import { WrapperButtonMore, WrapperProducts, WrapperTypeProduct } from './style'
import SliderComponent from '../../components/SliderComponent/SliderComponent'
import slider1 from '../../assets/images/Slider 1.png'
import slider2 from '../../assets/images/Slider 2.png'
import slider3 from '../../assets/images/Slider 3.png'
import CardComponent from '../../components/CardComponent/CardComponent'
import { useQuery } from '@tanstack/react-query'
import * as ProductService from '../../service/ProductService'
import { useSelector } from 'react-redux'
import Loading from '../../components/LoadingComponent/Loading'
import { useDebounce } from '../../hooks/useDebounce'




const HomePage = () => {
  const searchProduct = useSelector((state) => state?.product?.search);
  const searchDebounce = useDebounce(searchProduct, 1000);
  const [loading, setLoading] = useState(false)
  const [limit, setLimit] = useState(6)
  const [typeProducts, setTypeProducts] = useState([])
  

  const fetchProductAll = async (context) => {
    const limit = context?.queryKey && context?.queryKey[1]
    const search = context?.queryKey && context?.queryKey[2]
    const res = await ProductService.getAllProduct(search, limit)
    return res
  }

  const fetchAllTypeProduct = async () => {
    const res = await ProductService.getAllTypeProduct()
    if(res.status === 'OK')
      {
    setTypeProducts(res?.data)
  }
    
  }

  const { isPending, data: products } = useQuery({
    queryKey: ['products', limit, searchDebounce],
    queryFn: fetchProductAll,
    retry: 3,
    retryDelay: 1000,
    placeholderData: (previousData) => previousData,
  })

  useEffect(() => {
    fetchAllTypeProduct()
  },[])


  return (
    <Loading isLoading={loading || isPending}>
      <div style={{ padding: '0 120px', fontSize: '16px' }}>
        <WrapperTypeProduct>
          {typeProducts.map((item) => {
            return (
              <TypeProduct name={item} key={item} />
            )
          })}
        </WrapperTypeProduct>
      </div>

      <div id="container" style={{ backgroundColor: '#efefef', padding: '0 120px', minHeight: '100vh', paddingBottom: '50px' }}>
        <SliderComponent arrImages={[slider1, slider2, slider3]} />
        <WrapperProducts>
          {products?.data?.map((product) => {
            return (
              <CardComponent
                key={product._id}
                countInStock={product.countInStock}
                description={product.description}
                image={product.image}
                name={product.name}
                price={product.price}
                rating={product.rating}
                type={product.type}
                selled={product.selled}
                discount={product.discount}
                id={product._id}
              />
            )
          })}

        </WrapperProducts>
        <div style={{ display: 'flex', width: '100%', justifyContent: 'center', marginTop: '20px' }}>
          <WrapperButtonMore
            type="default"
            disabled={
              products?.data?.length >= products?.total ||
              (searchDebounce && products?.data?.length < limit)
            }
            onClick={() => setLimit(limit + 6)}
            style={{
              backgroundColor: (
                products?.data?.length >= products?.total ||
                (searchDebounce && products?.data?.length < limit)
              ) ? '#ccc' : '',
              borderColor: (
                products?.data?.length >= products?.total ||
                (searchDebounce && products?.data?.length < limit)
              ) ? '#ccc' : '',
              cursor: (
                products?.data?.length >= products?.total ||
                (searchDebounce && products?.data?.length < limit)
              ) ? 'not-allowed' : 'pointer'
            }}
          >
            Xem thêm
          </WrapperButtonMore>
        </div>
      </div>
    </Loading>

  )
}


export default HomePage