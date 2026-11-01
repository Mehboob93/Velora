const Joi = require("joi");
const { CATEGORIES, LISTING_TYPES } = require("./utils/constants.js");

// Friendly messages so users see "Title is required" instead of '"listing.title" is not allowed to be empty'.
const text = (label) => ({
    "string.base": `${label} must be text`,
    "string.empty": `${label} is required`,
    "string.max": `${label} is too long (max {#limit} characters)`,
    "any.required": `${label} is required`,
});

const optionalNumber = (label, { integer = false } = {}) => {
    let rule = Joi.number().min(0).allow("", null).messages({
        "number.base": `${label} must be a number`,
        "number.min": `${label} cannot be negative`,
        "number.integer": `${label} must be a whole number`,
    });
    if (integer) rule = rule.integer();
    return rule;
};

module.exports.listingSchema = Joi.object({
    listing: Joi.object({
        title: Joi.string().max(120).required().messages(text("Title")),
        description: Joi.string().max(3000).required().messages(text("Description")),
        location: Joi.string().required().messages(text("Location")),
        country: Joi.string().required().messages(text("Country")),
        price: Joi.number().required().min(0).messages({
            "number.base": "Price must be a number",
            "number.min": "Price cannot be negative",
            "any.required": "Price is required",
        }),
        image: Joi.object({
            url: Joi.string().allow("", null),
        }).allow("", null),

        category: Joi.string()
            .valid(...CATEGORIES)
            .allow("", null)
            .messages({ "any.only": "Please choose a valid property type" }),
        listingType: Joi.string()
            .valid(...LISTING_TYPES)
            .allow("", null)
            .messages({ "any.only": "Listing type must be for sale or for rent" }),
        bedrooms: optionalNumber("Bedrooms", { integer: true }),
        bathrooms: optionalNumber("Bathrooms", { integer: true }),
        area: optionalNumber("Area"),
        amenities: Joi.string().max(600).allow("", null).messages(text("Amenities")),
    }).required(),
});

module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().required().min(1).max(5).messages({
            "number.base": "Please choose a star rating",
            "number.min": "Please choose a star rating",
            "number.max": "Rating cannot be more than 5 stars",
            "any.required": "Please choose a star rating",
        }),
        comment: Joi.string().max(1500).required().messages(text("Comment")),
    }).required(),
});
