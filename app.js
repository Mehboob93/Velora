require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const  {listingSchema} = require("./schema.js");


const MONGO_URL = process.env.MONGO_URL;
main().then(() => {
    console.log("connected to db ");
}).catch((err) => {
    console.log(err);
});

async function main(){
    await mongoose.connect(MONGO_URL);
}

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended : true}));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

app.get("/", (req,res) => {
    res.send("I am Home page");
});

const validateListing = (req,res,next) => {
    let {error} = listingSchema.validate(req.body);
 
   if(error){
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
   } else{
    next();
   }
}

//index Route
app.get("/listings",wrapAsync(async (req, res) => {
        const allListings = await Listing.find({});
       
        res.render("listings/index",{allListings});
    
}));

app.get("/listings/new", (req,res) => {
   res.render("listings/new");
});
//show Route 
app.get("/listings/:id", wrapAsync(async(req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/show",{listing});

}));

//create route
app.post("/listings", wrapAsync(async (req, res) => {
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
    
})
);

//update route
app.get("/listings/:id/edit",wrapAsync(async (req,res) => {
 
     let {id} = req.params;
    const listing = await Listing.findById(id);
   
    res.render("listings/edit", {listing} );

}));

app.put("/listings/:id", validateListing,wrapAsync(async (req, res) => {
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    res.redirect("/listings");
}));

app.delete("/listings/:id", wrapAsync(async (req, res) => {
     let {id} = req.params;
    await Listing.findByIdAndDelete(id,{...req.body.listing});
    res.redirect("/listings");
}));






// app.get("/testListing",async(req,res) =>{
//     let sampleListing = new Listing ({
//         title:"New House",
//         description:"Very Good",
//         price:1500,
//         location:"Kalapather, Telagana",
//         country:"India",
//     });
//     await sampleListing.save();
//     console.log("sample was saves");
//     res.send("successful  testing");
// });

app.all("/{*splat}", (req,res,next) => {
    next(new ExpressError(404, "Page not found!"));
});

app.use((err,req,res,next) =>{
    let {statusCode =500 , message = "Something went Wrong"} = err;
    res.status(statusCode).render("listings/error.ejs", { err });
   
});

app.listen(process.env.PORT || 8080, () => {
    console.log(`Server is listening on port ${process.env.PORT || 8080}`);
});