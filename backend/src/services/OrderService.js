const Product = require("../models/ProductModel");
const Order = require("../models/OrderProduct");

/**
 * Kiểm tra và trừ kho hàng một cách an toàn (atomic)
 * @param {Array} orderItems - Danh sách sản phẩm đặt hàng [{ productId, quantity }]
 * @returns {Promise<{success: boolean, message: string, insufficientProducts?: Array}>}
 */
async function checkAndDecrementStock(orderItems) {
    const insufficientProducts = [];
    // Sử dụng session để đảm bảo atomic (MongoDB transaction)
    const session = await Product.startSession();
    session.startTransaction();
    try {
        for (const item of orderItems) {
            const product = await Product.findById(item.productId).session(session);
            if (!product || product.countInStock < item.quantity) {
                insufficientProducts.push({
                    productId: item.productId,
                    name: product ? product.name : 'Unknown',
                    available: product ? product.countInStock : 0,
                    requested: item.quantity
                });
            } else {
                product.countInStock -= item.quantity;
                await product.save({ session });
            }
        }
        if (insufficientProducts.length > 0) {
            await session.abortTransaction();
            session.endSession();
            return { success: false, message: 'Không đủ hàng', insufficientProducts };
        }
        await session.commitTransaction();
        session.endSession();
        return { success: true, message: 'Đặt hàng thành công' };
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        return { success: false, message: 'Lỗi xử lý kho', error };
    }
}

module.exports = {
    checkAndDecrementStock
};
