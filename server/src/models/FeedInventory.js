const mongoose = require('mongoose');

const feedInventorySchema = new mongoose.Schema(
  {
    farmerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    feedType: {
      type: String,
      enum: ['Silage', 'Hay', 'Dairy Meal', 'Salt', 'Grass', 'Concentrate', 'Grains', 'Other'],
      required: true,
    },
    quantityKg: { type: Number, required: true, default: 0 },
    lowStockThreshold: { type: Number, default: 100 },
    lastRestocked: { type: Date, default: Date.now },
    unitCost: { type: Number, default: 0 }
  },
  { timestamps: true }
);

// Ensure a farmer only has one entry per feed type
feedInventorySchema.index({ farmerId: 1, feedType: 1 }, { unique: true });

module.exports = mongoose.model('FeedInventory', feedInventorySchema);
