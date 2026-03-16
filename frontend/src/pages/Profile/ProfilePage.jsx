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
            </WrapperHeader>

            <Loading isLoading={isPending}>
                <WrapperContentProfile>
                    {/* Avatar Section */}
                    <WrapperAvatarSection>
                        <div className="avatar-wrapper">
                            {avatar ? (
                                <img
                                    src={avatar}
                                    style={{
                                        height: '140px',
                                        width: '140px',
                                        borderRadius: '50%',
                                        objectFit: 'cover'
                                    }}
                                    alt="avatar"
                                />
                            ) : (
                                <div style={{
                                    height: '140px',
                                    width: '140px',
                                    borderRadius: '50%',
                                    background: '#1a94ff',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '48px',
                                    color: '#fff',
                                    fontWeight: '700'
                                }}>
                                    {name?.charAt(0)?.toUpperCase() || 'U'}
                                </div>
                            )}
                        </div>

                        <WrapperUploadFile onChange={handleOnchangeAvatar} maxCount={1} showUploadList={false}>
                            <Button
                                icon={<CameraOutlined />}
                                size="large"
                                style={{
                                    marginTop: '18px',
                                    borderRadius: '8px',
                                    padding: '0 24px',
                                    height: '44px',
                                    fontSize: '14px',
                                    fontWeight: '600',
                                    border: '1px solid #1a94ff',
                                    color: '#1a94ff'
                                }}
                            >
                                {t('profile.changeAvatar')}
                            </Button>
                        </WrapperUploadFile>
                    </WrapperAvatarSection>

                    {/* Info Grid */}
                    <WrapperInfoGrid>
                        {/* Name Card */}
                        <WrapperInfoCard>
                            <WrapperInput>
                                <WrapperLabel htmlFor="name">
                                    <UserOutlined /> {t('profile.fullName')}
                                </WrapperLabel>
                                <div className="input-group">
                                    <Input
                                        id="name"
                                        value={name}
                                        onChange={(e) => handleOnchangeName(e.target.value)}
                                        placeholder={t('profile.fullNamePlaceholder')}
                                        size="large"
                                        prefix={<UserOutlined style={{ color: '#8c8c8c' }} />}
                                    />
                                    <Button onClick={handleUpdate}>
                                        {t('profile.save')}
                                    </Button>
                                </div>
                            </WrapperInput>
                        </WrapperInfoCard>

                        {/* Email Card */}
                        <WrapperInfoCard>
                            <WrapperInput>
                                <WrapperLabel htmlFor="email">
                                    <MailOutlined /> Email
                                </WrapperLabel>
                                <div className="input-group">
                                    <Input
                                        id="email"
                                        value={email}
                                        onChange={(e) => handleOnchangeEmail(e.target.value)}
                                        placeholder={t('profile.emailPlaceholder')}
                                        size="large"
                                        prefix={<MailOutlined style={{ color: '#8c8c8c' }} />}
                                    />
                                    <Button onClick={handleUpdate}>
                                        {t('profile.save')}
                                    </Button>
                                </div>
                            </WrapperInput>
                        </WrapperInfoCard>

                        {/* Phone Card */}
                        <WrapperInfoCard>
                            <WrapperInput>
                                <WrapperLabel htmlFor="phone">
                                    <PhoneOutlined /> {t('profile.phone')}
                                </WrapperLabel>
                                <div className="input-group">
                                    <Input
                                        id="phone"
                                        value={phone}
                                        onChange={(e) => handleOnchangePhone(e.target.value)}
                                        placeholder={t('profile.phonePlaceholder')}
                                        size="large"
                                        prefix={<PhoneOutlined style={{ color: '#8c8c8c' }} />}
                                    />
                                    <Button onClick={handleUpdate}>
                                        {t('profile.save')}
                                    </Button>
                                </div>
                            </WrapperInput>
                        </WrapperInfoCard>

                        {/* Address Card */}
                        <WrapperInfoCard>
                            <WrapperInput>
                                <WrapperLabel htmlFor="address">
                                    <HomeOutlined /> {t('profile.address')}
                                </WrapperLabel>
                                <div className="input-group">
                                    <Input
                                        id="address"
                                        value={address}
                                        onChange={(e) => handleOnchangeAddress(e.target.value)}
                                        placeholder={t('profile.addressPlaceholder')}
                                        size="large"
                                        prefix={<HomeOutlined style={{ color: '#8c8c8c' }} />}
                                    />
                                    <Button onClick={handleUpdate}>
                                        {t('profile.save')}
                                    </Button>
                                </div>
                            </WrapperInput>
                        </WrapperInfoCard>
                    </WrapperInfoGrid>

                    {/* Action Buttons */}
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