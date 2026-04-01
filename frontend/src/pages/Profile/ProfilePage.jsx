import React, { useEffect, useState } from 'react'
import {
    WrapperContainer,
    WrapperContentProfile,
    WrapperHeader,
    WrapperInput,
    WrapperLabel,
    WrapperUploadFile,
    WrapperAvatarSection,
    WrapperInfoGrid,
    WrapperInfoCard,
    WrapperActionButtons
} from './style'

import { Button, Input } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import * as UserService from '../../service/UserService'
import { useMutationHooks } from '../../hooks/useMutationHook';
import Loading from '../../components/LoadingComponent/Loading';
import * as message from '../../components/Message/Message'
import { updateUser } from '../../redux/slides/userSlide'
import { UserOutlined, MailOutlined, PhoneOutlined, HomeOutlined, SaveOutlined, CameraOutlined } from '@ant-design/icons';
import { getBase64 } from '../../utils';
import { useLanguage } from '../../context/LanguageContext';

const ProfilePage = () => {
    const { t } = useLanguage();
    const user = useSelector((state) => state.user);
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [avatar, setAvatar] = useState('');
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Kiểm tra đăng nhập ngay khi component mount
    useEffect(() => {
        if (!user?.access_token) {
            message.error(t('profile.loginRequired'))
            navigate('/sign-in', {
                state: {
                    from: '/profile'
                }
            })
            return
        }
    }, [user?.access_token, navigate, t])

    const mutation = useMutationHooks(
        (data) => {
            const { id, access_token, ...rests } = data;
            UserService.updateUser(id, rests, access_token)
        }
    )
    const { isPending, isSuccess, isError } = mutation


    const handleOnchangeEmail = (value) => {
        setEmail(value);
    }
    const handleOnchangeName = (value) => {
        setName(value);
    }
    const handleOnchangePhone = (value) => {
        setPhone(value);
    }
    const handleOnchangeAddress = (value) => {
        setAddress(value);
    }
    const handleOnchangeAvatar = async ({ fileList }) => {
        const file = fileList[0];
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }
        setAvatar(file.preview)
    }
    const handleUpdate = () => {
        mutation.mutate({ id: user?.id, name, email, phone, address, avatar, access_token: user?.access_token });
    }
    const handleGetDetailsUser = React.useCallback(async (id, token) => {
        const res = await UserService.getDetailsUser(id, token);
        dispatch(updateUser({ ...res?.data, access_token: token }));
    }, [dispatch]);
    useEffect(() => {
        setEmail(user?.email);
        setName(user?.name);
        setPhone(user?.phone);
        setAddress(user?.address);
        setAvatar(user?.avatar);
    }, [user]);

    useEffect(() => {
        if (isSuccess) {
            message.success();
            handleGetDetailsUser(user?.id, user?.access_token);
        }
        else if (isError) {
            message.error();
        }
    }, [isSuccess, isError, handleGetDetailsUser, user?.id, user?.access_token]);


    return (
        <WrapperContainer>
            <WrapperHeader>
                <h1>{t('profile.title')}</h1>
                <p>{t('profile.subtitle')}</p>
            </WrapperHeader>

            <Loading isLoading={isPending}>
                <WrapperContentProfile>
                    <WrapperAvatarSection>
                        <div className="avatar-block">
                            <div className="avatar-wrapper">
                                {avatar ? (
                                    <img
                                        src={avatar}
                                        style={{
                                            height: '92px',
                                            width: '92px',
                                            borderRadius: '50%',
                                            objectFit: 'cover'
                                        }}
                                        alt="avatar"
                                    />
                                ) : (
                                    <div style={{
                                        height: '92px',
                                        width: '92px',
                                        borderRadius: '50%',
                                        background: 'linear-gradient(135deg, #1a94ff 0%, #0d7de8 100%)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '34px',
                                        color: '#fff',
                                        fontWeight: '700'
                                    }}>
                                        {name?.charAt(0)?.toUpperCase() || 'U'}
                                    </div>
                                )}
                            </div>

                            <div className="avatar-content">
                                <h3>{t('profile.avatarSectionTitle')}</h3>
                                <p>{t('profile.avatarSectionHint')}</p>
                            </div>
                        </div>

                        <div className="avatar-actions">
                            <WrapperUploadFile onChange={handleOnchangeAvatar} maxCount={1} showUploadList={false}>
                                <Button
                                    icon={<CameraOutlined />}
                                    size="large"
                                    className="outline-btn"
                                >
                                    {t('profile.changeAvatar')}
                                </Button>
                            </WrapperUploadFile>
                            <Button
                                className="update-btn"
                                icon={<SaveOutlined />}
                                onClick={handleUpdate}
                            >
                                {t('profile.saveAll')}
                            </Button>
                        </div>
                    </WrapperAvatarSection>

                    <WrapperInfoCard>
                        <div className="card-title">{t('profile.formTitle')}</div>
                        <WrapperInfoGrid>
                            <WrapperInput>
                                <WrapperLabel htmlFor="name">
                                    <UserOutlined /> {t('profile.fullName')}
                                </WrapperLabel>
                                <Input
                                    id="name"
                                    value={name}
                                    onChange={(e) => handleOnchangeName(e.target.value)}
                                    placeholder={t('profile.fullNamePlaceholder')}
                                    size="large"
                                    prefix={<UserOutlined style={{ color: '#8c8c8c' }} />}
                                />
                            </WrapperInput>

                            <WrapperInput>
                                <WrapperLabel htmlFor="email">
                                    <MailOutlined /> {t('profile.email')}
                                </WrapperLabel>
                                <Input
                                    id="email"
                                    value={email}
                                    onChange={(e) => handleOnchangeEmail(e.target.value)}
                                    placeholder={t('profile.emailPlaceholder')}
                                    size="large"
                                    prefix={<MailOutlined style={{ color: '#8c8c8c' }} />}
                                />
                            </WrapperInput>

                            <WrapperInput>
                                <WrapperLabel htmlFor="phone">
                                    <PhoneOutlined /> {t('profile.phone')}
                                </WrapperLabel>
                                <Input
                                    id="phone"
                                    value={phone}
                                    onChange={(e) => handleOnchangePhone(e.target.value)}
                                    placeholder={t('profile.phonePlaceholder')}
                                    size="large"
                                    prefix={<PhoneOutlined style={{ color: '#8c8c8c' }} />}
                                />
                            </WrapperInput>

                            <WrapperInput className="full-width">
                                <WrapperLabel htmlFor="address">
                                    <HomeOutlined /> {t('profile.address')}
                                </WrapperLabel>
                                <Input
                                    id="address"
                                    value={address}
                                    onChange={(e) => handleOnchangeAddress(e.target.value)}
                                    placeholder={t('profile.addressPlaceholder')}
                                    size="large"
                                    prefix={<HomeOutlined style={{ color: '#8c8c8c' }} />}
                                />
                            </WrapperInput>
                        </WrapperInfoGrid>
                    </WrapperInfoCard>

                    <WrapperActionButtons>
                        <Button
                            className="primary"
                            icon={<SaveOutlined />}
                            onClick={handleUpdate}
                        >
                            {t('profile.saveAll')}
                        </Button>
                        <Button
                            className="secondary"
                            onClick={() => navigate('/')}
                        >
                            {t('profile.backHome')}
                        </Button>
                    </WrapperActionButtons>
                </WrapperContentProfile>
            </Loading>
        </WrapperContainer>
    )
}

export default ProfilePage