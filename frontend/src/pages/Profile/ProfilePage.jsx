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
import InputForm from '../../components/InputForm/InputForm'
import { Button, Upload, Input, Divider } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import * as UserService from '../../service/UserService'
import { useMutationHooks } from '../../hooks/useMutationHook';
import Loading from '../../components/LoadingComponent/Loading';
import * as message from '../../components/Message/Message'
import { updateUser } from '../../redux/slides/userSlide'
import { UploadOutlined, UserOutlined, MailOutlined, PhoneOutlined, HomeOutlined, SaveOutlined, CameraOutlined } from '@ant-design/icons';
import { getBase64 } from '../../utils';

const ProfilePage = () => {
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
            message.error('Vui lòng đăng nhập để xem thông tin cá nhân!')
            navigate('/sign-in', {
                state: {
                    from: '/profile'
                }
            })
            return
        }
    }, [user?.access_token, navigate])

    const mutation = useMutationHooks(
        (data) => {
            const { id, access_token, ...rests } = data;
            UserService.updateUser(id, rests, access_token)
        }
    )
    const { data, isPending, isSuccess, isError } = mutation


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
    const handleGetDetailsUser = async (id, token) => {
        const res = await UserService.getDetailsUser(id, token)
        dispatch(updateUser({ ...res?.data, access_token: token }))

    }
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
    }, [isSuccess, isError]);


    return (
        <WrapperContainer>
            <WrapperHeader>
                <h1>Thông tin cá nhân</h1>
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
                                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
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
                                    marginTop: '20px',
                                    borderRadius: '24px',
                                    padding: '0 32px',
                                    height: '48px',
                                    fontSize: '15px',
                                    fontWeight: '600',
                                    border: '2px solid #667eea',
                                    color: '#667eea'
                                }}
                            >
                                Thay đổi ảnh đại diện
                            </Button>
                        </WrapperUploadFile>
                    </WrapperAvatarSection>

                    {/* Info Grid */}
                    <WrapperInfoGrid>
                        {/* Name Card */}
                        <WrapperInfoCard>
                            <WrapperInput>
                                <WrapperLabel htmlFor="name">
                                    <UserOutlined /> Họ và tên
                                </WrapperLabel>
                                <div className="input-group">
                                    <Input
                                        id="name"
                                        value={name}
                                        onChange={(e) => handleOnchangeName(e.target.value)}
                                        placeholder="Nhập họ và tên"
                                        size="large"
                                        prefix={<UserOutlined style={{ color: '#8c8c8c' }} />}
                                    />
                                    <Button onClick={handleUpdate}>
                                        Lưu
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
                                        placeholder="Nhập email"
                                        size="large"
                                        prefix={<MailOutlined style={{ color: '#8c8c8c' }} />}
                                    />
                                    <Button onClick={handleUpdate}>
                                        Lưu
                                    </Button>
                                </div>
                            </WrapperInput>
                        </WrapperInfoCard>

                        {/* Phone Card */}
                        <WrapperInfoCard>
                            <WrapperInput>
                                <WrapperLabel htmlFor="phone">
                                    <PhoneOutlined /> Số điện thoại
                                </WrapperLabel>
                                <div className="input-group">
                                    <Input
                                        id="phone"
                                        value={phone}
                                        onChange={(e) => handleOnchangePhone(e.target.value)}
                                        placeholder="Nhập số điện thoại"
                                        size="large"
                                        prefix={<PhoneOutlined style={{ color: '#8c8c8c' }} />}
                                    />
                                    <Button onClick={handleUpdate}>
                                        Lưu
                                    </Button>
                                </div>
                            </WrapperInput>
                        </WrapperInfoCard>

                        {/* Address Card */}
                        <WrapperInfoCard>
                            <WrapperInput>
                                <WrapperLabel htmlFor="address">
                                    <HomeOutlined /> Địa chỉ
                                </WrapperLabel>
                                <div className="input-group">
                                    <Input
                                        id="address"
                                        value={address}
                                        onChange={(e) => handleOnchangeAddress(e.target.value)}
                                        placeholder="Nhập địa chỉ"
                                        size="large"
                                        prefix={<HomeOutlined style={{ color: '#8c8c8c' }} />}
                                    />
                                    <Button onClick={handleUpdate}>
                                        Lưu
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
                            Lưu tất cả thay đổi
                        </Button>
                        <Button 
                            className="secondary"
                            onClick={() => navigate('/')}
                        >
                            Quay về trang chủ
                        </Button>
                    </WrapperActionButtons>
                </WrapperContentProfile>
            </Loading>
        </WrapperContainer>
    )
}

export default ProfilePage