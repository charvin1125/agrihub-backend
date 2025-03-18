// routes/reviewRoutes.js
const express = require('express');
const router = express.Router();
const { createReview, getProductReviews, getLatestReviews } = require('../controllers/reviewController');
const {isAuthenticated} = require('../middlewares/auth'); // Assuming you have authentication middleware

router.post('/products/:productId/product-review', isAuthenticated, createReview); // Create/Update review
router.get('/products/:productId/product-reviews', getProductReviews); // Get reviews for a product
router.get('/product-reviews/latest', isAuthenticated, getLatestReviews); // Get latest 5 reviews (admin)

module.exports = router;