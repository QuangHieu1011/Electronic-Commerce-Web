import React from 'react'
import { WrapperContainerLeft, WrapperContainerRight, WrapperH1, WrapperH4, WrapperP, WrapperTextLight } from './style'
import InputForm from '../../components/InputForm/InputForm'
import { Button, Image } from 'antd'
import imageLogo from '../../assets/images/Logo_Login.png'

const SignUpPage = () => {
  return (
    <div style={{display:'flex', alignItems:'center',justifyContent:'center',background:'rgba(0,0,0,0.53)', height:'100vh'}}>
        <div style={{width:'800px', height:'445px',borderRadius:'8px',background:'#fff', display:'flex'}}>
          <WrapperContainerLeft>
            <WrapperH1>Xin chào</WrapperH1>
            <WrapperP>Đăng nhập hoặc tạo tài khoản </WrapperP>
            <InputForm style={{ marginBottom:'10px' }} placeholder="abc@gmail.com" />
            <InputForm style={{ marginBottom:'10px' }} placeholder="password"/>
            <InputForm placeholder="Confirm password"/>
            <Button
                  style={{
                    backgroundColor: 'rgb(255, 57, 69)',
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
            <WrapperP> Bạn đã có tài khoản? <WrapperTextLight> Đăng ký </WrapperTextLight></WrapperP>
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