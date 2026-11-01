const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

const listingController = require("../controllers/listing.js");

router
    .route("/")
    .get(wrapAsync(listingController.index))
    .post(
        isLoggedIn,
        upload.single("listing[image]"),
        wrapAsync(validateListing),
        wrapAsync(listingController.createListing)
    );

//new
router.get("/new", isLoggedIn, listingController.renderNewForm);

//edit route
router.get("/:id/edit", isLoggedIn, wrapAsync(isOwner), wrapAsync(listingController.renderEditForm));

router
    .route("/:id")
    .get(wrapAsync(listingController.showListing))
    .put(
        isLoggedIn,
        wrapAsync(isOwner),
        upload.single("listing[image]"),
        wrapAsync(validateListing),
        wrapAsync(listingController.editListing)
    )
    .delete(isLoggedIn, wrapAsync(isOwner), wrapAsync(listingController.destory));

module.exports = router;
