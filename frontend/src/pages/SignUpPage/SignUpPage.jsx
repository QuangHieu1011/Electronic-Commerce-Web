import React, { useState } from 'react'
import { EyeFilled, EyeInvisibleFilled } from '@ant-design/icons';
import { WrapperContainerLeft, WrapperContainerRight, WrapperH1, WrapperH4, WrapperP, WrapperTextLight } from './style'
import InputForm from '../../components/InputForm/InputForm'
import { Button, Image } from 'antd'
import imageLogo from '../../assets/images/Logo_Login.png'
import { useNavigate } from 'react-router-dom'

const SignUpPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');


  const handleOnchangeEmail = (value) => {
        setEmail(value);

  }
   const handleOnchangePassword = (value) => {
        setPassword(value);

  }
   const handleOnchangeConfirmPassword = (value) => {
        setConfirmPassword(value);

  }
  const handleSignUp = () => {
    console.log('sign-up', email, password, confirmPassword);
  }


  const navigate = useNavigate();
  const handleNavigateSignin = () => {
      navigate('/sign-in')
  }
  return (
    <div style={{display:'flex', alignItems:'center',justifyContent:'center',background:'rgba(0,0,0,0.53)', height:'100vh'}}>
        <div style={{width:'800px', height:'445px',borderRadius:'8px',background:'#fff', display:'flex'}}>
          <WrapperContainerLeft>
            <WrapperH1>Xin chào</WrapperH1>
            <WrapperP>Đăng nhập hoặc tạo tài khoản </WrapperP>
            <InputForm style={{ marginBottom:'10px' }} placeholder="abc@gmail.com" value={email} onChange={handleOnchangeEmail} />
            <div style={{ position: 'relative', marginBottom: '10px' }}>
              <InputForm
                placeholder="password"
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
            <Button
                  disabled={!email.length || !password.length || !confirmPassword.length}
                  onClick={handleSignUp}
                  style={{
                    backgroundColor: (!email.length || !password.length || !confirmPassword.length) ? '#ccc' : 'rgb(255, 57, 69)',
                    height: '48px',
                    width: '100%',
                    border: 'none',
                    borderRadius: '4px',
                    color: '#fff', 
                    fontSize: '15px', 
                    fontWeight: '700',
                    margin:'26px 0 10px'
                  }}
                >
                  Đăng ký
            </Button>
            <WrapperP> Bạn đã có tài khoản? <WrapperTextLight onClick={handleNavigateSignin} style ={{ cursor: 'pointer'}}> Đăng nhập </WrapperTextLight></WrapperP>
          </WrapperContainerLeft>
          <WrapperContainerRight>
            <Image src={imageLogo} preview={false} alt ="image logo" height="203px" width="203px"/>
            <WrapperH4>Mua sắm tại TechStore</WrapperH4>
          </WrapperContainerRight>
        </div>
    </div>
  )
}

export default SignUpPage