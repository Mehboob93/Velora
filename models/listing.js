const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");
const { CATEGORIES, LISTING_TYPES, PLACEHOLDER_IMAGE } = require("../utils/constants.js");

const listingSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    image: {
        filename: {
            type: String,
            default: "listingimage",
        },
        url: {
            type: String,
            default: PLACEHOLDER_IMAGE,
        },
    },
   
    gallery: [{ type: String }],
    price: Number,
    location: String,
    country: String,

    // --- Property details 
    category: {
        type: String,
        enum: CATEGORIES,
        default: "Other",
    },
    listingType: {
        type: String,
        enum: LISTING_TYPES,
        default: "rent",
    },
    bedrooms: { type: Number, min: 0 },
    bathrooms: { type: Number, min: 0 },
    area: { type: Number, min: 0 }, // square feet
    amenities: [{ type: String }],
    featured: { type: Boolean, default: false },

    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review",
        },
    ],
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    geometry: {
        type: {
            type: String,
            enum: ["Point"],
            required: true,
        },
        coordinates: {
            type: [Number],
            required: true,
        },
    },
});

listingSchema.post("findOneAndDelete", async (listing) => {
    if (listing) {
        await Review.deleteMany({ _id: { $in: listing.reviews } });
    }
});


const Listening = mongoose.model("Listening", listingSchema);
module.exports = Listening;
