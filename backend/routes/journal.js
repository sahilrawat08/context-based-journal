const express = require('express');
const { body, query } = require('express-validator');
const journalController = require('../controllers/journalController');
const auth = require('../middleware/auth');
const validate = require('../middleware/validate');
const { journalLimiter } = require('../middleware/rateLimit');

const router = express.Router();

// Validation rules
const createEntryValidation = [
  body('content')
    .trim()
    .isLength({ min: 1, max: 5000 })
    .withMessage('Journal content must be between 1 and 5000 characters'),
  body('mood')
    .isInt({ min: 1, max: 10 })
    .withMessage('Mood rating must be between 1 and 10'),
  body('productivity')
    .isInt({ min: 1, max: 10 })
    .withMessage('Productivity rating must be between 1 and 10'),
  body('sentiment')
    .optional()
    .isIn(['positive', 'negative', 'neutral'])
    .withMessage('Sentiment must be positive, negative, or neutral'),
  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array'),
  body('tags.*')
    .optional()
    .isString()
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('Each tag must be between 1 and 50 characters'),
  body('moodFactors.sleep')
    .optional()
    .isInt({ min: 1, max: 10 })
    .withMessage('Sleep rating must be between 1 and 10'),
  body('moodFactors.exercise')
    .optional()
    .isInt({ min: 1, max: 10 })
    .withMessage('Exercise rating must be between 1 and 10'),
  body('moodFactors.social')
    .optional()
    .isInt({ min: 1, max: 10 })
    .withMessage('Social rating must be between 1 and 10'),
  body('moodFactors.work')
    .optional()
    .isInt({ min: 1, max: 10 })
    .withMessage('Work rating must be between 1 and 10')
];

const updateEntryValidation = [
  body('content')
    .optional()
    .trim()
    .isLength({ min: 1, max: 5000 })
    .withMessage('Journal content must be between 1 and 5000 characters'),
  body('mood')
    .optional()
    .isInt({ min: 1, max: 10 })
    .withMessage('Mood rating must be between 1 and 10'),
  body('productivity')
    .optional()
    .isInt({ min: 1, max: 10 })
    .withMessage('Productivity rating must be between 1 and 10'),
  body('sentiment')
    .optional()
    .isIn(['positive', 'negative', 'neutral'])
    .withMessage('Sentiment must be positive, negative, or neutral')
];

const queryValidation = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  query('sort')
    .optional()
    .isString()
    .withMessage('Sort must be a string'),
  query('timeRange')
    .optional()
    .isIn(['week', 'month'])
    .withMessage('Time range must be week or month'),
  query('q')
    .optional()
    .isString()
    .trim()
    .isLength({ min: 1 })
    .withMessage('Search query must not be empty')
];

// All routes require authentication
router.use(auth);

// @route   POST /api/journal
// @desc    Create new journal entry
// @access  Private
router.post('/', journalLimiter, createEntryValidation, validate, journalController.createEntry);

// @route   GET /api/journal
// @desc    Get all journal entries for user
// @access  Private
router.get('/', queryValidation, validate, journalController.getEntries);

// @route   GET /api/journal/analytics
// @desc    Get journal analytics
// @access  Private
router.get('/analytics', queryValidation, validate, journalController.getAnalytics);

// @route   GET /api/journal/search
// @desc    Search journal entries
// @access  Private
router.get('/search', queryValidation, validate, journalController.searchEntries);

// @route   GET /api/journal/:id
// @desc    Get single journal entry
// @access  Private
router.get('/:id', journalController.getEntry);

// @route   PUT /api/journal/:id
// @desc    Update journal entry
// @access  Private
router.put('/:id', journalLimiter, updateEntryValidation, validate, journalController.updateEntry);

// @route   DELETE /api/journal/:id
// @desc    Delete journal entry
// @access  Private
router.delete('/:id', journalLimiter, journalController.deleteEntry);

module.exports = router;
