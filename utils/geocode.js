const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const ExpressError = require("./ExpressError.js");

let client;

module.exports.geocode = async (query) => {
    const token = process.env.MAP_TOKEN;
    if (!token) {
        throw new ExpressError(503, "Map lookup is not configured. Set MAP_TOKEN in your environment.");
    }
    client = client || mbxGeocoding({ accessToken: token });
    try {
        const response = await client.forwardGeocode({ query, limit: 1 }).send();
        const feature = response.body.features && response.body.features[0];
        return feature ? feature.geometry : null;
    } catch (err) {
        console.error("Mapbox geocoding failed:", err.message);
        throw new ExpressError(502, "We couldn't look up that location right now. Please try again in a moment.");
    }
};
