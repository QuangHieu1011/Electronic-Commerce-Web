const PromotionService = require('../services/PromotionService');

const createPromotion = async (req, res) => {
    try {
        const { name, discountPercent, startDate, endDate } = req.body;
        if (!name || !discountPercent || !startDate || !endDate) {
            return res.status(400).json({ status: 'ERR', message: 'name, discountPercent, startDate, endDate là bắt buộc' });
        }
        const response = await PromotionService.createPromotion(req.body);
        return res.status(200).json(response);
    } catch (e) {
        return res.status(500).json({ status: 'ERR', message: e.message || e });
    }
};

const getAllPromotions = async (req, res) => {
    try {
        const response = await PromotionService.getAllPromotions();
        return res.status(200).json(response);
    } catch (e) {
        return res.status(500).json({ status: 'ERR', message: e.message || e });
    }
};

const getPromotionById = async (req, res) => {
    try {
        const { id } = req.params;
        const response = await PromotionService.getPromotionById(id);
        return res.status(200).json(response);
    } catch (e) {
        return res.status(500).json({ status: 'ERR', message: e.message || e });
    }
};

const updatePromotion = async (req, res) => {
    try {
        const { id } = req.params;
        const response = await PromotionService.updatePromotion(id, req.body);
        return res.status(200).json(response);
    } catch (e) {
        return res.status(500).json({ status: 'ERR', message: e.message || e });
    }
};

const togglePromotionActive = async (req, res) => {
    try {
        const { id } = req.params;
        const response = await PromotionService.togglePromotionActive(id);
        return res.status(200).json(response);
    } catch (e) {
        return res.status(500).json({ status: 'ERR', message: e.message || e });
    }
};

const deletePromotion = async (req, res) => {
    try {
        const { id } = req.params;
        const response = await PromotionService.deletePromotion(id);
        return res.status(200).json(response);
    } catch (e) {
        return res.status(500).json({ status: 'ERR', message: e.message || e });
    }
};

module.exports = {
    createPromotion,
    getAllPromotions,
    getPromotionById,
    updatePromotion,
    togglePromotionActive,
    deletePromotion,
};
