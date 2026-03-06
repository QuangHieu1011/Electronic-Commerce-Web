import styled from 'styled-components'

export const WrapperFooter = styled.footer`
    background: #1f2937;
    color: #d1d5db;
    margin-top: auto;
    width: 100%;
`

export const WrapperFooterContent = styled.div`
    max-width: 1440px;
    margin: 0 auto;
    padding: 50px 120px;
    display: grid;
    grid-template-columns: 2fr 1fr 1fr 1.5fr;
    gap: 40px;

    @media (max-width: 1200px) {
        padding: 40px 60px;
        grid-template-columns: repeat(2, 1fr);
        gap: 30px;
    }

    @media (max-width: 768px) {
        padding: 30px 20px;
        grid-template-columns: 1fr;
        gap: 25px;
    }
`

export const WrapperFooterSection = styled.div`
    h3 {
        font-size: 24px;
        font-weight: 700;
        color: #fff;
        margin-bottom: 16px;
    }

    h4 {
        font-size: 16px;
        font-weight: 600;
        color: #fff;
        margin-bottom: 16px;
        text-transform: uppercase;
        letter-spacing: 0.5px;
    }

    p {
        font-size: 14px;
        line-height: 1.6;
        margin-bottom: 20px;
        color: #9ca3af;
    }

    ul {
        list-style: none;
        padding: 0;
        margin: 0;

        li {
            margin-bottom: 12px;
            font-size: 14px;
            transition: all 0.3s;

            a {
                color: #9ca3af;
                text-decoration: none;
                transition: all 0.3s;

                &:hover {
                    color: #1a94ff;
                    padding-left: 5px;
                }
            }
        }

        &.contact {
            li {
                display: flex;
                align-items: flex-start;
                gap: 10px;
                color: #9ca3af;

                .anticon {
                    color: #1a94ff;
                    font-size: 16px;
                    margin-top: 2px;
                }

                span {
                    flex: 1;
                }
            }
        }
    }
`

export const WrapperSocialLinks = styled.div`
    display: flex;
    gap: 12px;

    a {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background: #374151;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #9ca3af;
        font-size: 18px;
        transition: all 0.3s;

        &:hover {
            background: #1a94ff;
            color: #fff;
            transform: translateY(-3px);
        }
    }
`

export const WrapperFooterBottom = styled.div`
    border-top: 1px solid #374151;
    padding: 20px 120px;
    text-align: center;
    max-width: 1440px;
    margin: 0 auto;

    p {
        margin: 0;
        font-size: 14px;
        color: #6b7280;
    }

    @media (max-width: 1200px) {
        padding: 20px 60px;
    }

    @media (max-width: 768px) {
        padding: 20px;
    }
`
