const Promotion = require('../models/PromotionModel');
const Product = require('../models/ProductModel');

// Lấy danh sách sản phẩm thỏa mãn điều kiện target của promotion
const getTargetProductQuery = (promotion) => {
    const { targetType, productTypes, productIds } = promotion;
    if (targetType === 'all') return {};
    if (targetType === 'byType') return { type: { $in: productTypes } };
    if (targetType === 'byIds') return { _id: { $in: productIds } };
    return {};
};

// Áp dụng discount lên sản phẩm
const applyDiscount = async (promotion) => {
    const query = getTargetProductQuery(promotion);
    await Product.updateMany(query, { $set: { discount: promotion.discountPercent } });
};

// Gỡ discount khỏi sản phẩm (reset về 0)
const removeDiscount = async (promotion) => {
    const query = getTargetProductQuery(promotion);
    await Product.updateMany(query, { $set: { discount: 0 } });
};

const createPromotion = async (data) => {
    try {
        const { name, description, discountPercent, targetType, productTypes, productIds, startDate, endDate, isActive } = data;
        const promotion = await Promotion.create({
            name, description, discountPercent, targetType,
            productTypes: productTypes || [],
            productIds: productIds || [],
            startDate, endDate,
            isActive: isActive || false,
        });
        if (promotion.isActive) {
            await applyDiscount(promotion);
        }
        return { status: 'OK', message: 'SUCCESS', data: promotion };
    } catch (e) {
        return { status: 'ERR', message: e.message || e };
    }
};

const getAllPromotions = async () => {
    try {
        const promotions = await Promotion.find().sort({ createdAt: -1 });
        return { status: 'OK', data: promotions };
    } catch (e) {
        return { status: 'ERR', message: e.message || e };
    }
};

const getPromotionById = async (id) => {
    try {
        const promotion = await Promotion.findById(id);
        if (!promotion) return { status: 'ERR', message: 'Không tìm thấy khuyến mãi' };
        return { status: 'OK', data: promotion };
    } catch (e) {
        return { status: 'ERR', message: e.message || e };
    }
};

const updatePromotion = async (id, data) => {
    try {
        const existing = await Promotion.findById(id);
        if (!existing) return { status: 'ERR', message: 'Không tìm thấy khuyến mãi' };

        // Nếu promotion đang active, gỡ discount cũ trước khi cập nhật
        if (existing.isActive) {
            await removeDiscount(existing);
        }

        const updated = await Promotion.findByIdAndUpdate(id, { $set: data }, { new: true });

        // Nếu sau cập nhật vẫn active, áp discount mới
        if (updated.isActive) {
            await applyDiscount(updated);
        }

        return { status: 'OK', message: 'Cập nhật thành công', data: updated };
    } catch (e) {
        return { status: 'ERR', message: e.message || e };
    }
};

const togglePromotionActive = async (id) => {
    try {
        const promotion = await Promotion.findById(id);
        if (!promotion) return { status: 'ERR', message: 'Không tìm thấy khuyến mãi' };

        const newActive = !promotion.isActive;
        promotion.isActive = newActive;
        await promotion.save();

        if (newActive) {
            await applyDiscount(promotion);
        } else {
            await removeDiscount(promotion);
        }

        return {
            status: 'OK',
            message: newActive ? 'Đã kích hoạt khuyến mãi' : 'Đã tắt khuyến mãi',
            data: promotion,
        };
    } catch (e) {
        return { status: 'ERR', message: e.message || e };
    }
};

const deletePromotion = async (id) => {
    try {
        const promotion = await Promotion.findById(id);
        if (!promotion) return { status: 'ERR', message: 'Không tìm thấy khuyến mãi' };

        // Gỡ discount trước khi xóa nếu đang active
        if (promotion.isActive) {
            await removeDiscount(promotion);
        }

        await Promotion.findByIdAndDelete(id);
        return { status: 'OK', message: 'Xóa khuyến mãi thành công' };
    } catch (e) {
        return { status: 'ERR', message: e.message || e };
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
