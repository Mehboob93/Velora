const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const listingSchema = new Schema ({
    title:{
        type:String,
        required:true,
    },
    description:{
        type:String,
        requied:true
        },
    image: {
    filename: {
        type: String,
        default: "listingimage"
    },
    url: {
        type: String,
        default: "https://images.unsplash.com/photo-1787453632573-0e5962db5f13?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    }
},
    price:Number,
    location:String,
    country:String,
    reviews:{
        type:Schema.Type.ObjectId,
        ref:"Review",
    }
});

const Listening = mongoose.model("Listening" , listingSchema);
module.exports = Listening;

