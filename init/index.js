// Legacy entry point. The old version of this file ran `Listing.deleteMany({})`
// against a hardcoded local database. It now delegates to the safe, additive seeder.
// Prefer:  npm run seed
require("./seed.js");
