import React, { useEffect, useState } from 'react'
import { EyeFilled, EyeInvisibleFilled, MailOutlined, SafetyOutlined } from '@ant-design/icons';
import { WrapperContainerLeft, WrapperContainerRight, WrapperH1, WrapperH4, WrapperP, WrapperTextLight } from './style'
import InputForm from '../../components/InputForm/InputForm'
import { Button, Image, message as antdMessage } from 'antd'
import imageLogo from '../../assets/images/Logo_Login.png'
import { useNavigate } from 'react-router-dom'
import * as OTPService from '../../service/OTPService'
import { useMutationHooks } from '../../hooks/useMutationHook';
import Loading from '../../components/LoadingComponent/Loading';
import * as message from '../../components/Message/Message'
import OTPModal from '../../components/OTPModal/OTPModal'

const SignUpPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [showOTPModal, setShowOTPModal] = useState(false);
  const [isOTPVerified, setIsOTPVerified] = useState(false);
  const [sendingOTP, setSendingOTP] = useState(false);

  const navigate = useNavigate()

  const handleNavigateSignin = React.useCallback(() => {
    navigate('/sign-in')
  }, [navigate]);


  const mutation = useMutationHooks(
    data => OTPService.signUpWithOTP(data)
  )
  const { data, isPending, isSuccess, isError } = mutation
  console.log('mutation', mutation)

  useEffect(() => {
    if (isSuccess) {
      if (data?.status === 'OK') {
        message.success(data?.message || 'Success');
        handleNavigateSignin();
      } else {
        message.error(data?.message || 'Error');
      }
    } else if (isError) {
      message.error(data?.message || 'Error');
    }
  }, [isSuccess, isError, handleNavigateSignin, data?.message, data?.status]);


  const handleOnchangeEmail = (value) => {
    setEmail(value);
    setIsOTPVerified(false); // Reset OTP verification when email changes
  }
  const handleOnchangePassword = (value) => {
    setPassword(value);
  }
  const handleOnchangeConfirmPassword = (value) => {
    setConfirmPassword(value);
  }

  const handleOnchangeName = (value) => {
    setName(value);
  }

  const handleOnchangePhone = (value) => {
    setPhone(value);
  }

  const handleSendOTP = async () => {
    if (!email) {
      antdMessage.error('Please enter email first!');
      return;
    }

    setSendingOTP(true);
    try {
      const response = await OTPService.sendSignupOTP(email);
      if (response.status === 'OK') {
        antdMessage.success('An OTP has been sent to your email!');
        setShowOTPModal(true);
      } else {
        antdMessage.error(response.message);
      }
    } catch (error) {
      antdMessage.error(error.response?.data?.message || 'An error occurred');
    } finally {
      setSendingOTP(false);
    }
  }

  const handleOTPSuccess = (data) => {
    setIsOTPVerified(true);
    setShowOTPModal(false);
    antdMessage.success('Email verified successfully!');
  }

  const handleSignUp = () => {
    if (!isOTPVerified) {
      antdMessage.error('Please verify your email before signing up!');
      return;
    }

    mutation.mutate({
      name,
      email,
      password,
      confirmPassword,
      phone,
      isOTPVerified
    });
  }



  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.53)', height: '100vh' }}>
      <div style={{ width: '800px', height: '445px', borderRadius: '8px', background: '#fff', display: 'flex' }}>
        <WrapperContainerLeft>
          <WrapperH1>Hello</WrapperH1>
          <WrapperP>Register a new account</WrapperP>

          <InputForm
            style={{ marginBottom: '10px' }}
            placeholder="Full name"
            value={name}
            onChange={handleOnchangeName}
          />

          <div style={{ display: 'flex', gap: '10px', marginBottom: '10px', alignItems: 'center' }}>
            <InputForm
              placeholder="abc@gmail.com"
              value={email}
              onChange={handleOnchangeEmail}
              style={{ flex: 1 }}
            />
            <Button
              type={isOTPVerified ? "default" : "primary"}
              onClick={handleSendOTP}
              loading={sendingOTP}
              disabled={!email || isOTPVerified}
              style={{
                height: '40px',
                minWidth: '120px',
                backgroundColor: isOTPVerified ? '#52c41a' : undefined,
                borderColor: isOTPVerified ? '#52c41a' : undefined,
                color: isOTPVerified ? '#fff' : undefined
              }}
            >
              {isOTPVerified ? (
                <>
                  <SafetyOutlined /> Verified
                </>
              ) : (
                <>
                  <MailOutlined /> Send OTP
                </>
              )}
            </Button>
          </div>

          <InputForm
            style={{ marginBottom: '10px' }}
            placeholder="Phone number"
            value={phone}
            onChange={handleOnchangePhone}
          />

          <div style={{ position: 'relative', marginBottom: '10px' }}>
            <InputForm
              placeholder="Password"
              type={showPassword ? "text" : "password"}
              value={password} onChange={handleOnchangePassword}
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
          <div style={{ position: 'relative', marginBottom: '10px' }}>
            <InputForm
              placeholder="Confirm password"
              type={showConfirm ? "text" : "password"}
              value={confirmPassword} onChange={handleOnchangeConfirmPassword}
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
              onClick={() => setShowConfirm(!showConfirm)}
            >
              {showConfirm ? <EyeFilled /> : <EyeInvisibleFilled />}
            </span>
          </div>
          {data?.status === 'ERR' && (
            <span style={{ color: 'red', fontSize: 12, marginTop: 8 }}>
              {data?.message}
            </span>
          )}
          <Loading isLoading={isPending}>
            <Button
              disabled={!name.length || !email.length || !password.length || !confirmPassword.length || !isOTPVerified}
              onClick={handleSignUp}
              style={{
                backgroundColor: (!name.length || !email.length || !password.length || !confirmPassword.length || !isOTPVerified) ? '#ccc' : 'rgb(255, 57, 69)',
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
              Sign up
            </Button>
          </Loading>
          <WrapperP> Already have an account? <WrapperTextLight onClick={handleNavigateSignin} style={{ cursor: 'pointer' }}> Sign in </WrapperTextLight></WrapperP>
        </WrapperContainerLeft>
        <WrapperContainerRight>
          <Image src={imageLogo} preview={false} alt="image logo" height="203px" width="203px" />
          <WrapperH4>Shopping at TechStore</WrapperH4>
        </WrapperContainerRight>
      </div>

      {/* OTP Modal */}
      <OTPModal
        visible={showOTPModal}
        onClose={() => setShowOTPModal(false)}
        onSuccess={handleOTPSuccess}
        email={email}
        type="signup"
        title="Verify registration email"
      />
    </div>
  )
}

export default SignUpPage