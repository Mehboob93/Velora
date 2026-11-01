if (process.env.NODE_ENV != "production") {
    require("dotenv").config();
}

const express = require("express");
const app = express();

// Render (and most hosts) sit behind a reverse proxy.
app.set("trust proxy", 1);
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const wrapAsync = require("./utils/wrapAsync.js");
const connectDB = require("./utils/db.js");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const MongoStore = require("connect-mongo").default;
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
const listingController = require("./controllers/listing.js");

app.use(cookieParser());

const listingsRouter = require("./Routes/listing.js");
const reviewsRouter = require("./Routes/reviews.js");
const userRouter = require("./Routes/user.js");

const dbUrl = process.env.ATLASDB_URL;
const port = process.env.PORT || 8080;


for (const name of ["ATLASDB_URL", "SECRET"]) {
    if (!process.env[name]) {
        console.error(`Missing required environment variable ${name}. See .env.example.`);
        process.exit(1);
    }
}

connectDB(dbUrl)
    .then(() => {
        console.log("connected to db");
    })
    .catch((err) => {
        console.error("Could not connect to MongoDB:", err.message);
        process.exit(1);
    });

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));


Object.assign(app.locals, require("./utils/format.js"));
app.locals.categories = require("./utils/constants.js").CATEGORIES;

const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto: {
        secret: process.env.SECRET,
    },
    touchAfter: 24 * 3600,
});

store.on("error", (err) => {
    console.log("Error in Mongo SESSION", err);
});

const sessionOptions = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
    },
};

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    res.locals.currentPath = req.path;
    res.locals.currentType = req.query.type;
    
    res.locals.isHome = false;
    res.locals.pageTitle = null;
    res.locals.pageDescription = null;
    res.locals.mapToken = null;
    res.locals.formValues = null;
    next();
});

// Home page (this used to redirect straight to /listings).
app.get("/", wrapAsync(listingController.home));

app.use("/listings", listingsRouter);
app.use("/listings/:id/reviews", reviewsRouter);
app.use("/", userRouter);

app.all("/{*splat}", (req, res, next) => {
    next(new ExpressError(404, "We couldn't find the page you were looking for."));
});


app.use((err, req, res, next) => {
    if (res.headersSent) {
        return next(err);
    }
    let { statusCode = 500, message = "Something went wrong" } = err;

    if (err.name === "CastError") {
        statusCode = 404;
        message = "That listing or page could not be found.";
    } else if (err.name === "ValidationError" && err.errors) {
        statusCode = 400;
        message = Object.values(err.errors).map((e) => e.message).join(". ");
    } else if (err.name === "MulterError") {
        statusCode = 400;
        message = `The image could not be uploaded: ${err.message}`;
    } else if (err.http_code) {
        // Cloudinary upload error
        statusCode = 400;
        message = "The image could not be uploaded. Please use a JPG, PNG or AVIF file.";
    }

    if (!Number.isInteger(statusCode) || statusCode < 400 || statusCode > 599) {
        statusCode = 500;
    }
    if (statusCode >= 500) {
        console.error(err);
        if (statusCode === 500) message = "Something went wrong on our side. Please try again.";
    }
    res.status(statusCode).render("listings/error.ejs", { err: { statusCode, message } });
});

app.listen(port, "0.0.0.0", () => {
    console.log(`Server is listening on port ${port}`);
});
