const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema({
    orderItems: [
        {
            quantity: { type: Number, required: true },
            product: {
                _id: { type: String, required: true },
                name: { type: String, required: true },
                image: { type: String, required: true },
                price: { type: Number, required: true },
                discount: { type: Number, default: 0 },
                countInStock: { type: Number, required: true },
                type: { type: String, required: true }
            }
        },
    ],
    shippingInfo: {
        fullName: { type: String, required: true },
        phone: { type: String, required: true },
        address: { type: String, required: true },
        ward: { type: String, required: true },
        district: { type: String, required: true },
        province: { type: String, required: true },
        note: { type: String, default: '' }
    },
    userInfo: {
        id: { type: String },
        name: { type: String },
        email: { type: String }
    },
    paymentMethod: { type: String, required: true, enum: ['cod', 'banking', 'credit', 'paypal'], default: 'cod' },
    totalAmount: { type: Number, required: true },
    voucher: {
        code: { type: String, default: null },
        title: { type: String, default: null },
        discountType: { type: String, enum: ['shipping', 'fixed', 'percent'], default: null },
        discountValue: { type: Number, default: 0 },
        appliedDiscount: { type: Number, default: 0 }
    },
    shippingFee: { type: Number, default: 30000 },
    finalAmount: { type: Number, required: true }, // Tổng tiền sau khi áp dụng voucher
    orderStatus: {
        type: String,
        required: true,
        enum: ['pending', 'paid', 'confirmed', 'shipping', 'delivered', 'cancelled'],
        default: 'pending'
    },
    paymentStatus: {
        type: String,
        required: true,
        enum: ['unpaid', 'paid', 'refunded'],
        default: 'unpaid'
    },
    paymentInfo: {
        transactionId: { type: String, default: null },
        paymentStatus: { type: String, default: null },
        amount: { type: String, default: null },
        currency: { type: String, default: null },
        payer: { type: Object, default: null },
        paymentTime: { type: String, default: null }
    },
    isDeletedByUser: { type: Boolean, default: false },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
},
    {
        timestamps: true,
    }
);
const Order = mongoose.model('Order', orderSchema);
module.exports = Order;