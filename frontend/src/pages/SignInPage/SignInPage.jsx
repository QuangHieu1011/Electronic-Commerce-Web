import React, { useState } from 'react'
import { WrapperContainerLeft, WrapperContainerRight, WrapperH1, WrapperH4, WrapperP, WrapperTextLight } from './style'
import InputForm from '../../components/InputForm/InputForm'
import { Button, Image } from 'antd'
import imageLogo from '../../assets/images/Logo_Login.png'
import { useNavigate } from 'react-router-dom'
import { EyeFilled, EyeInvisibleFilled } from '@ant-design/icons';



const SignInPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');

   const handleOnchangeEmail = (value) => {
        setEmail(value);

  }
   const handleOnchangePassword = (value) => {
        setPassword(value);

  }
  const handleSignIn = () => {
    console.log('sign-in', email, password)
  }

  const navigate = useNavigate();
  const handleNavigateSignup = () => {
      navigate('/sign-up')
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
            <Button
                  disabled={!email.length || !password.length }
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
                    margin:'26px 0 10px'
                  }}
                >
                  Đăng nhập
            </Button>
            <WrapperTextLight> Quên mật khẩu?</WrapperTextLight>
            <WrapperP> Chưa có tài khoản? <WrapperTextLight onClick={handleNavigateSignup} style ={{ cursor: 'pointer'}}> Tạo tài khoản </WrapperTextLight></WrapperP>
          </WrapperContainerLeft>
          <WrapperContainerRight>
            <Image src={imageLogo} preview={false} alt ="image logo" height="203px" width="203px"/>
            <WrapperH4>Mua sắm tại TechStore</WrapperH4>
          </WrapperContainerRight>
        </div>
    </div>
  )
}

export default SignInPage