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
import { useLanguage } from '../../context/LanguageContext'

const FooterComponent = () => {
    const { t } = useLanguage()

    return (
        <WrapperFooter>
            <WrapperFooterContent>
                <WrapperFooterSection>
                    <h3>TECHSTORE</h3>
                    <p>{t('footer.description')}</p>
                    <WrapperSocialLinks>
                        <a href="#" aria-label="Facebook"><FacebookOutlined /></a>
                        <a href="#" aria-label="Twitter"><TwitterOutlined /></a>
                        <a href="#" aria-label="Instagram"><InstagramOutlined /></a>
                        <a href="#" aria-label="Youtube"><YoutubeOutlined /></a>
                    </WrapperSocialLinks>
                </WrapperFooterSection>

                <WrapperFooterSection>
                    <h4>{t('footer.aboutUs')}</h4>
                    <ul>
                        <li><a href="#">{t('footer.introduction')}</a></li>
                        <li><a href="#">{t('footer.careers')}</a></li>
                        <li><a href="#">{t('footer.news')}</a></li>
                        <li><a href="#">{t('footer.storeSystem')}</a></li>
                    </ul>
                </WrapperFooterSection>

                <WrapperFooterSection>
                    <h4>{t('footer.policy')}</h4>
                    <ul>
                        <li><a href="#">{t('footer.warrantyPolicy')}</a></li>
                        <li><a href="#">{t('footer.returnPolicy')}</a></li>
                        <li><a href="#">{t('footer.privacyPolicy')}</a></li>
                        <li><a href="#">{t('footer.terms')}</a></li>
                    </ul>
                </WrapperFooterSection>

                <WrapperFooterSection>
                    <h4>{t('footer.contact')}</h4>
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
                            <span>{t('footer.address')}</span>
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
