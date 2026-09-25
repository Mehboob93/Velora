const express = require("express");
const router = express.Router({mergeParams: true});
const wrapAsync = require("../utils/wrapAsync.js");
const {validateReview,isLoggedIn,isReviewAuthor} = require("../middleware.js");
const reviewController = require("../controllers/review.js");

//reviews
//post route
router.post("/",isLoggedIn,validateReview,wrapAsync(reviewController.createReview));

// delete review route
router.delete("/:reviewId",isLoggedIn,isReviewAuthor, wrapAsync(reviewController.destoryReview));

module.exports = router;