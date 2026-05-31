import React, { useEffect, useMemo, useRef, useState } from 'react'
import {
  WrapperCarouselActions,
  WrapperCategoryHorizontal,
  WrapperCategorySection,
  WrapperCustomGrid,
  WrapperCustomHighlight,
  WrapperFeatureItem,
  WrapperFeatureStrip,
  WrapperHorizontalTrack,
  WrapperHeroBanner,
  WrapperHeroCard,
  WrapperHomeContainer,
  WrapperLaptopGrid,
  WrapperPromoBanner,
  WrapperSectionBlock,
  WrapperSectionHeader,
  WrapperVerticalMoreWrap,
  WrapperButtonMore
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
import { CreditCardOutlined, CustomerServiceOutlined, FireOutlined, LeftOutlined, RightOutlined, SyncOutlined, TruckOutlined } from '@ant-design/icons'




const HomePage = () => {
  const { t } = useLanguage();
  const searchProduct = useSelector((state) => state?.product?.search);
  const user = useSelector((state) => state?.user);
  const searchDebounce = useDebounce(searchProduct, 1000);
  const [limit] = useState(80)
  const [laptopVisibleCount, setLaptopVisibleCount] = useState(10)

  const featuredSectionRef = useRef(null)
  const featuredTrackRef = useRef(null)
  const phoneTrackRef = useRef(null)
  const headphoneTrackRef = useRef(null)


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

  const allProducts = products?.data || []

  const normalizeText = (value = '') => value
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()

  const matchProductType = (type, keywords) => {
    const normalizedType = normalizeText(type)
    return keywords.some((keyword) => normalizedType.includes(keyword))
  }

  const featuredProducts = useMemo(() => {
    const clonedProducts = [...allProducts]
    for (let index = clonedProducts.length - 1; index > 0; index -= 1) {
      const randomIndex = Math.floor(Math.random() * (index + 1))
        ;[clonedProducts[index], clonedProducts[randomIndex]] = [clonedProducts[randomIndex], clonedProducts[index]]
    }
    return clonedProducts.slice(0, 12)
  }, [allProducts])

  const phoneProducts = useMemo(
    () => allProducts.filter((product) => matchProductType(product?.type, ['dien thoai', 'phone', 'smartphone', 'iphone'])).slice(0, 10),
    [allProducts]
  )

  const laptopProducts = useMemo(
    () => allProducts.filter((product) => matchProductType(product?.type, ['laptop', 'notebook', 'macbook'])),
    [allProducts]
  )

  const headphoneProducts = useMemo(
    () => allProducts.filter((product) => matchProductType(product?.type, ['tai nghe', 'headphone', 'earphone', 'earbud'])).slice(0, 10),
    [allProducts]
  )

  const trendingProducts = useMemo(
    () => [...allProducts].sort((a, b) => (b?.selled || 0) - (a?.selled || 0)).slice(0, 6),
    [allProducts]
  )

  const bestDealProduct = useMemo(
    () => [...allProducts].sort((a, b) => (b?.discount || 0) - (a?.discount || 0))[0],
    [allProducts]
  )

  const visibleLaptopProducts = laptopProducts.slice(0, laptopVisibleCount)

  const scrollTrack = (trackRef, direction) => {
    const distance = 760
    trackRef.current?.scrollBy({
      left: direction === 'left' ? -distance : distance,
      behavior: 'smooth'
    })
  }

  const handleShopNowClick = () => {
    featuredSectionRef.current?.scrollIntoView({
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

        <WrapperSectionBlock ref={featuredSectionRef}>
          <WrapperSectionHeader>
            <h3>{t('home.sections.featured')}</h3>
            <WrapperCarouselActions>
              <button type="button" onClick={() => scrollTrack(featuredTrackRef, 'left')}>
                <LeftOutlined />
              </button>
              <button type="button" onClick={() => scrollTrack(featuredTrackRef, 'right')}>
                <RightOutlined />
              </button>
            </WrapperCarouselActions>
          </WrapperSectionHeader>
          <WrapperHorizontalTrack ref={featuredTrackRef}>
            {featuredProducts.map((product) => (
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
                enableQuickAdd
                cardWidth={200}
              />
            ))}
          </WrapperHorizontalTrack>
        </WrapperSectionBlock>

        <WrapperPromoBanner>
          <img src="https://res.cloudinary.com/dj8buonsf/image/upload/q_auto/f_auto/v1775052934/promo1-ezremove_izcplu.png" alt={t('home.sections.phoneBannerAlt')} />
        </WrapperPromoBanner>

        <WrapperCategorySection>
          <WrapperSectionHeader>
            <h3>{t('home.sections.smartphones')}</h3>
            <WrapperCarouselActions>
              <button type="button" onClick={() => scrollTrack(phoneTrackRef, 'left')}>
                <LeftOutlined />
              </button>
              <button type="button" onClick={() => scrollTrack(phoneTrackRef, 'right')}>
                <RightOutlined />
              </button>
            </WrapperCarouselActions>
          </WrapperSectionHeader>
          <WrapperCategoryHorizontal ref={phoneTrackRef}>
            {phoneProducts.map((product) => (
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
                enableQuickAdd
                cardWidth={200}
              />
            ))}
          </WrapperCategoryHorizontal>
        </WrapperCategorySection>

        <WrapperPromoBanner>
          <img src="https://res.cloudinary.com/dj8buonsf/image/upload/q_auto/f_auto/v1775054824/promo2_blc7no.png" alt={t('home.sections.laptopBannerAlt')} />
        </WrapperPromoBanner>

        <WrapperCategorySection>
          <WrapperSectionHeader>
            <h3>{t('home.sections.laptops')}</h3>
          </WrapperSectionHeader>
          <WrapperLaptopGrid>
            {visibleLaptopProducts.map((product) => (
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
                enableQuickAdd
                cardWidth="100%"
              />
            ))}
          </WrapperLaptopGrid>

          {laptopVisibleCount < laptopProducts.length && (
            <WrapperVerticalMoreWrap>
              <WrapperButtonMore
                type="default"
                onClick={() => setLaptopVisibleCount((prev) => prev + 10)}
              >
                {t('home.loadMore')}
              </WrapperButtonMore>
            </WrapperVerticalMoreWrap>
          )}
        </WrapperCategorySection>

        <WrapperPromoBanner>
          <img src="https://res.cloudinary.com/dj8buonsf/image/upload/q_auto/f_auto/v1775054865/promo3_etrsjd.png" alt={t('home.sections.headphoneBannerAlt')} />
        </WrapperPromoBanner>

        <WrapperCategorySection>
          <WrapperSectionHeader>
            <h3>{t('home.sections.headphones')}</h3>
            <WrapperCarouselActions>
              <button type="button" onClick={() => scrollTrack(headphoneTrackRef, 'left')}>
                <LeftOutlined />
              </button>
              <button type="button" onClick={() => scrollTrack(headphoneTrackRef, 'right')}>
                <RightOutlined />
              </button>
            </WrapperCarouselActions>
          </WrapperSectionHeader>
          <WrapperCategoryHorizontal ref={headphoneTrackRef}>
            {headphoneProducts.map((product) => (
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
                enableQuickAdd
                cardWidth={200}
              />
            ))}
          </WrapperCategoryHorizontal>
        </WrapperCategorySection>

        <WrapperSectionBlock>
          <WrapperSectionHeader>
            <h3>
              <FireOutlined style={{ marginRight: '8px', color: '#f57f17' }} />
              {t('home.sections.comboTitle')}
            </h3>
          </WrapperSectionHeader>

          <WrapperCustomGrid>
            <WrapperCustomHighlight>
              <span>{t('home.sections.hotDeal')}</span>
              <h4>{bestDealProduct?.name || t('home.sections.hotDealFallback')}</h4>
              <p>
                {t('home.sections.hotDealDesc', { discount: bestDealProduct?.discount || 0 })}
              </p>
            </WrapperCustomHighlight>

            {trendingProducts.map((product) => (
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
                enableQuickAdd
                cardWidth="100%"
              />
            ))}
          </WrapperCustomGrid>
        </WrapperSectionBlock>
      </WrapperHomeContainer>
    </Loading>

  )
}


export default HomePage