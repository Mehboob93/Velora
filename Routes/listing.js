const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const {isLoggedIn} = require("../middleware.js");
const {isOwner,validateListing} = require("../middleware.js");
const multer  = require('multer');
const {storage} = require("../cloudConfig.js");
const upload = multer({ storage});



const listingController = require("../controllers/listing.js");

router
 .route("/")
 .get(wrapAsync(listingController.index))
 .post(
    isLoggedIn,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(listingController.createListing)
);



//new 
router.get("/new",isLoggedIn, listingController.renderNewForm );
 
router
 .route("/:id")
 .get(wrapAsync(listingController.showListing))
 .put(
    isLoggedIn,
    isOwner,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(listingController.editListing))
 .delete(isLoggedIn,isOwner,wrapAsync(listingController.destory));

router.use((err, req, res, next) => {
    console.log("ERROR NAME:", err.name);
    console.log("ERROR MESSAGE:", err.message);
    console.log("ERROR FIELD:", err.field);
    next(err);
});

//edit route
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(listingController.renderEditForm));


module.exports = router;