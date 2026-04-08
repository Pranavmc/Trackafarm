const mongoose = require('mongoose');

const vetRecordSchema = new mongoose.Schema(
  {
    animalId: { type: mongoose.Schema.Types.ObjectId, ref: 'Animal', required: true },
    farmerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: {
      type: String,
      enum: ['Vaccination', 'Deworming', 'Treatment', 'Checkup', 'Surgery', 'Spray'],
      required: true,
    },
    medicine: { type: String, trim: true },
    dosage: { type: String, trim: true },
    cost: { type: Number, default: 0 },
    date: { type: Date, required: true, default: Date.now },
    nextDueDate: { type: Date },
    veterinarianName: { type: String, trim: true },
    diagnosis: { type: String },
    notes: { type: String },
    status: { type: String, enum: ['Completed', 'Scheduled', 'Cancelled'], default: 'Completed' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('VetRecord', vetRecordSchema);
