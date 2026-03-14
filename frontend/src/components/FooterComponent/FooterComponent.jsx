import React from 'react'
import { 
    WrapperFooter, 
    WrapperFooterContent, 
    WrapperFooterSection,
    WrapperFooterBottom,
    WrapperSocialLinks
} from './style'
import { 
    MailOutlined, 
    PhoneOutlined, 
    EnvironmentOutlined,
    FacebookOutlined,
    TwitterOutlined,
    InstagramOutlined,
    YoutubeOutlined
} from '@ant-design/icons'

const FooterComponent = () => {
    return (
        <WrapperFooter>
            <WrapperFooterContent>
                <WrapperFooterSection>
                    <h3>TECHSTORE</h3>
                    <p>Cửa hàng điện tử uy tín, chất lượng hàng đầu Việt Nam</p>
                    <WrapperSocialLinks>
                        <a href="#" aria-label="Facebook"><FacebookOutlined /></a>
                        <a href="#" aria-label="Twitter"><TwitterOutlined /></a>
                        <a href="#" aria-label="Instagram"><InstagramOutlined /></a>
                        <a href="#" aria-label="Youtube"><YoutubeOutlined /></a>
                    </WrapperSocialLinks>
                </WrapperFooterSection>

                <WrapperFooterSection>
                    <h4>Về chúng tôi</h4>
                    <ul>
                        <li><a href="#">Giới thiệu</a></li>
                        <li><a href="#">Tuyển dụng</a></li>
                        <li><a href="#">Tin tức</a></li>
                        <li><a href="#">Hệ thống cửa hàng</a></li>
                    </ul>
                </WrapperFooterSection>

                <WrapperFooterSection>
                    <h4>Chính sách</h4>
                    <ul>
                        <li><a href="#">Chính sách bảo hành</a></li>
                        <li><a href="#">Chính sách đổi trả</a></li>
                        <li><a href="#">Chính sách bảo mật</a></li>
                        <li><a href="#">Điều khoản sử dụng</a></li>
                    </ul>
                </WrapperFooterSection>

                <WrapperFooterSection>
                    <h4>Liên hệ</h4>
                    <ul className="contact">
                        <li>
                            <PhoneOutlined /> 
                            <span>1900 xxxx</span>
                        </li>
                        <li>
                            <MailOutlined /> 
                            <span>support@techstore.vn</span>
                        </li>
                        <li>
                            <EnvironmentOutlined /> 
                            <span>123 Đường ABC, Quận 1, TP.HCM</span>
                        </li>
                    </ul>
                </WrapperFooterSection>
            </WrapperFooterContent>

            <WrapperFooterBottom>
                <p>&copy; 2026 TechStore. All rights reserved.</p>
            </WrapperFooterBottom>
        </WrapperFooter>
    )
}

export default FooterComponent
