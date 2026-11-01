const inr = new Intl.NumberFormat("en-IN");

const trimNumber = (n, digits = 2) => String(Number(n.toFixed(digits)));

function priceLabel(listing) {
    const price = Number(listing && listing.price);
    if (!Number.isFinite(price)) return "Price on request";
    if (listing.listingType === "sale") {
        if (price >= 1e7) return `₹${trimNumber(price / 1e7)} Cr`;
        if (price >= 1e5) return `₹${trimNumber(price / 1e5)} Lakh`;
    }
    return `₹${inr.format(price)}`;
}

function priceSuffix(listing) {
    return listing && listing.listingType === "rent" ? "/month" : "";
}

function listingTypeLabel(listing) {
    return listing && listing.listingType === "sale" ? "For sale" : "For rent";
}

function formatArea(area) {
    return Number.isFinite(Number(area)) && Number(area) > 0 ? `${inr.format(Number(area))} sq ft` : "";
}

function optimizeImage(url, width = 800, height = 600) {
    if (!url || typeof url !== "string") return url;
    try {
        if (url.includes("res.cloudinary.com") && url.includes("/upload/") && !url.includes("/upload/c_")) {
            return url.replace("/upload/", `/upload/c_fill,w_${width},h_${height},q_auto,f_auto/`);
        }
        const parsed = new URL(url);
        if (parsed.hostname === "images.unsplash.com") {
            parsed.searchParams.set("w", String(width));
            parsed.searchParams.set("h", String(height));
            parsed.searchParams.set("fit", "crop");
            parsed.searchParams.set("auto", "format");
            parsed.searchParams.set("q", "75");
            return parsed.toString();
        }
    } catch (e) {
        /* fall through and return the original URL */
    }
    return url;
}


function ratingStats(reviews = []) {
    const rated = reviews.filter((r) => r && Number.isFinite(r.rating) && r.rating > 0);
    if (!rated.length) return { average: 0, count: 0 };
    const sum = rated.reduce((total, r) => total + r.rating, 0);
    return { average: sum / rated.length, count: rated.length };
}

module.exports = { priceLabel, priceSuffix, listingTypeLabel, formatArea, optimizeImage, ratingStats };
