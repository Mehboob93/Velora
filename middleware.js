const Listing = require("./models/listing.js");
const Review = require("./models/review.js");
const { listingSchema, reviewSchema } = require("./schema.js");
const ExpressError = require("./utils/ExpressError.js");

const OBJECT_ID = /^[a-f\d]{24}$/i;
const isValidId = (id) => OBJECT_ID.test(String(id));

// Don't wrap messages in quotes, so '"Title" is required' becomes 'Title is required'.
const JOI_OPTIONS = { abortEarly: false, errors: { wrap: { label: false } } };
const joiMessage = (error) => [...new Set(error.details.map((d) => d.message))].join(". ");

module.exports.isValidId = isValidId;

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        // Only GET pages can be returned to after login; for other methods
        // send the person back to the listing they were working on.
        if (req.method === "GET") {
            req.session.redirectUrl = req.originalUrl;
        } else if (req.params && isValidId(req.params.id)) {
            req.session.redirectUrl = `/listings/${req.params.id}`;
        }
        req.flash("error", "Please log in to continue.");
        return res.redirect("/login");
    }
    next();
};

module.exports.saveRedirectUrl = (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};

module.exports.isOwner = async (req, res, next) => {
    const { id } = req.params;
    const listing = isValidId(id) ? await Listing.findById(id) : null;
    if (!listing) {
        req.flash("error", "That listing doesn't exist or has been removed.");
        return res.redirect("/listings");
    }
    if (!listing.owner || !listing.owner.equals(res.locals.currUser._id)) {
        req.flash("error", "Only the owner of this listing can do that.");
        return res.redirect(`/listings/${id}`);
    }
    next();
};

module.exports.validateListing = async (req, res, next) => {
    const { error } = listingSchema.validate(req.body, JOI_OPTIONS);
    if (!error) return next();

    // Re-render the form with what the person typed instead of dropping them on an error page.
    const formValues = (req.body && req.body.listing) || {};
    res.locals.error = [joiMessage(error)];

    if (req.method === "POST") {
        return res.status(400).render("listings/new", { formValues });
    }
    const listing = isValidId(req.params.id) ? await Listing.findById(req.params.id) : null;
    if (!listing) {
        throw new ExpressError(404, "That listing doesn't exist or has been removed.");
    }
    return res.status(400).render("listings/edit", { listing, formValues });
};

module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body, JOI_OPTIONS);
    if (!error) return next();
    req.flash("error", joiMessage(error));
    return res.redirect(`/listings/${req.params.id}#reviews`);
};

module.exports.isReviewAuthor = async (req, res, next) => {
    const { id, reviewId } = req.params;
    const review = isValidId(reviewId) ? await Review.findById(reviewId) : null;
    if (!review) {
        req.flash("error", "That review no longer exists.");
        return res.redirect(`/listings/${id}`);
    }
    if (!review.author || !review.author.equals(res.locals.currUser._id)) {
        req.flash("error", "You can only delete your own reviews.");
        return res.redirect(`/listings/${id}`);
    }
    next();
};
