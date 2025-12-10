import React, { useEffect, useRef, useState } from 'react'
import { DeleteOutlined, EditOutlined, SearchOutlined } from '@ant-design/icons'
import { WrapperHeader, WrapperUploadFile } from './style'
import { Button, Form, Space } from 'antd'
import TableComponent from '../TableComponent/TableComponent'
import InputComponent from '../InputComponent/InputComponent'
import DrawerComponent from '../DrawerComponent/DrawerComponent'
import Loading from '../LoadingComponent/Loading'
import ModalComponent from '../ModalComponent/ModalComponent'

import { message } from 'antd'
import { useMutationHooks } from '../../hooks/useMutationHook'
import * as UserService from '../../service/UserService'
import { useQuery } from '@tanstack/react-query'
import { getBase64 } from '../../utils'


const AdminUser = (props) => {
  const [rowSelected, setRowSelected] = useState('');
  const [isOpenDrawer, setIsOpenDrawer] = useState(false);
  const [isLoadingUpdate, setIsLoadingUpdate] = useState(false);
  const [isModalOpenDelete, setIsModalOpenDelete] = useState(false);


  const searchInput = useRef(null);



  const [stateUserDetails, setStateUserDetails] = useState({
    name: '',
    email: '',
    phone: '',
    isAdmin: false,
    avatar: '',
    address: ''

  })
  const [formDetails] = Form.useForm();


  const mutationUpdate = useMutationHooks(
    (data) => {
      console.log('data', data)
      const { id, token, ...rests } = data;
      const res = UserService.updateUser(id, rests, token)
      return res;
    }
  )

  const mutationDeleted = useMutationHooks(
    (data) => {
      console.log('data', data)
      const { id, token } = data;
      const res = UserService.deleteUser(id, token)
      return res;
    }
  )

  const mutationDeletedMany = useMutationHooks(
    (data) => {
      const { token, ...ids } = data;
      const res = UserService.deleteManyUser(ids, token)
      return res;
    }
  )

  const { data: dataUpdated, isPending: isPendingUpdated, isSuccess: isSuccessUpdated, isError: isErrorUpdated } = mutationUpdate
  const { data: dataDeleted, isPending: isPendingDeleted, isSuccess: isSuccessDeleted, isError: isErrorDeleted } = mutationDeleted
  const { data: dataDeletedMany, isSuccess: isSuccessDeletedMany, isError: isErrorDeletedMany } = mutationDeletedMany

  const getAllUsers = async () => {
    let access_token = localStorage.getItem('access_token');
    if (access_token && access_token.startsWith('"')) {
      access_token = JSON.parse(access_token);
    }
    const res = await UserService.getAllUser(access_token);
    return res;
  }


  const { isPending: isLoadingUsers, data: users, refetch } = useQuery({
    queryKey: ['users'],
    queryFn: getAllUsers,
  })

  const fetchGetDetailsUser = async (rowSelected) => {
    let access_token = localStorage.getItem('access_token');
    if (access_token && access_token.startsWith('"')) {
      access_token = JSON.parse(access_token);
    }
    const res = await UserService.getDetailsUser(rowSelected, access_token)
    if (res?.data) {
      setStateUserDetails({
        name: res?.data?.name,
        email: res?.data?.email,
        phone: res?.data?.phone,
        isAdmin: res?.data?.isAdmin,
        address: res?.data?.address,
        avatar: res?.data?.avatar
      })
    }
    setIsLoadingUpdate(false);
    return res;
  }

  useEffect(() => {
    if (isOpenDrawer) {
      formDetails.setFieldsValue(stateUserDetails)
    }
  }, [formDetails, stateUserDetails, isOpenDrawer])

  useEffect(() => {
    if (rowSelected) {
      fetchGetDetailsUser(rowSelected);
    }
  }, [rowSelected])


  const handleDetailsUser = async (userId = rowSelected) => {
    if (userId) {
      setIsLoadingUpdate(true);
      await fetchGetDetailsUser(userId);
      setIsOpenDrawer(true);
    } else {
      console.log('Không có người dùng được chọn');
    }
  }

  const handleDeleteManyUsers = (ids) => {
    const access_token = localStorage.getItem('access_token');
    let token = access_token;
    if (token && token.startsWith('"')) {
      token = JSON.parse(token);
    }

    mutationDeletedMany.mutate({
      ids: ids,
      token: token
    });
  }

  const renderAction = (text, record) => {
    return (
      <div>
        <DeleteOutlined
          style={{ color: 'red', fontSize: '30px', cursor: 'pointer' }}
          onClick={() => {
            setRowSelected(record._id);
            setIsModalOpenDelete(true);
          }}
        />
        <EditOutlined
          style={{ color: 'orange', fontSize: '30px', cursor: 'pointer' }}
          onClick={() => {
            setRowSelected(record._id);
            handleDetailsUser(record._id);
          }}
        />
      </div>
    )
  }

  const handleSearch = (
    selectedKeys,
    confirm,
    dataIndex,
  ) => {
    confirm();
  };

  const handleReset = (clearFilters) => {
    clearFilters();
  };

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
        <InputComponent
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined style={{ color: filtered ? '#1677ff' : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        .toString()
        .toLowerCase()
        .includes(value.toLowerCase()),
    filterDropdownProps: {
      onOpenChange(open) {
        if (open) {
          setTimeout(() => searchInput.current?.select(), 100);
        }
      },
    },
  });


  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      sorter: (a, b) => (a.name || '').length - (b.name || '').length,
      ...getColumnSearchProps('name'),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      sorter: (a, b) => (a.email || '').length - (b.email || '').length,
      ...getColumnSearchProps('email'),
    },
    {
      title: 'Address',
      dataIndex: 'address',
      sorter: (a, b) => (a.address || '').length - (b.address || '').length,
      ...getColumnSearchProps('address'),
    },
    {
      title: 'Admin',
      dataIndex: 'isAdmin',
      filters: [
        {
          text: 'True',
          value: true,
        },
        {
          text: 'False',
          value: false,
        },
      ],
      onFilter: (value, record) => {
        return record.isAdmin === value;
      },
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
      sorter: (a, b) => (a.phone || '').length - (b.phone || '').length,
      ...getColumnSearchProps('phone'),
    },
    {
      title: 'Action',
      dataIndex: 'action',
      render: renderAction,
    },
  ];

  const dataTable = users?.data?.map((user) => {
    return {
      ...user,
      key: user._id,
      isAdmin: user.isAdmin ? 'True' : 'False',
    }
  })





  const handleCloseDrawer = React.useCallback(() => {
    setIsOpenDrawer(false);
    setStateUserDetails({
      name: '',
      email: '',
      phone: '',
      isAdmin: false,
    });
    formDetails.resetFields();
  }, [formDetails]);


  useEffect(() => {
    if (isSuccessUpdated && dataUpdated?.status === 'OK') {
      message.success('Cập nhật người dùng thành công!');
      handleCloseDrawer();
      setRowSelected('');
      refetch();
    }
    else if (isErrorUpdated) {
      message.error('Cập nhật người dùng thất bại!');
    }
  }, [isSuccessUpdated, isErrorUpdated, dataUpdated, refetch, handleCloseDrawer])

  useEffect(() => {
    if (isSuccessDeleted && dataDeleted?.status === 'OK') {
      message.success('Xóa người dùng thành công!');
      handleCancelDelete();
      setRowSelected('');
      refetch();
    }
    else if (isErrorDeleted) {
      message.error('Xóa người dùng thất bại!');
    }
  }, [isSuccessDeleted, isErrorDeleted, dataDeleted, refetch])

  useEffect(() => {
    if (isSuccessDeletedMany && dataDeletedMany?.status === 'OK') {
      message.success('Xóa nhiều người dùng thành công!');
      refetch();
    }
    else if (isErrorDeletedMany) {
      message.error('Xóa nhiều người dùng thất bại!');
    }
  }, [isSuccessDeletedMany, isErrorDeletedMany, dataDeletedMany, refetch])



  const handleCancelDelete = () => {
    setIsModalOpenDelete(false);
  }
  const handleDeleteUser = () => {
    const access_token = localStorage.getItem('access_token');
    let token = access_token;
    if (token && token.startsWith('"')) {
      token = JSON.parse(token);
    }
    mutationDeleted.mutate({
      id: rowSelected,
      token: token
    });
  }



  const handleonchangeDetails = (e) => {
    setStateUserDetails({
      ...stateUserDetails,
      [e.target.name]: e.target.value
    })
  }
  const handleOnchangeAvatarDetails = async ({ fileList }) => {
    const file = fileList[0];
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setStateUserDetails({
      ...stateUserDetails,
      avatar: file.preview
    })

  }


  const onUpdateUser = async () => {
    let access_token = localStorage.getItem('access_token');
    if (access_token && access_token.startsWith('"')) {
      access_token = JSON.parse(access_token);
    }
    mutationUpdate.mutate({
      id: rowSelected,
      token: access_token,
      ...stateUserDetails
    })
  }
  return (
    <div>
      <WrapperHeader> Quản lí Người Dùng</WrapperHeader>

      <div style={{ marginTop: '10px' }}>
        <TableComponent handleDeleteManyUsers={handleDeleteManyUsers} columns={columns} data={dataTable} isLoading={isLoadingUsers} onRow={(record, rowIndex) => {
          return {
            onClick: event => {
              setRowSelected(record._id)
            }
          }
        }} />
      </div>

      <DrawerComponent title='Chi tiết người dùng ' isOpen={isOpenDrawer} onClose={() => setIsOpenDrawer(false)} width="90%">
        <Loading isLoading={isLoadingUpdate || isPendingUpdated}>
          <Form
            name="updateUser"
            labelCol={{ span: 2 }}
            wrapperCol={{ span: 22 }}
            onFinish={onUpdateUser}
            autoComplete="on"
            form={formDetails}
          >
            <Form.Item
              label="Name"
              name="name"
              rules={[{ required: true, message: 'Please input your name!' }]}
            >
              <InputComponent value={stateUserDetails.name} onChange={handleonchangeDetails} name="name" />
            </Form.Item>

            <Form.Item
              label="Email"
              name="email"
              rules={[{ required: true, message: 'Please input your email!' }]}
            >
              <InputComponent value={stateUserDetails.email} onChange={handleonchangeDetails} name="email" />
            </Form.Item>

            <Form.Item
              label="Phone"
              name="phone"
              rules={[{ required: true, message: 'Please input your phone!' }]}
            >
              <InputComponent value={stateUserDetails.phone} onChange={handleonchangeDetails} name="phone" />
            </Form.Item>

            <Form.Item
              label="Address"
              name="address"
              rules={[{ required: true, message: 'Please input your address!' }]}
            >
              <InputComponent value={stateUserDetails.address} onChange={handleonchangeDetails} name="address" />
            </Form.Item>

            <Form.Item
              label="Avatar"
              name="avatar"
              rules={[{ required: true, message: 'Please input your avatar!' }]}
            >
              <WrapperUploadFile
                onChange={handleOnchangeAvatarDetails}
                maxCount={1}
                fileList={stateUserDetails.avatar ? [{
                  uid: '-1',
                  name: 'avatar.png',
                  status: 'done',
                  url: stateUserDetails.avatar,
                }] : []}
              >
                <Button>Select File</Button>
                {stateUserDetails?.avatar && (
                  <img src={stateUserDetails?.avatar} style={{
                    height: '60px',
                    width: '60px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    marginLeft: '10px'
                  }} alt="avatar" />
                )}
              </WrapperUploadFile>
            </Form.Item>



            <Form.Item label={null} wrapperCol={{ offset: 20, span: 16 }}>
              <Button type="primary" htmlType="submit">
                Apply
              </Button>
            </Form.Item>

          </Form>
        </Loading>
      </DrawerComponent>
      <ModalComponent
        title="Xóa người dùng"
        isOpen={isModalOpenDelete}
        onCancel={handleCancelDelete}
        onOk={handleDeleteUser}
      >
        <Loading isLoading={isPendingDeleted}>
          <div>
            Bạn có chắc chắn muốn xóa tài khoản này không?
          </div>
        </Loading>
      </ModalComponent>
    </div>
  )
}

export default AdminUser