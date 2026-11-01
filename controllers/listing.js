const Listing = require("../models/listing.js");
const ExpressError = require("../utils/ExpressError.js");
const { geocode } = require("../utils/geocode.js");
const { CATEGORIES, LISTING_TYPES } = require("../utils/constants.js");
const { isValidId } = require("../middleware.js");

const PAGE_SIZE = 12;

const SORTS = {
    newest: { _id: -1 },
    price_asc: { price: 1, _id: -1 },
    price_desc: { price: -1, _id: -1 },
};

const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const toNumber = (v) => (v !== undefined && v !== "" && Number.isFinite(Number(v)) ? Number(v) : undefined);


const EDITABLE_FIELDS = [
    "title", "description", "location", "country", "price",
    "category", "listingType", "bedrooms", "bathrooms", "area", "amenities",
];


function cleanListingInput(body = {}) {
    const data = {};
    for (const field of EDITABLE_FIELDS) {
        if (body[field] === undefined) continue;
        data[field] = typeof body[field] === "string" ? body[field].trim() : body[field];
    }
    for (const field of ["bedrooms", "bathrooms", "area"]) {
        if (data[field] === "" || data[field] === null) data[field] = undefined;
    }
    if (!data.category) data.category = "Other";
    if (!data.listingType) data.listingType = "rent";
    if (typeof data.amenities === "string") {
        data.amenities = [...new Set(
            data.amenities.split(",").map((a) => a.trim().slice(0, 40)).filter(Boolean)
        )].slice(0, 20);
    } else if (data.amenities === undefined) {
        data.amenities = [];
    }
    return data;
}

function renderForm(res, view, locals, message, status = 400) {
    res.locals.error = [message];
    return res.status(status).render(view, locals);
}

/**query string into a MongoDB filter */
function buildFilters(query) {
    const and = [];
    const params = {};

    const q = String(query.q || "").trim().slice(0, 100);
    if (q) {
        params.q = q;
        const rx = new RegExp(escapeRegex(q), "i");
        and.push({ $or: [{ title: rx }, { location: rx }, { country: rx }, { description: rx }, { category: rx }] });
    }

    if (LISTING_TYPES.includes(query.type)) {
        params.type = query.type;
        // Listings created before listingType existed behave like the schema default ("rent").
        and.push(query.type === "rent"
            ? { $or: [{ listingType: "rent" }, { listingType: { $exists: false } }] }
            : { listingType: "sale" });
    }

    if (CATEGORIES.includes(query.category)) {
        params.category = query.category;
        and.push(query.category === "Other"
            ? { $or: [{ category: "Other" }, { category: { $exists: false } }] }
            : { category: query.category });
    }

    const minPrice = toNumber(query.minPrice);
    const maxPrice = toNumber(query.maxPrice);
    if (minPrice !== undefined || maxPrice !== undefined) {
        const range = {};
        if (minPrice !== undefined) { range.$gte = minPrice; params.minPrice = minPrice; }
        if (maxPrice !== undefined) { range.$lte = maxPrice; params.maxPrice = maxPrice; }
        and.push({ price: range });
    }

    const beds = toNumber(query.beds);
    if (beds !== undefined && beds > 0) {
        params.beds = beds;
        and.push({ bedrooms: { $gte: beds } });
    }

    params.sort = SORTS[query.sort] ? query.sort : "newest";
    return { filter: and.length ? { $and: and } : {}, params };
}

const withRatings = (query) => query.populate({ path: "reviews", select: "rating" });

// Pages
module.exports.home = async (req, res) => {
    let featured = await withRatings(Listing.find({ featured: true }).sort({ _id: -1 }).limit(3));
    if (featured.length < 3) {
        const filler = await withRatings(
            Listing.find({ _id: { $nin: featured.map((l) => l._id) } }).sort({ _id: -1 }).limit(3 - featured.length)
        );
        featured = featured.concat(filler);
    }

    const recent = await withRatings(
        Listing.find({ _id: { $nin: featured.map((l) => l._id) } }).sort({ _id: -1 }).limit(8)
    );

    const grouped = await Listing.aggregate([{ $group: { _id: "$category", count: { $sum: 1 } } }]);
    const counts = {};
    for (const row of grouped) {
        const key = row._id || "Other";
        counts[key] = (counts[key] || 0) + row.count;
    }
    const categoryCounts = CATEGORIES.filter((c) => counts[c]).map((c) => ({ name: c, count: counts[c] }));
    const total = Object.values(counts).reduce((a, b) => a + b, 0);

    res.render("listings/home", {
        featured,
        recent,
        categoryCounts,
        total,
        heroListing: featured[0] || null,
        isHome: true,
        categories: CATEGORIES,
    });
};

