const mongoose = require("mongoose");
const initData = require("./data");
const Listing = require("../models/listing.js");


const MONGO_URL = "mongodb://127.0.0.1:27017/velora";

main().then(() => {
    console.log("connected to db ");
}).catch((err) => {
    console.log(err);
});

async function main(){
    await mongoose.connect(MONGO_URL);
}

const initDB =async () =>{
    await Listing.deleteMany({});
    initData.data= initData.data.map((obj) => ({...obj, owner:"6aad05c3af4e2c1da84f3954"}));
    await Listing.insertMany(initData.data);
    console.log("data was init")
};

initDB();