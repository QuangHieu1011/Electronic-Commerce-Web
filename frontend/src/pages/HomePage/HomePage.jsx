import React, { useEffect, useRef, useState } from 'react'
import {
  WrapperButtonMore,
  WrapperFeatureItem,
  WrapperFeatureStrip,
  WrapperHeroBanner,
  WrapperHeroCard,
  WrapperHomeContainer,
  WrapperProducts
} from './style'
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
import { useLanguage } from '../../context/LanguageContext'
import { CreditCardOutlined, CustomerServiceOutlined, SyncOutlined, TruckOutlined } from '@ant-design/icons'




const HomePage = () => {
  const { t } = useLanguage();
  const searchProduct = useSelector((state) => state?.product?.search);
  const user = useSelector((state) => state?.user);
  const searchDebounce = useDebounce(searchProduct, 1000);
  const [limit, setLimit] = useState(12)
  const productsRef = useRef(null)


  const fetchProductAll = async (context) => {
    const limit = context?.queryKey && context?.queryKey[1]
    const search = context?.queryKey && context?.queryKey[2]
    const res = await ProductService.getAllProduct(search, limit)
    return res
  }

  const { isPending, data: products } = useQuery({
    queryKey: ['products', limit, searchDebounce],
    queryFn: fetchProductAll,
    retry: 3,
    retryDelay: 1000,
    placeholderData: (previousData) => previousData,
  })

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

  const handleShopNowClick = () => {
    productsRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    })
  }


  return (
    <Loading isLoading={isPending}>
      <WrapperHomeContainer id="container">
        <WrapperHeroBanner>
          <SliderComponent
            arrImages={[slider1, slider2, slider3]}
            imageHeight="500px"
            mobileImageHeight="240px"
            autoplay
            autoplaySpeed={3200}
          />
          <WrapperHeroCard>
            <h2>{t('home.heroTitle')}</h2>
            <p>{t('home.heroSubtitle')}</p>
            <button type="button" onClick={handleShopNowClick}>{t('home.shopNow')}</button>
          </WrapperHeroCard>
        </WrapperHeroBanner>

        <WrapperFeatureStrip>
          <WrapperFeatureItem>
            <TruckOutlined style={{ fontSize: '22px', color: '#0b6fd0' }} />
            <div>
              <h4>{t('home.features.shippingTitle')}</h4>
              <p>{t('home.features.shippingDesc')}</p>
            </div>
          </WrapperFeatureItem>
          <WrapperFeatureItem>
            <CustomerServiceOutlined style={{ fontSize: '22px', color: '#0b6fd0' }} />
            <div>
              <h4>{t('home.features.supportTitle')}</h4>
              <p>{t('home.features.supportDesc')}</p>
            </div>
          </WrapperFeatureItem>
          <WrapperFeatureItem>
            <SyncOutlined style={{ fontSize: '22px', color: '#0b6fd0' }} />
            <div>
              <h4>{t('home.features.returnTitle')}</h4>
              <p>{t('home.features.returnDesc')}</p>
            </div>
          </WrapperFeatureItem>
          <WrapperFeatureItem>
            <CreditCardOutlined style={{ fontSize: '22px', color: '#0b6fd0' }} />
            <div>
              <h4>{t('home.features.paymentTitle')}</h4>
              <p>{t('home.features.paymentDesc')}</p>
            </div>
          </WrapperFeatureItem>
        </WrapperFeatureStrip>

        <WrapperProducts ref={productsRef}>
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
            onClick={() => setLimit(limit + 12)}
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
            {t('home.loadMore')}
          </WrapperButtonMore>
        </div>
      </WrapperHomeContainer>
    </Loading>

  )
}


export default HomePage