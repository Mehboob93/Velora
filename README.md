# Velora

A property marketplace (buy / rent) built with Express 5, MongoDB (Mongoose), EJS, Passport, Cloudinary and Mapbox.

## Run it

```bash
npm install
cp .env     # then fill in the values
npm run dev              # or: npm start     ->  http://localhost:8080
```

Required environment variables are listed in `.env.example`. The app exits with a clear message if `ATLASDB_URL` or `SECRET` is missing.

## Seed sample data

```bash
npm run seed
```

* Adds 20 sample listings (India, mixed sale/rent), 15 sample reviews and 3 sample agent accounts (`priya.realty`, `arjun.estates`, `meera.homes`).
* **Additive only.** Nothing is ever deleted or overwritten. Re-running skips listings that already exist (matched on title + location), so your edits survive.
* Every document is validated against the Mongoose schema before it is inserted.
* If `SEED_USER_PASSWORD` is not set, a random password for the sample agents is printed **once**, the first time they are created.
* Sample image URLs are checked on each run; unreachable ones are replaced with a local placeholder.


## Project structure

```
app.js            Express setup, sessions, passport, error handler
Rotues/           Route definitions (folder name kept from the original project)
controllers/      Request handlers
models/           Mongoose models (the Listing model keeps its original name "Listening" / collection "listenings")
middleware.js     Auth, ownership and validation middleware
schema.js         Joi validation schemas
utils/            db connection, geocoding, formatting helpers, constants
init/             seed.js + seedData.js
views/            EJS templates (layouts/, includes/, listings/, users/)
public/           CSS (style.css = design system), JS, images
```
