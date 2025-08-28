const JournalEntry = require('../models/JournalEntry');

// @desc    Create new journal entry
// @route   POST /api/journal
// @access  Private
const createEntry = async (req, res) => {
  try {
    const {
      content,
      mood,
      productivity,
      weather,
      sentiment,
      tags,
      moodFactors,
      activities,
      goals,
      gratitude
    } = req.body;

    const entry = new JournalEntry({
      user: req.user._id,
      content,
      mood,
      productivity,
      weather,
      sentiment,
      tags,
      moodFactors,
      activities,
      goals,
      gratitude
    });

    await entry.save();

    res.status(201).json({
      success: true,
      message: 'Journal entry created successfully',
      data: {
        entry
      }
    });
  } catch (error) {
    console.error('Create entry error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating journal entry'
    });
  }
};

// @desc    Get all journal entries for user
// @route   GET /api/journal
// @access  Private
const getEntries = async (req, res) => {
  try {
    const { page = 1, limit = 10, sort = '-createdAt' } = req.query;
    
    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      sort,
      populate: {
        path: 'user',
        select: 'name email'
      }
    };

    const entries = await JournalEntry.paginate(
      { user: req.user._id },
      options
    );

    res.json({
      success: true,
      data: {
        entries: entries.docs,
        pagination: {
          currentPage: entries.page,
          totalPages: entries.totalPages,
          totalDocs: entries.totalDocs,
          hasNextPage: entries.hasNextPage,
          hasPrevPage: entries.hasPrevPage
        }
      }
    });
  } catch (error) {
    console.error('Get entries error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching journal entries'
    });
  }
};

// @desc    Get single journal entry
// @route   GET /api/journal/:id
// @access  Private
const getEntry = async (req, res) => {
  try {
    const entry = await JournalEntry.findOne({
      _id: req.params.id,
      user: req.user._id
    }).populate('user', 'name email');

    if (!entry) {
      return res.status(404).json({
        success: false,
        message: 'Journal entry not found'
      });
    }

    res.json({
      success: true,
      data: {
        entry
      }
    });
  } catch (error) {
    console.error('Get entry error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching journal entry'
    });
  }
};

// @desc    Update journal entry
// @route   PUT /api/journal/:id
// @access  Private
const updateEntry = async (req, res) => {
  try {
    const entry = await JournalEntry.findOneAndUpdate(
      {
        _id: req.params.id,
        user: req.user._id
      },
      req.body,
      { new: true, runValidators: true }
    );

    if (!entry) {
      return res.status(404).json({
        success: false,
        message: 'Journal entry not found'
      });
    }

    res.json({
      success: true,
      message: 'Journal entry updated successfully',
      data: {
        entry
      }
    });
  } catch (error) {
    console.error('Update entry error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating journal entry'
    });
  }
};

// @desc    Delete journal entry
// @route   DELETE /api/journal/:id
// @access  Private
const deleteEntry = async (req, res) => {
  try {
    const entry = await JournalEntry.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id
    });

    if (!entry) {
      return res.status(404).json({
        success: false,
        message: 'Journal entry not found'
      });
    }

    res.json({
      success: true,
      message: 'Journal entry deleted successfully'
    });
  } catch (error) {
    console.error('Delete entry error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting journal entry'
    });
  }
};

// @desc    Get journal analytics
// @route   GET /api/journal/analytics
// @access  Private
const getAnalytics = async (req, res) => {
  try {
    const { timeRange = 'week' } = req.query;
    
    let startDate;
    if (timeRange === 'week') {
      startDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    } else if (timeRange === 'month') {
      startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    } else {
      startDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000); // default to week
    }

    const entries = await JournalEntry.find({
      user: req.user._id,
      createdAt: { $gte: startDate }
    }).sort('createdAt');

    // Calculate analytics
    const totalEntries = entries.length;
    const avgMood = totalEntries > 0 
      ? entries.reduce((sum, entry) => sum + entry.mood, 0) / totalEntries 
      : 0;
    const avgProductivity = totalEntries > 0 
      ? entries.reduce((sum, entry) => sum + entry.productivity, 0) / totalEntries 
      : 0;

    // Mood trends
    const moodTrends = entries.map(entry => ({
      date: entry.createdAt.toISOString().split('T')[0],
      mood: entry.mood,
      productivity: entry.productivity
    }));

    // Sentiment distribution
    const sentimentCounts = entries.reduce((acc, entry) => {
      acc[entry.sentiment] = (acc[entry.sentiment] || 0) + 1;
      return acc;
    }, {});

    res.json({
      success: true,
      data: {
        totalEntries,
        avgMood: Math.round(avgMood * 10) / 10,
        avgProductivity: Math.round(avgProductivity * 10) / 10,
        moodTrends,
        sentimentCounts,
        timeRange
      }
    });
  } catch (error) {
    console.error('Get analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching analytics'
    });
  }
};

// @desc    Search journal entries
// @route   GET /api/journal/search
// @access  Private
const searchEntries = async (req, res) => {
  try {
    const { q, page = 1, limit = 10 } = req.query;
    
    if (!q) {
      return res.status(400).json({
        success: false,
        message: 'Search query is required'
      });
    }

    const searchRegex = new RegExp(q, 'i');
    
    const entries = await JournalEntry.find({
      user: req.user._id,
      $or: [
        { content: searchRegex },
        { tags: searchRegex }
      ]
    })
    .sort('-createdAt')
    .limit(parseInt(limit))
    .skip((parseInt(page) - 1) * parseInt(limit));

    const total = await JournalEntry.countDocuments({
      user: req.user._id,
      $or: [
        { content: searchRegex },
        { tags: searchRegex }
      ]
    });

    res.json({
      success: true,
      data: {
        entries,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / parseInt(limit)),
          totalDocs: total,
          hasNextPage: parseInt(page) * parseInt(limit) < total,
          hasPrevPage: parseInt(page) > 1
        }
      }
    });
  } catch (error) {
    console.error('Search entries error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while searching journal entries'
    });
  }
};

module.exports = {
  createEntry,
  getEntries,
  getEntry,
  updateEntry,
  deleteEntry,
  getAnalytics,
  searchEntries
};
