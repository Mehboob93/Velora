
require("dotenv").config();
const crypto = require("crypto");
const mongoose = require("mongoose");

const connectDB = require("../utils/db.js");
const User = require("../models/user.js");
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
const { PLACEHOLDER_IMAGE } = require("../utils/constants.js");
const { SEED_USERS, listings } = require("./seedData.js");

const SKIP_IMAGE_CHECK = process.argv.includes("--skip-image-check");



async function ensureSeedUsers() {
    const users = [];
    let password = process.env.SEED_USER_PASSWORD;
    let generated = false;

    for (const { username, email } of SEED_USERS) {
        let user = await User.findOne({ username });
        if (!user) {
            if (!password) {
                password = crypto.randomBytes(9).toString("base64url");
                generated = true;
            }
            user = await User.register(new User({ username, email }), password);
            console.log(`  + created sample agent account "${username}"`);
            if (generated) generated = "announce";
        }
        users.push(user);
    }

    if (generated === "announce") {
        console.log(`\n  Sample agent password (shown once): ${password}`);
        console.log("  Log in as any sample agent (e.g. priya.realty) to test edit/delete on seeded listings.\n");
    }
    return users;
}

/**Returns a Set of URLs that failed. */
async function findBrokenImages(urls) {
    const broken = new Set();
    const unique = [...new Set(urls)];
    let networkErrors = 0;

    const check = async (url) => {
        try {
            const res = await fetch(url, { method: "HEAD", signal: AbortSignal.timeout(10000), redirect: "follow" });
            const type = res.headers.get("content-type") || "";
            if (!res.ok || !type.startsWith("image/")) broken.add(url);
        } catch (err) {
            networkErrors += 1;
            broken.add(url);
        }
    };

    for (let i = 0; i < unique.length; i += 6) {
        await Promise.all(unique.slice(i, i + 6).map(check));
    }

    // If every request failed we are almost certainly offline: keep the URLs rather than blanking all images.
    if (networkErrors === unique.length && unique.length > 0) {
        console.warn("  ! Could not reach the image host (offline?). Keeping image URLs unverified.");
        return new Set();
    }
    return broken;
}



async function main() {
    console.log("Connecting to MongoDB...");
    await connectDB();
    console.log(`Connected to "${mongoose.connection.name}".\n`);

    console.log("Checking sample agent accounts...");
    const users = await ensureSeedUsers();

    let broken = new Set();
    if (!SKIP_IMAGE_CHECK) {
        console.log("Verifying sample image URLs...");
        broken = await findBrokenImages(listings.flatMap((l) => l.images));
        if (broken.size) console.warn(`  ! ${broken.size} image URL(s) are unreachable and will be replaced.`);
    }

    let inserted = 0;
    let skipped = 0;
    let reviewCount = 0;
    let imagesReplaced = 0;

    console.log("\nSeeding listings...");
    for (const item of listings) {
        const good = item.images.filter((url) => !broken.has(url));
        imagesReplaced += item.images.length - good.length;
        const [mainUrl, ...gallery] = good.length ? good : [PLACEHOLDER_IMAGE];

        const doc = {
            title: item.title,
            description: item.description,
            location: item.location,
            country: item.country,
            price: item.price,
            category: item.category,
            listingType: item.listingType,
            bedrooms: item.bedrooms,
            bathrooms: item.bathrooms,
            area: item.area,
            amenities: item.amenities || [],
            featured: Boolean(item.featured),
            image: { filename: "seed-sample", url: mainUrl },
            gallery,
            geometry: { type: "Point", coordinates: item.coordinates },
            owner: users[item.agent]._id,
            reviews: [],
        };

        // Validate against the real schema.
        await new Listing(doc).validate();

        const result = await Listing.updateOne(
            { title: doc.title, location: doc.location },
            { $setOnInsert: doc },
            { upsert: true }
        );

        if (!result.upsertedCount) {
            skipped += 1;
            console.log(`  = exists   ${item.title}`);
            continue;
        }

        inserted += 1;
        console.log(`  + inserted ${item.title}`);

        // Sample reviews are only added together with a brand-new listing
        const reviewDocs = (item.reviews || []).map((r) => ({
            rating: r.rating,
            comment: r.comment,
            author: users[r.by]._id,
        }));
        if (reviewDocs.length) {
            const created = await Review.insertMany(reviewDocs);
            await Listing.updateOne(
                { _id: result.upsertedId },
                { $set: { reviews: created.map((r) => r._id) } }
            );
            reviewCount += created.length;
        }
    }

    console.log("\nDone.");
    console.log(`  Listings inserted : ${inserted}`);
    console.log(`  Listings skipped  : ${skipped} (already present)`);
    console.log(`  Reviews inserted  : ${reviewCount}`);
    if (imagesReplaced) console.log(`  Images replaced   : ${imagesReplaced} (unreachable URL, see warnings above)`);
}

main()
    .catch((err) => {
        console.error("\nSeeding failed:", err.message);
        process.exitCode = 1;
    })
    .finally(async () => {
        await mongoose.disconnect();
    });
