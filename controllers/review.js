const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
const { isValidId } = require("../middleware.js");

module.exports.createReview = async (req, res) => {
    const listing = isValidId(req.params.id) ? await Listing.findById(req.params.id) : null;
    if (!listing) {
        req.flash("error", "You can't review a listing that doesn't exist.");
        return res.redirect("/listings");
    }

    const newReview = new Review(req.body.review);
    newReview.author = req.user._id;

    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();

    req.flash("success", "Thanks! Your review has been posted.");
    res.redirect(`/listings/${listing._id}#reviews`);
};

module.exports.destoryReview = async (req, res) => {
    const { id, reviewId } = req.params;

    await Listing.findByIdAndUpdate(id, {
        $pull: { reviews: reviewId },
    });

    await Review.findByIdAndDelete(reviewId);

    req.flash("success", "Review deleted.");
    res.redirect(`/listings/${id}#reviews`);
};
