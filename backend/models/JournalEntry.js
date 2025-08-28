const mongoose = require('mongoose');

const journalEntrySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  },
  content: {
    type: String,
    required: [true, 'Journal content is required'],
    trim: true,
    maxlength: [5000, 'Journal content cannot exceed 5000 characters']
  },
  mood: {
    type: Number,
    required: [true, 'Mood rating is required'],
    min: [1, 'Mood rating must be at least 1'],
    max: [10, 'Mood rating cannot exceed 10']
  },
  productivity: {
    type: Number,
    required: [true, 'Productivity rating is required'],
    min: [1, 'Productivity rating must be at least 1'],
    max: [10, 'Productivity rating cannot exceed 10']
  },
  weather: {
    condition: {
      type: String,
      trim: true
    },
    temperature: {
      type: Number
    },
    location: {
      type: String,
      trim: true
    },
    icon: {
      type: String
    }
  },
  sentiment: {
    type: String,
    enum: ['positive', 'negative', 'neutral'],
    default: 'neutral'
  },
  tags: [{
    type: String,
    trim: true
  }],
  isPrivate: {
    type: Boolean,
    default: true
  },
  moodFactors: {
    sleep: {
      type: Number,
      min: 1,
      max: 10
    },
    exercise: {
      type: Number,
      min: 1,
      max: 10
    },
    social: {
      type: Number,
      min: 1,
      max: 10
    },
    work: {
      type: Number,
      min: 1,
      max: 10
    }
  },
  activities: [{
    type: String,
    trim: true
  }],
  goals: [{
    type: String,
    trim: true
  }],
  gratitude: [{
    type: String,
    trim: true
  }]
}, {
  timestamps: true
});

// Index for efficient queries
journalEntrySchema.index({ user: 1, createdAt: -1 });
journalEntrySchema.index({ user: 1, mood: 1 });
journalEntrySchema.index({ user: 1, productivity: 1 });

// Virtual for formatted date
journalEntrySchema.virtual('formattedDate').get(function() {
  return this.createdAt.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
});

// Ensure virtual fields are serialized
journalEntrySchema.set('toJSON', { virtuals: true });
journalEntrySchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('JournalEntry', journalEntrySchema);
