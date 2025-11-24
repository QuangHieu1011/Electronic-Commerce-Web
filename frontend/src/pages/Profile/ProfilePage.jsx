import React, { useEffect, useState } from 'react'
import { WrapperContentProfile, WrapperHeader, WrapperInput, WrapperLabel, WrapperUploadFile } from './style'
import InputForm from '../../components/InputForm/InputForm'
import { Button, Upload } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import * as UserService from '../../service/UserService'
import { useMutationHooks } from '../../hooks/useMutationHook';
import Loading from '../../components/LoadingComponent/Loading';
import * as message from '../../components/Message/Message'
import { updateUser } from '../../redux/slides/userSlide'
import { UploadOutlined } from '@ant-design/icons';
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
        <div style={{ width: '1270px', margin: '0 auto', height: '500vh' }}>
            <WrapperHeader>Thông tin người dùng</WrapperHeader>
            <Loading isLoading={isPending}>
                <WrapperContentProfile>
                    <WrapperInput>
                        <WrapperLabel htmlFor="name">Name</WrapperLabel>
                        <InputForm style={{ width: '300px' }} id="name" value={name} onChange={handleOnchangeName} />
                        <Button
                            onClick={handleUpdate}
                            style={{
                                height: '30px',
                                width: 'fit-content',
                                borderRadius: '4px',
                                color: 'rgb(26, 148, 255)',
                                fontSize: '15px',
                                fontWeight: '700',
                                padding: '2px 6px 6px',
                            }}
                        >
                            Cập nhật
                        </Button>
                    </WrapperInput>
                    <WrapperInput>
                        <WrapperLabel htmlFor="email">Email</WrapperLabel>
                        <InputForm style={{ width: '300px' }} id="email" value={email} onChange={handleOnchangeEmail} />
                        <Button
                            onClick={handleUpdate}
                            style={{
                                height: '30px',
                                width: 'fit-content',
                                borderRadius: '4px',
                                color: 'rgb(26, 148, 255)',
                                fontSize: '15px',
                                fontWeight: '700',
                                padding: '2px 6px 6px',
                            }}
                        >
                            Cập nhật
                        </Button>
                    </WrapperInput>
                    <WrapperInput>
                        <WrapperLabel htmlFor="phone">Phone</WrapperLabel>
                        <InputForm style={{ width: '300px' }} id="phone" value={phone} onChange={handleOnchangePhone} />
                        <Button
                            onClick={handleUpdate}
                            style={{
                                height: '30px',
                                width: 'fit-content',
                                borderRadius: '4px',
                                color: 'rgb(26, 148, 255)',
                                fontSize: '15px',
                                fontWeight: '700',
                                padding: '2px 6px 6px',
                            }}
                        >
                            Cập nhật
                        </Button>
                    </WrapperInput>
                    <WrapperInput>
                        <WrapperLabel htmlFor="address">Address</WrapperLabel>
                        <InputForm style={{ width: '300px' }} id="address" value={address} onChange={handleOnchangeAddress} />
                        <Button
                            onClick={handleUpdate}
                            style={{
                                height: '30px',
                                width: 'fit-content',
                                borderRadius: '4px',
                                color: 'rgb(26, 148, 255)',
                                fontSize: '15px',
                                fontWeight: '700',
                                padding: '2px 6px 6px',
                            }}
                        >
                            Cập nhật
                        </Button>
                    </WrapperInput>
                    <WrapperInput>
                        <WrapperLabel htmlFor="avatar">Avatar</WrapperLabel>
                        <WrapperUploadFile onChange={handleOnchangeAvatar} maxCount={1}>
                            <Button icon={<UploadOutlined />}>Select File</Button>
                        </WrapperUploadFile>
                        {avatar && (
                            <img src={avatar} style={{
                                height: '60px',
                                width: '60px',
                                borderRadius: '50%',
                                objectFit: 'cover'
                            }} alt="avatar" />
                        )}
                        {/* <InputForm style={{width: '300px'}}  id="avatar" value={avatar} onChange={handleOnchangeAvatar} /> */}
                        <Button
                            onClick={handleUpdate}
                            style={{
                                height: '30px',
                                width: 'fit-content',
                                borderRadius: '4px',
                                color: 'rgb(26, 148, 255)',
                                fontSize: '15px',
                                fontWeight: '700',
                                padding: '2px 6px 6px',
                            }}
                        >
                            Cập nhật
                        </Button>
                    </WrapperInput>
                </WrapperContentProfile>
            </Loading>
        </div>
    )
}

export default ProfilePage