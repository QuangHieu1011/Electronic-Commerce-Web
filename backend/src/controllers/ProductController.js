const ProductService = require('../services/ProductService')


const createProduct = async (req, res) => {
    try {
        const body = req.body || {};
        const { name, image, type, price, countInStock, rating, description } = body;


        if (!name || !image || !type || !price || !countInStock || !rating) {
            return res.status(400).json({
                status: 'ERR',
                message: 'The input is required'
            });
        }
        const response = await ProductService.createProduct(body);
        return res.status(200).json(response);
    } catch (e) {
        return res.status(500).json({
            status: 'ERR',
            message: e.message || e
        });
    }
};
const updateProduct = async (req, res) => {
    try {
        const ProductId = req.params.id;
        const data = req.body;
        if (!ProductId) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The ProductId is required'
            });
        }

        const response = await ProductService.updateProduct(ProductId, data);
        return res.status(200).json(response);
    } catch (e) {
        return res.status(404).json({
            message: e
        });
    }
};
const getDetailsProduct = async (req, res) => {
    try {
        const ProductId = req.params.id;
        if (!ProductId) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The ProductId is required'
            });
        }

        const response = await ProductService.getDetailsProduct(ProductId);
        return res.status(200).json(response);
    } catch (e) {
        return res.status(404).json({
            message: e
        });
    }
};
const deleteProduct = async (req, res) => {
    try {
        const ProductId = req.params.id;
        if (!ProductId) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The ProductId is required'
            });
        }

        const response = await ProductService.deleteProduct(ProductId);
        return res.status(200).json(response);
    } catch (e) {
        return res.status(404).json({
            message: e
        });
    }
};
const getAllProduct = async (req, res) => {
    try {
        const { search, limit, page, sort, filter } = req.query;
        console.log('=== GET ALL PRODUCTS REQUEST ===');
        console.log('Query params:', req.query);
        console.log('Parsed - search:', search, 'limit:', Number(limit) || 8, 'page:', Number(page) || 0, 'sort:', sort, 'filter:', filter);

        const response = await ProductService.getAllProduct(search, Number(limit) || 8, Number(page) || 0, sort, filter);
        return res.status(200).json(response);
    } catch (e) {
        return res.status(404).json({
            message: e
        });
    }
};
const deleteMany = async (req, res) => {
    try {
        const ids = req.body.ids
        if (!ids) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The ids is required'
            });
        }

        const response = await ProductService.deleteManyProduct(ids);
        return res.status(200).json(response);
    } catch (e) {
        return res.status(404).json({
            message: e
        });
    }
};
const getAllType = async (req, res) => {
    try {
        const response = await ProductService.getAllType()
        return res.status(200).json(response);
    } catch (e) {
        return res.status(404).json({
            message: e
        });
    }
};

const getFrequentlyBoughtTogether = async (req, res) => {
    try {
        const productId = req.params.id;
        if (!productId) {
            return res.status(400).json({
                status: 'ERR',
                message: 'Product ID is required'
            });
        }

        const response = await ProductService.getFrequentlyBoughtTogether(productId);
        return res.status(200).json(response);
    } catch (e) {
        return res.status(500).json({
            status: 'ERR',
            message: e.message || e
        });
    }
};

module.exports = {
    createProduct,
    updateProduct,
    getDetailsProduct,
    deleteProduct,
    getAllProduct,
    deleteMany,
    getAllType,
    getFrequentlyBoughtTogether
};