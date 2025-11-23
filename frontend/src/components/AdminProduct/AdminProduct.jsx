import React, { use, useEffect, useRef, useState } from 'react'
import { DeleteOutlined, EditOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons'
import { WrapperHeader, WrapperUploadFile } from './style'
import { Button, Checkbox, Form, Input, Modal, Select, Space } from 'antd'
import TableComponent from '../TableComponent/TableComponent'
import InputComponent from '../InputComponent/InputComponent'
import { getBase64, renderOption } from '../../utils'
import * as ProductService from '../../service/ProductService'
import { useMutationHooks } from '../../hooks/useMutationHook'
import Loading from '../LoadingComponent/Loading'
import { message } from 'antd'
import { useQuery } from '@tanstack/react-query'
import DrawerComponent from '../DrawerComponent/DrawerComponent'
import ModalComponent from '../ModalComponent/ModalComponent'







const AdminProduct = (props) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [rowSelected, setRowSelected] = useState('');
    const [isOpenDrawer, setIsOpenDrawer] = useState(false);
    const [isLoadingUpdate, setIsLoadingUpdate] = useState(false);
    const [isModalOpenDelete, setIsModalOpenDelete] = useState(false);
    const [typeSelect, setTypeSelect] = useState('');

    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef(null);


    const [stateProduct, setStateProduct] = useState({
        name: '',
        type: '',
        countInStock: '',
        price: '',
        rating: '',
        description: '',
        image: ''
    })

    const [stateProductDetails, setStateProductDetails] = useState({
        name: '',
        type: '',
        countInStock: '',
        price: '',
        rating: '',
        description: '',
        image: ''
    })
    const [form] = Form.useForm();
    const [formDetails] = Form.useForm();


    const mutation = useMutationHooks(
        (data) => {
            const { name, type, countInStock, price, rating, description, image } = data;
            const res = ProductService.createProduct({ name, type, countInStock, price, rating, description, image })
            return res;
        }
    )

    const mutationUpdate = useMutationHooks(
        (data) => {
            console.log('data', data)
            const { id, token, ...rests } = data;
            const res = ProductService.updateProduct(id, token, rests)
            return res;
        }
    )

    const mutationDeleted = useMutationHooks(
        (data) => {
            console.log('data', data)
            const { id, token } = data;
            const res = ProductService.deleteProduct(id, token)
            return res;
        }
    )
    const mutationDeletedMany = useMutationHooks(
        (data) => {
            const { token, ...ids } = data;
            const res = ProductService.deleteManyProducts(ids, token)
            return res;
        }
    )


    const { data, isPending, isSuccess, isError } = mutation
    const { data: dataUpdated, isPending: isPendingUpdated, isSuccess: isSuccessUpdated, isError: isErrorUpdated } = mutationUpdate
    const { data: dataDeleted, isPending: isPendingDeleted, isSuccess: isSuccessDeleted, isError: isErrorDeleted } = mutationDeleted
    const { data: dataDeletedMany, isPending: isPendingDeletedMany, isSuccess: isSuccessDeletedMany, isError: isErrorDeletedMany } = mutationDeletedMany


    const getAllProducts = async () => {
        const res = await ProductService.getAllProduct('', 1000) 
        return res;
    }
    const fetchAllTypeProduct = async () => {
        const res = await ProductService.getAllTypeProduct()
        return res;
    }


    const { isPending: isLoadingProduct, data: products, refetch } = useQuery({
        queryKey: ['products'],
        queryFn: getAllProducts,
    })
    const typeProduct = useQuery({
        queryKey: ['type-product'],
        queryFn: fetchAllTypeProduct,
    })

    const fetchGetDetailsProduct = async (rowSelected) => {
        const res = await ProductService.getDetailsProduct(rowSelected)
        if (res?.data) {
            setStateProductDetails({
                name: res?.data?.name,
                type: res?.data?.type,
                countInStock: res?.data?.countInStock,
                price: res?.data?.price,
                rating: res?.data?.rating,
                description: res?.data?.description,
                image: res?.data?.image
            })
        }
        setIsLoadingUpdate(false);
        return res;
    }
    console.log('stateProductDetails', stateProductDetails)

    useEffect(() => {
        if (isOpenDrawer) {
            formDetails.setFieldsValue(stateProductDetails)
        }
    }, [formDetails, stateProductDetails, isOpenDrawer])

    useEffect(() => {
        if (rowSelected) {
            fetchGetDetailsProduct(rowSelected);
        }
    }, [rowSelected])


    const handleDetailsProduct = async (productId = rowSelected) => {
        if (productId) {
            setIsLoadingUpdate(true);
            await fetchGetDetailsProduct(productId);
            setIsOpenDrawer(true);
        } else {
            console.log('Không có sản phẩm được chọn');
        }
    }
    const handleDeleteManyProducts = (ids) => {
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
                        handleDetailsProduct(record._id);
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
            sorter: (a, b) => a.name.length - b.name.length,
            ...getColumnSearchProps('name'),
        },
        {
            title: 'Price',
            dataIndex: 'price',
            sorter: (a, b) => a.price - b.price,
            filters: [
                {
                    text: '>= 50',
                    value: '>=',
                },
                {
                    text: '<= 50',
                    value: '<=',
                },
            ],

            onFilter: (value, record) => {
                if (value === '>=') {
                    return record.price >= 50;
                }
                return record.price <= 50;
            },
        },
        {
            title: 'Rating',
            dataIndex: 'rating',
            sorter: (a, b) => a.rating - b.rating,
            filters: [
                {
                    text: '>= 3',
                    value: '>=',
                },
                {
                    text: '<= 3',
                    value: '<=',
                },
            ],

            onFilter: (value, record) => {
                if (value === '>=') {
                    return record.rating >= 3;
                }
                return record.rating <= 3;
            },
        },
        {
            title: 'Type',
            dataIndex: 'type',
        },
        {
            title: 'Action',
            dataIndex: 'action',
            render: renderAction,
        },
    ];

    const dataTable = products?.data?.map((product) => {
        return {
            ...product,
            key: product._id
        }
    })



    useEffect(() => {
        if (isSuccess && data?.status === 'OK') {
            message.success('Thêm sản phẩm thành công!');
            handleCancel();
            refetch();
        }
        else if (isError) {
            message.error('Thêm sản phẩm thất bại!');
        }
    }, [isSuccess, isError, data, refetch])

    useEffect(() => {
        if (isSuccessDeletedMany && dataDeletedMany?.status === 'OK') {
            message.success('Xóa nhiều sản phẩm thành công!');
            refetch();
        }
        else if (isErrorDeletedMany) {
            message.error('Xóa nhiều sản phẩm thất bại!');
        }
    }, [isSuccessDeletedMany, isErrorDeletedMany, dataDeletedMany, refetch])

    useEffect(() => {
        if (isSuccessUpdated && dataUpdated?.status === 'OK') {
            message.success('Cập nhật sản phẩm thành công!');
            handleCloseDrawer();
            setRowSelected('');
            refetch();
        }
        else if (isErrorUpdated) {
            message.error('Cập nhật sản phẩm thất bại!');
        }
    }, [isSuccessUpdated, isErrorUpdated, dataUpdated, refetch])

    useEffect(() => {
        if (isSuccessDeleted && dataDeleted?.status === 'OK') {
            message.success('Xóa sản phẩm thành công!');
            handleCancelDelete();
            setRowSelected('');
            refetch();
        }
        else if (isErrorDeleted) {
            message.error('Xóa sản phẩm thất bại!');
        }
    }, [isSuccessDeleted, isErrorDeleted, dataDeleted, refetch])



    const handleCloseDrawer = () => {
        setIsOpenDrawer(false);
        setStateProductDetails({
            name: '',
            type: '',
            countInStock: '',
            price: '',
            rating: '',
            description: '',
            image: ''
        })
        formDetails.resetFields();
    }
    const handleCancelDelete = () => {
        setIsModalOpenDelete(false);
    }
    const handleDeleteProduct = () => {
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


    const handleCancel = () => {
        setIsModalOpen(false);
        setStateProduct({
            name: '',
            type: '',
            countInStock: '',
            price: '',
            rating: '',
            description: '',
            image: ''
        })
        setTypeSelect(''); 
        form.resetFields();
    };
    const onFinish = () => {
        mutation.mutate(stateProduct);
    }

    const handleonchange = (e) => {
        setStateProduct({
            ...stateProduct,
            [e.target.name]: e.target.value
        })
    }
    const handleonchangeDetails = (e) => {
        setStateProductDetails({
            ...stateProductDetails,
            [e.target.name]: e.target.value
        })
    }
    const handleOnchangeAvatar = async ({ fileList }) => {
        const file = fileList[0];
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }
        setStateProduct({
            ...stateProduct,
            image: file.preview
        })
    }
    const handleOnchangeAvatarDetails = async ({ fileList }) => {
        const file = fileList[0];
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }
        setStateProductDetails({
            ...stateProductDetails,
            image: file.preview
        })
    }
    const onUpdateProduct = async () => {
        let access_token = localStorage.getItem('access_token');
        if (access_token && access_token.startsWith('"')) {
            access_token = JSON.parse(access_token);
        }
        mutationUpdate.mutate({
            id: rowSelected,
            token: access_token,
            ...stateProductDetails
        })
    }
    const handleChangeSelect = (value) => {
        console.log('Selected value:', value);

        if (value !== 'add-type') {
        
            setStateProduct({
                ...stateProduct,
                type: value
            });
            setTypeSelect(''); 
        } else {
            
            setTypeSelect(value);
            setStateProduct({
                ...stateProduct,
                type: '' 
            });
        }
    }


    return (
        <div>
            <WrapperHeader> Quản lí Sản Phẩm</WrapperHeader>
            <div style={{ marginTop: '10px' }}>
                <Button style={{ height: '150px', width: '150px', borderRadius: '6px', borderStyle: 'dashed' }} onClick={() => {
                    setIsModalOpen(true);
                    setStateProduct({
                        name: '',
                        type: '',
                        countInStock: '',
                        price: '',
                        rating: '',
                        description: '',
                        image: ''
                    });
                    setTypeSelect(''); 
                    form.resetFields();
                }}> <PlusOutlined style={{ fontSize: '60px' }} /> </Button>
            </div>
            <div style={{ marginTop: '20px' }}>
                <TableComponent handleDeleteManyProducts={handleDeleteManyProducts} columns={columns} data={dataTable} isLoading={isLoadingProduct} onRow={(record, rowIndex) => {
                    return {
                        onClick: event => {
                            setRowSelected(record._id)
                        }
                    }
                }} />
            </div>
            <ModalComponent
                title="Thêm Sản Phẩm Mới"
                isOpen={isModalOpen}
                onCancel={handleCancel}
                footer={null}
            >
                <Loading isLoading={isPending}>
                    <Form
                        name="createProduct"
                        labelCol={{ span: 6 }}
                        wrapperCol={{ span: 18 }}
                        style={{ maxWidth: 600 }}
                        onFinish={onFinish}
                        autoComplete="on"
                        form={form}
                    >
                        <Form.Item
                            label="Name"
                            name="name"
                            rules={[{ required: true, message: 'Please input your name!' }]}
                        >
                            <InputComponent value={stateProduct.name} onChange={handleonchange} name="name" />
                        </Form.Item>

                        <Form.Item
                            label="Type"
                            name="type"
                            rules={[{ required: true, message: 'Please input your type!' }]}
                        >

                            <Select
                                name="type"
                                value={typeSelect === 'add-type' ? 'add-type' : stateProduct.type}
                                onChange={handleChangeSelect}
                                placeholder="Chọn loại sản phẩm"
                                options={renderOption(typeProduct?.data?.data)}
                            />
                            {typeSelect === 'add-type' && (
                                <InputComponent
                                    value={stateProduct.type}
                                    onChange={handleonchange}
                                    name="type"
                                    placeholder="Nhập loại sản phẩm mới"
                                    style={{ marginTop: '8px' }}
                                />
                            )}
                        </Form.Item>

                        <Form.Item
                            label="Count inStock"
                            name="countInStock"
                            rules={[{ required: true, message: 'Please input your count inStock!' }]}
                        >
                            <InputComponent value={stateProduct.countInStock} onChange={handleonchange} name="countInStock" />
                        </Form.Item>

                        <Form.Item
                            label="Price"
                            name="price"
                            rules={[{ required: true, message: 'Please input your price!' }]}
                        >
                            <InputComponent value={stateProduct.price} onChange={handleonchange} name="price" />
                        </Form.Item>

                        <Form.Item
                            label="Rating"
                            name="rating"
                            rules={[{ required: true, message: 'Please input your rating!' }]}
                        >
                            <InputComponent value={stateProduct.rating} onChange={handleonchange} name="rating" />
                        </Form.Item>

                        <Form.Item
                            label="Description"
                            name="description"
                            rules={[{ required: true, message: 'Please input your description!' }]}
                        >
                            <InputComponent value={stateProduct.description} onChange={handleonchange} name="description" />
                        </Form.Item>

                        <Form.Item
                            label="Image"
                            name="image"
                            rules={[{ required: true, message: 'Please input your image!' }]}
                        >
                            <WrapperUploadFile onChange={handleOnchangeAvatar} maxCount={1}>
                                <Button>Select File</Button>
                                {stateProduct?.image && (
                                    <img src={stateProduct?.image} style={{
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
                                Submit
                            </Button>
                        </Form.Item>

                    </Form>
                </Loading>
            </ModalComponent>
            <DrawerComponent title='Chi tiết sản phẩm ' isOpen={isOpenDrawer} onClose={() => setIsOpenDrawer(false)} width="90%">
                <Loading isLoading={isLoadingUpdate || isPendingUpdated}>
                    <Form
                        name="updateProduct"
                        labelCol={{ span: 2 }}
                        wrapperCol={{ span: 22 }}
                        onFinish={onUpdateProduct}
                        autoComplete="on"
                        form={formDetails}
                    >
                        <Form.Item
                            label="Name"
                            name="name"
                            rules={[{ required: true, message: 'Please input your name!' }]}
                        >
                            <InputComponent value={stateProductDetails.name} onChange={handleonchangeDetails} name="name" />
                        </Form.Item>

                        <Form.Item
                            label="Type"
                            name="type"
                            rules={[{ required: true, message: 'Please input your type!' }]}
                        >
                            <InputComponent value={stateProductDetails.type} onChange={handleonchangeDetails} name="type" />
                        </Form.Item>

                        <Form.Item
                            label="Count inStock"
                            name="countInStock"
                            rules={[{ required: true, message: 'Please input your count inStock!' }]}
                        >
                            <InputComponent value={stateProductDetails.countInStock} onChange={handleonchangeDetails} name="countInStock" />
                        </Form.Item>

                        <Form.Item
                            label="Price"
                            name="price"
                            rules={[{ required: true, message: 'Please input your price!' }]}
                        >
                            <InputComponent value={stateProductDetails.price} onChange={handleonchangeDetails} name="price" />
                        </Form.Item>

                        <Form.Item
                            label="Rating"
                            name="rating"
                            rules={[{ required: true, message: 'Please input your rating!' }]}
                        >
                            <InputComponent value={stateProductDetails.rating} onChange={handleonchangeDetails} name="rating" />
                        </Form.Item>

                        <Form.Item
                            label="Description"
                            name="description"
                            rules={[{ required: true, message: 'Please input your description!' }]}
                        >
                            <InputComponent value={stateProductDetails.description} onChange={handleonchangeDetails} name="description" />
                        </Form.Item>

                        <Form.Item
                            label="Image"
                            name="image"
                            rules={[{ required: true, message: 'Please input your image!' }]}
                        >
                            <WrapperUploadFile onChange={handleOnchangeAvatarDetails} maxCount={1}>
                                <Button>Select File</Button>
                                {stateProductDetails?.image && (
                                    <img src={stateProductDetails?.image} style={{
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
                title="Xóa sản phẩm"
                isOpen={isModalOpenDelete}
                onCancel={handleCancelDelete}
                onOk={handleDeleteProduct}
            >
                <Loading isLoading={isPendingDeleted}>
                    <div>
                        Bạn có chắc chắn muốn xóa sản phẩm này không?
                    </div>
                </Loading>
            </ModalComponent>
        </div>
    )
}

export default AdminProduct