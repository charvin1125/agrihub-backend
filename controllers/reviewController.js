// controllers/reviewController.js
const Review = require('../models/Review');

// Create or Update Review
exports.createReview = async (req, res) => {
  const { productId } = req.params;
  const { rating, comment } = req.body;
  const userId = req.user._id; // Assuming user is authenticated and added to req.user by middleware

  try {
    // Check if user already reviewed this product
    let review = await Review.findOne({ productId, userId });
    if (review) {
      // Update existing review
      review.rating = rating;
      review.comment = comment;
      await review.save();
      return res.status(200).json({ message: 'Review updated successfully', review });
    }

    // Create new review
    review = new Review({ productId, userId, rating, comment });
    await review.save();
    res.status(201).json({ message: 'Review created successfully', review });
  } catch (error) {
    console.error('Error creating/updating review:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get Reviews for a Product
exports.getProductReviews = async (req, res) => {
  const { productId } = req.params;

  try {
    const reviews = await Review.find({ productId })
      .populate('userId', 'name') // Populate user's name
      .sort({ createdAt: -1 }); // Latest first
    res.status(200).json(reviews);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get Latest Reviews for Admin Dashboard
exports.getLatestReviews = async (req, res) => {
  try {
    const reviews = await Review.find()
      .populate('userId', 'name')
      .populate('productId', 'name')
      .sort({ createdAt: -1 })
      .limit(5); // Latest 5 reviews
    res.status(200).json(reviews);
  } catch (error) {
    console.error('Error fetching latest reviews:', error);
    res.status(500).json({ message: 'Server error' });
  }
};