module.exports.index = async (req, res) => {
    const { filter, params } = buildFilters(req.query);

    const total = await Listing.countDocuments(filter);
    const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
    const page = Math.min(Math.max(1, toNumber(req.query.page) || 1), totalPages);

    const allListings = await withRatings(
        Listing.find(filter).sort(SORTS[params.sort]).skip((page - 1) * PAGE_SIZE).limit(PAGE_SIZE)
    );

    // Query string without `page`, used to build pagination and "remove filter" links.
    const toQuery = (omit = []) => {
        const sp = new URLSearchParams();
        for (const [key, value] of Object.entries(params)) {
            if (omit.includes(key) || value === "" || (key === "sort" && value === "newest")) continue;
            sp.set(key, value);
        }
        const str = sp.toString();
        return str ? `?${str}` : "";
    };

    const activeFilters = [];
    if (params.q) activeFilters.push({ label: `"${params.q}"`, remove: `/listings${toQuery(["q"])}` });
    if (params.type) activeFilters.push({ label: params.type === "sale" ? "For sale" : "For rent", remove: `/listings${toQuery(["type"])}` });
    if (params.category) activeFilters.push({ label: params.category, remove: `/listings${toQuery(["category"])}` });
    if (params.minPrice !== undefined) activeFilters.push({ label: `Min ₹${params.minPrice.toLocaleString("en-IN")}`, remove: `/listings${toQuery(["minPrice"])}` });
    if (params.maxPrice !== undefined) activeFilters.push({ label: `Max ₹${params.maxPrice.toLocaleString("en-IN")}`, remove: `/listings${toQuery(["maxPrice"])}` });
    if (params.beds) activeFilters.push({ label: `${params.beds}+ bedrooms`, remove: `/listings${toQuery(["beds"])}` });

    res.render("listings/index", {
        pageTitle: params.type === "sale" ? "Properties for sale" : params.type === "rent" ? "Properties for rent" : "Browse properties",
        allListings,
        total,
        page,
        totalPages,
        filters: params,
        activeFilters,
        pageQuery: (n) => {
            const base = toQuery();
            return `/listings${base}${base ? "&" : "?"}page=${n}`;
        },
        categories: CATEGORIES,
    });
};

module.exports.renderNewForm = (req, res) => {
    res.render("listings/new", { formValues: {}, pageTitle: "List your property" });
};

module.exports.showListing = async (req, res) => {
    const { id } = req.params;
    const listing = isValidId(id)
        ? await Listing.findById(id)
            .populate({ path: "reviews", populate: { path: "author" } })
            .populate("owner")
        : null;
    if (!listing) {
        req.flash("error", "The listing you requested does not exist!");
        return res.redirect("/listings");
    }
    res.render("listings/show", {
        listing,
        mapToken: process.env.MAP_TOKEN,
        pageTitle: listing.title,
        pageDescription: String(listing.description || "").slice(0, 160),
    });
};

module.exports.createListing = async (req, res) => {
    const data = cleanListingInput(req.body.listing);
    const formValues = req.body.listing;

    let geometry;
    try {
        geometry = await geocode(`${data.location}, ${data.country}`);
    } catch (err) {
        return renderForm(res, "listings/new", { formValues }, err.message, err.statusCode || 502);
    }
    if (!geometry) {
        return renderForm(
            res, "listings/new", { formValues },
            "We couldn't find that location on the map. Try adding the area, city or state.", 422
        );
    }

    const newListing = new Listing(data);
    newListing.owner = req.user._id;
    newListing.geometry = geometry;
    //listing uses the default placeholder image.
    if (req.file) {
        newListing.image = { url: req.file.path, filename: req.file.filename };
    }
    const savedListing = await newListing.save();

    req.flash("success", "Your listing is live!");
    res.redirect(`/listings/${savedListing._id}`);
};

module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "The listing you requested does not exist!");
        return res.redirect("/listings");
    }
    res.render("listings/edit", { listing, formValues: null });
};

module.exports.editListing = async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "The listing you requested does not exist!");
        return res.redirect("/listings");
    }

    const data = cleanListingInput(req.body.listing);
    const locationChanged = data.location !== listing.location || data.country !== listing.country;

    if (locationChanged) {
        let geometry;
        try {
            geometry = await geocode(`${data.location}, ${data.country}`);
        } catch (err) {
            return renderForm(res, "listings/edit", { listing, formValues: req.body.listing }, err.message, err.statusCode || 502);
        }
        if (!geometry) {
            return renderForm(
                res, "listings/edit", { listing, formValues: req.body.listing },
                "We couldn't find that location on the map. Try adding the area, city or state.", 422
            );
        }
        listing.geometry = geometry;
    }

    listing.set(data);
    if (typeof req.file !== "undefined") {
        listing.image = { url: req.file.path, filename: req.file.filename };
    }
    await listing.save();

    req.flash("success", "Listing updated!");
    res.redirect(`/listings/${id}`);
};

module.exports.destory = async (req, res) => {
    const { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing deleted.");
    res.redirect("/listings");
};
