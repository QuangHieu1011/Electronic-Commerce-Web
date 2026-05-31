import React, { useEffect, useState } from 'react'
import { WrapperContainerLeft, WrapperContainerRight, WrapperH1, WrapperH4, WrapperP, WrapperTextLight } from './style'
import InputForm from '../../components/InputForm/InputForm'
import { Button, Image } from 'antd'
import imageLogo from '../../assets/images/Logo_Login.png'
import { useNavigate, useLocation } from 'react-router-dom'
import { EyeFilled, EyeInvisibleFilled } from '@ant-design/icons';
import * as UserService from '../../service/UserService'
import { useMutationHooks } from '../../hooks/useMutationHook'
import Loading from '../../components/LoadingComponent/Loading'
import { jwtDecode } from 'jwt-decode';
import { useDispatch } from 'react-redux'
import { updateUser } from '../../redux/slides/userSlide'
import ResetPasswordModal from '../../components/ResetPasswordModal/ResetPasswordModal'
import { GoogleLogin } from '@react-oauth/google'





const SignInPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [showResetModal, setShowResetModal] = useState(false);
  const dispatch = useDispatch();

  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigateSignup = () => {
    navigate('/sign-up')
  }

  const mutation = useMutationHooks(
    data => UserService.loginUser(data)
  )
  console.log('mutation', mutation)
  const { data, isPending, isSuccess, } = mutation

  useEffect(() => {
    if (isSuccess) {
      if (data?.access_token) {
        localStorage.setItem('access_token', JSON.stringify(data.access_token));
        localStorage.setItem('auth_session', 'active');
        const decoded = jwtDecode(data.access_token);
        if (decoded?.id) {
          dispatch(updateUser({ ...decoded, access_token: data.access_token }));
          handleGetDetailsUser(decoded.id, data.access_token);
        }

        // Kiểm tra xem có redirect về trang nào không
        const redirectPath = location.state?.from;
        if (redirectPath === '/checkout' && location.state?.selectedProducts) {
          // Redirect về checkout với dữ liệu sản phẩm
          navigate('/checkout', {
            state: {
              selectedProducts: location.state.selectedProducts,
              totalAmount: location.state.totalAmount
            }
          });
        } else if (redirectPath === '/order-tracking') {
          // Redirect về order tracking
          navigate('/order-tracking');
        } else if (redirectPath === '/profile') {
          // Redirect về profile
          navigate('/profile');
        } else {
          navigate('/');
        }
      }
    }
  }, [isSuccess, data, dispatch, navigate, location.state]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleGetDetailsUser = async (id, token) => {
    const res = await UserService.getDetailsUser(id, token)
    dispatch(updateUser({ ...res?.data, access_token: token }))
  }


  const handleOnchangeEmail = (value) => {
    setEmail(value);

  }
  const handleOnchangePassword = (value) => {
    setPassword(value);

  }
  const handleSignIn = () => {
    mutation.mutate({ email, password });
    console.log('sign-in', email, password)
  }

  const handleGoogleLogin = async (credentialResponse) => {
    const res = await UserService.googleLoginUser(credentialResponse.credential);
    if (res?.access_token) {
      localStorage.setItem('access_token', JSON.stringify(res.access_token));
      localStorage.setItem('auth_session', 'active');
      const decoded = jwtDecode(res.access_token);
      if (decoded?.id) {
        dispatch(updateUser({ ...decoded, access_token: res.access_token }));
        handleGetDetailsUser(decoded.id, res.access_token);
      }
      const redirectPath = location.state?.from;
      if (redirectPath === '/checkout' && location.state?.selectedProducts) {
        navigate('/checkout', { state: { selectedProducts: location.state.selectedProducts, totalAmount: location.state.totalAmount } });
      } else if (redirectPath === '/order-tracking') {
        navigate('/order-tracking');
      } else if (redirectPath === '/profile') {
        navigate('/profile');
      } else {
        navigate('/');
      }
    }
  }


  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.53)', height: '100vh' }}>
      <div style={{ width: '800px', height: '445px', borderRadius: '8px', background: '#fff', display: 'flex' }}>
        <WrapperContainerLeft>
          <WrapperH1>Hello</WrapperH1>
          <WrapperP>Sign in or create an account</WrapperP>
          <InputForm style={{ marginBottom: '10px' }} placeholder="abc@gmail.com" value={email} onChange={handleOnchangeEmail} />
          <div style={{ position: 'relative', marginBottom: '10px' }}>
            <InputForm
              placeholder="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={handleOnchangePassword}
            />
            <span
              style={{
                position: 'absolute',
                right: 10,
                top: '50%',
                transform: 'translateY(-50%)',
                cursor: 'pointer',
                fontSize: '18px'
              }}
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeFilled /> : <EyeInvisibleFilled />}
            </span>
          </div>
          {data?.status === 'ERR' && (
            <span style={{ color: 'red', fontSize: 12, marginTop: 8 }}>
              {data?.message}
            </span>
          )}
          <Loading isLoading={isPending && email.length > 0 && password.length > 0}>
            <Button
              disabled={!email.length || !password.length}
              onClick={handleSignIn}
              style={{
                backgroundColor: (!email.length || !password.length) ? '#ccc' : 'rgb(255, 57, 69)',
                height: '48px',
                width: '100%',
                border: 'none',
                borderRadius: '4px',
                color: '#fff',
                fontSize: '15px',
                fontWeight: '700',
                margin: '26px 0 10px'
              }}
            >
              Sign in
            </Button>
          </Loading>

          <WrapperTextLight
            onClick={() => setShowResetModal(true)}
            style={{ cursor: 'pointer', textDecoration: 'underline' }}
          >
            Forgot your password?
          </WrapperTextLight>
          <div style={{ display: 'flex', alignItems: 'center', margin: '12px 0', gap: '8px' }}>
            <div style={{ flex: 1, height: '1px', background: '#e0e0e0' }} />
            <span style={{ color: '#999', fontSize: '13px', whiteSpace: 'nowrap' }}>or</span>
            <div style={{ flex: 1, height: '1px', background: '#e0e0e0' }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <GoogleLogin
              onSuccess={handleGoogleLogin}
              onError={() => console.log('Google Login Failed')}
              width="300"
              text="signin_with"
              shape="rectangular"
              locale="en"
            />
          </div>
          <WrapperP> Don't have an account? <WrapperTextLight onClick={handleNavigateSignup} style={{ cursor: 'pointer' }}> Create an account </WrapperTextLight></WrapperP>
        </WrapperContainerLeft>
        <WrapperContainerRight>
          <Image src={imageLogo} preview={false} alt="image logo" height="203px" width="203px" />
          <WrapperH4>Shopping at TechStore</WrapperH4>
        </WrapperContainerRight>
      </div>

      {/* Reset Password Modal */}
      <ResetPasswordModal
        visible={showResetModal}
        onClose={() => setShowResetModal(false)}
        onSuccess={() => {
          setShowResetModal(false);
          // Có thể thêm thông báo thành công ở đây
        }}
      />
    </div>
  )
}

export default SignInPage