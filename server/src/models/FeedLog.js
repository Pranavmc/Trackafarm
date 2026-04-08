const mongoose = require('mongoose');

const feedLogSchema = new mongoose.Schema(
  {
    animalId: { type: mongoose.Schema.Types.ObjectId, ref: 'Animal', required: true },
    farmerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: Date, required: true, default: Date.now },
    feedType: {
      type: String,
      enum: ['Silage', 'Hay', 'Dairy Meal', 'Salt', 'Grass', 'Concentrate', 'Grains', 'Other'],
      required: true,
    },
    feedQuantityKg: { type: Number, required: true, min: 0 },
    waterLiters: { type: Number, default: 0 },
    cost: { type: Number, default: 0 },
    notes: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model('FeedLog', feedLogSchema);
