const mongoose = require('mongoose');

const promotionSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        description: { type: String, default: '' },
        discountPercent: { type: Number, required: true, min: 1, max: 100 },
        // 'all' | 'byType' | 'byIds'
        targetType: { type: String, enum: ['all', 'byType', 'byIds'], default: 'all' },
        productTypes: { type: [String], default: [] },
        productIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
        startDate: { type: Date, required: true },
        endDate: { type: Date, required: true },
        isActive: { type: Boolean, default: false },
    },
    { timestamps: true }
);

const Promotion = mongoose.model('Promotion', promotionSchema);
module.exports = Promotion;
