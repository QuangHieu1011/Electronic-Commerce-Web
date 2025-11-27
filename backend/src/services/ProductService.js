const Product = require("../models/ProductModel");
const bcrypt = require("bcrypt");


const createProduct = (newProduct = {}) => {
    return new Promise(async (resolve, reject) => {
        const { name, image, type, price, countInStock, rating, description } = newProduct || {};

        try {
            const CheckProduct = await Product.findOne({
                name: name
            });
            if (CheckProduct != null) {
                resolve({
                    status: 'OK',
                    message: 'The name of product is already '
                });
            }

            const newProduct = await Product.create({
                name,
                image,
                type,
                price,
                countInStock,
                rating,
                description
            });

            if (newProduct) {
                resolve({
                    status: 'OK',
                    message: 'SUCCESS',
                    data: newProduct
                });
            } else {
                reject(new Error('Failed to create product'));
            }
        } catch (e) {
            reject(e);
        }
    });
};
const updateProduct = (id, data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const CheckProduct = await Product.findOne({ _id: id });
            if (CheckProduct === null) {
                resolve({
                    status: 'OK',
                    message: 'The product is not defined'
                });
            }

            const updatedProduct = await Product.findByIdAndUpdate(id, data, { new: true });

            resolve({
                status: 'OK',
                message: 'SUCCESS',
                data: updatedProduct
            });
        } catch (e) {
            reject(e);
        }
    });
};
const deleteProduct = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const CheckProduct = await Product.findOne({ _id: id });
            if (CheckProduct === null) {
                resolve({
                    status: 'OK',
                    message: 'The product is not defined'
                });
            }

            await Product.findByIdAndDelete(id);

            resolve({
                status: 'OK',
                message: 'Delete Product successfully',
            });
        } catch (e) {
            reject(e);
        }
    });
};
const getAllProduct = (search, limit, page, sort, filter) => {
    return new Promise(async (resolve, reject) => {
        try {
            let query = {};

            // Xử lý search - tìm theo name trong scope của type hiện tại
            if (search) {
                query.name = { '$regex': search, '$options': 'i' };
            }

            // Xử lý filter (type và các filter khác)
            if (filter && filter.length >= 2) {
                const label = filter[0];
                const filterValue = filter[1];

                if (label === 'type') {
                    // Type filter - quan trọng để scope search trong category
                    query[label] = { '$regex': filterValue, '$options': 'i' };
                } else {
                    // Các filter khác
                    query[label] = { '$regex': filterValue, '$options': 'i' };
                }
            }

            // Tạo query builder
            let queryBuilder = Product.find(query);

            // Áp dụng sort nếu có
            if (sort) {
                const objectSort = {};
                const sortField = sort[1];
                const sortOrder = sort[0] === 'asc' ? 1 : -1;
                objectSort[sortField] = sortOrder;

                console.log('=== SEARCH & SORT DEBUG ===');
                console.log('Search term:', search);
                console.log('Query filter:', query);
                console.log('Sort field:', sortField);
                console.log('Sort order:', sortOrder);

                queryBuilder = queryBuilder.sort(objectSort);
            }

            // Áp dụng pagination
            queryBuilder = queryBuilder.skip(limit * page).limit(limit);

            // Thực thi query
            const results = await queryBuilder;
            const totalProduct = await Product.countDocuments(query);

            console.log('Final results count:', results.length);
            if (search) {
                console.log('Search results for "' + search + '":', results.slice(0, 3).map(p => ({ name: p.name, type: p.type })));
            }

            resolve({
                status: 'OK',
                message: 'Get products success',
                data: results,
                total: totalProduct,
                pageCurrent: Number(page) + 1,
                totalPage: Math.ceil(totalProduct / limit)
            });
        } catch (e) {
            reject(e);
        }
    });
};
const getDetailsProduct = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const product = await Product.findOne({ _id: id });
            if (product === null) {
                resolve({
                    status: 'OK',
                    message: 'The product is not defined'
                });
            }

            resolve({
                status: 'OK',
                message: 'SUCCESS',
                data: product
            });
        } catch (e) {
            reject(e);
        }
    });
};
const deleteManyProduct = (ids) => {
    return new Promise(async (resolve, reject) => {
        try {
            await Product.deleteMany({ _id: ids });

            resolve({
                status: 'OK',
                message: 'Delete Product successfully',
            });
        } catch (e) {
            reject(e);
        }
    });
};
const getAllType = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const allType = await Product.distinct('type')
            resolve({
                status: 'OK',
                message: 'Get all product success',
                data: allType,
            });
        } catch (e) {
            reject(e);
        }
    });
};

const getFrequentlyBoughtTogether = (productId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const Order = require("../models/OrderProduct");
            
            // Tìm các đơn hàng có chứa sản phẩm này
            const orders = await Order.find({
                'orderItems.product._id': productId
            });

            if (!orders || orders.length === 0) {
                // Nếu không có đơn hàng, trả về sản phẩm cùng loại
                const currentProduct = await Product.findById(productId);
                if (currentProduct) {
                    const relatedProducts = await Product.find({
                        type: currentProduct.type,
                        _id: { $ne: productId }
                    }).limit(3);

                    return resolve({
                        status: 'OK',
                        message: 'Get related products success',
                        data: relatedProducts
                    });
                }
            }

            // Đếm frequency của các sản phẩm khác
            const productCount = {};
            orders.forEach(order => {
                order.orderItems.forEach(item => {
                    const itemProductId = item.product._id.toString();
                    if (itemProductId !== productId) {
                        productCount[itemProductId] = (productCount[itemProductId] || 0) + 1;
                    }
                });
            });

            // Lấy top 3 sản phẩm được mua cùng nhiều nhất
            const topProductIds = Object.entries(productCount)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 3)
                .map(([id]) => id);

            const recommendedProducts = await Product.find({
                _id: { $in: topProductIds }
            });

            resolve({
                status: 'OK',
                message: 'Get frequently bought together success',
                data: recommendedProducts
            });
        } catch (e) {
            reject(e);
        }
    });
};

module.exports = {
    createProduct,
    updateProduct,
    getDetailsProduct,
    deleteProduct,
    getAllProduct,
    deleteManyProduct,
    getAllType,
    getFrequentlyBoughtTogether
};