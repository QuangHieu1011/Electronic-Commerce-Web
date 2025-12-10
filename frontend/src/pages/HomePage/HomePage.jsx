import React, { useEffect, useState } from 'react'
import TypeProduct from '../../components/TypeProduct/TypeProduct'
import { WrapperButtonMore, WrapperProducts, WrapperTypeProduct } from './style'
import SliderComponent from '../../components/SliderComponent/SliderComponent'
import slider1 from '../../assets/images/Slider 1.png'
import slider2 from '../../assets/images/Slider 2.png'
import slider3 from '../../assets/images/Slider 3.png'
import CardComponent from '../../components/CardComponent/CardComponent'
import { useQuery } from '@tanstack/react-query'
import * as ProductService from '../../service/ProductService'
import * as UserService from '../../service/UserService'
import { useSelector } from 'react-redux'
import Loading from '../../components/LoadingComponent/Loading'
import { useDebounce } from '../../hooks/useDebounce'




const HomePage = () => {
  const searchProduct = useSelector((state) => state?.product?.search);
  const user = useSelector((state) => state?.user);
  const searchDebounce = useDebounce(searchProduct, 1000);
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
    if (res.status === 'OK') {
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
  }, [])

  // Initialize chatbot with user identity
  useEffect(() => {
    const initializeChatbot = async () => {
      // Check if user is logged in and chatbot is available
      if (user?.id && user?.access_token && window.chatbase) {
        try {
          const response = await UserService.getChatbotToken(user.access_token);
          if (response.status === 'OK' && response.token) {
            // Identify user with Chatbase
            window.chatbase('identify', { token: response.token });
          }
        } catch (error) {
          console.error('Failed to initialize chatbot:', error);
        }
      }
    };

    // Wait a bit for chatbot to load
    const timer = setTimeout(initializeChatbot, 1000);
    return () => clearTimeout(timer);
  }, [user])


  return (
    <Loading isLoading={isPending}>
      {/* Decorative Shapes */}
      <div style={{
        position: 'fixed',
        width: '100%',
        height: '100%',
        top: 0,
        left: 0,
        pointerEvents: 'none',
        zIndex: 0,
        overflow: 'hidden'
      }}>
        {/* Top Left Blob */}
        <div style={{
          position: 'absolute',
          top: '-100px',
          left: '-100px',
          width: '300px',
          height: '300px',
          background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.12) 0%, rgba(118, 75, 162, 0.12) 100%)',
          borderRadius: '50%',
          filter: 'blur(60px)',
          animation: 'float 20s ease-in-out infinite'
        }} />

        {/* Top Right Blob */}
        <div style={{
          position: 'absolute',
          top: '100px',
          right: '-150px',
          width: '400px',
          height: '400px',
          background: 'linear-gradient(135deg, rgba(26, 148, 255, 0.1) 0%, rgba(102, 126, 234, 0.1) 100%)',
          borderRadius: '50%',
          filter: 'blur(80px)',
          animation: 'float 25s ease-in-out infinite reverse'
        }} />

        {/* Bottom Left Shape */}
        <div style={{
          position: 'absolute',
          bottom: '-80px',
          left: '-80px',
          width: '250px',
          height: '250px',
          background: 'linear-gradient(135deg, rgba(255, 107, 107, 0.12) 0%, rgba(255, 142, 83, 0.12) 100%)',
          borderRadius: '50%',
          filter: 'blur(50px)',
          animation: 'pulse 15s ease-in-out infinite'
        }} />

        {/* Bottom Right Shape */}
        <div style={{
          position: 'absolute',
          bottom: '150px',
          right: '-50px',
          width: '200px',
          height: '200px',
          background: 'linear-gradient(135deg, rgba(67, 233, 123, 0.1) 0%, rgba(56, 249, 215, 0.1) 100%)',
          borderRadius: '30% 70% 70% 30% / 30% 30% 70% 70%',
          filter: 'blur(40px)',
          animation: 'rotate 30s linear infinite'
        }} />
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) translateX(0) scale(1); }
          25% { transform: translateY(-30px) translateX(20px) scale(1.05); }
          50% { transform: translateY(-50px) translateX(-20px) scale(0.95); }
          75% { transform: translateY(-30px) translateX(20px) scale(1.05); }
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 0.5; }
          50% { transform: scale(1.15); opacity: 0.7; }
        }
        @keyframes rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>

      <div style={{
        padding: '0 120px',
        fontSize: '16px',
        maxWidth: '1440px',
        margin: '0 auto',
        position: 'relative',
        zIndex: 1
      }}>
        <WrapperTypeProduct>
          {typeProducts.map((item) => {
            return (
              <TypeProduct name={item} key={item} />
            )
          })}
        </WrapperTypeProduct>
      </div>

      <div id="container" style={{
        backgroundColor: '#efefef',
        padding: '0 120px',
        minHeight: '100vh',
        paddingBottom: '50px',
        maxWidth: '1440px',
        margin: '0 auto',
        position: 'relative',
        zIndex: 1
      }}>
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