const mongoose = require('mongoose');

const milkRecordSchema = new mongoose.Schema(
  {
    animalId: { type: mongoose.Schema.Types.ObjectId, ref: 'Animal', required: true },
    farmerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: Date, required: true, default: Date.now },
    quantity: { type: Number, required: true, min: 0 },
    session: { type: String, enum: ['Morning', 'Evening', 'Afternoon'], default: 'Morning' },
    pricePerLiter: { type: Number, default: 0 },
    notes: { type: String },
  },
  { timestamps: true }
);

milkRecordSchema.virtual('revenue').get(function () {
  return this.quantity * this.pricePerLiter;
});

module.exports = mongoose.model('MilkRecord', milkRecordSchema);
