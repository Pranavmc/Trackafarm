const mongoose = require('mongoose');

const animalSchema = new mongoose.Schema(
  {
    tagId: { type: String, required: true, trim: true },
    name: { type: String, trim: true },
    breed: { type: String, required: true, trim: true },
    dob: { type: Date },
    color: { type: String, trim: true },
    healthStatus: {
      type: String,
      enum: ['Healthy', 'Under Treatment', 'Vaccinated', 'Sick', 'Deceased'],
      default: 'Healthy',
    },
    gender: { type: String, enum: ['Female', 'Male'], default: 'Female' },
    weight: { type: Number },
    fatherTag: { type: String },
    motherTag: { type: String },
    notes: { type: String },
    
    // Pillar 1: Advanced Health Tracking
    healthEvents: [{
      eventType: { type: String, enum: ['Vaccination', 'Treatment', 'Checkup', 'Deworming'], required: true },
      date: { type: Date, default: Date.now },
      medicine: { type: String },
      dosage: { type: String },
      nextDueDate: { type: Date }, // Useful for vaccination reminders
      withdrawalPeriodEnd: { type: Date }, // When milk is safe to consume again
      notes: { type: String }
    }],
    
    // Pillar 1: Reproduction Lifecycle
    reproductionEvents: [{
      eventType: { type: String, enum: ['Insemination', 'Pregnancy Check', 'Calving', 'Abortion', 'Dry Off'], required: true },
      date: { type: Date, default: Date.now },
      bullId: { type: String }, // For insemination/breeding
      expectedCalvingDate: { type: Date },
      result: { type: String }, // e.g., 'Positive', 'Negative', 'Male Calf', 'Female Calf'
      notes: { type: String }
    }],
    currentPregnancy: {
      isPregnant: { type: Boolean, default: false },
      expectedCalvingDate: { type: Date },
      inseminationDate: { type: Date }
    },
    
    farmerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Animal', animalSchema);
