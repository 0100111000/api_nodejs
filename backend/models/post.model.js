const mongoose = require('mongoose');

const postSchema = mongoose.Schema(
    {
        message: {
            type: String,
            required: true,
        },
        author: {
            type: String,
            required: true,
        },
        liker:{
            type: [String]
        },
    
    },
    {
        timestamps: true
    }
);



module.exports = mongoose.model("Post", postSchema);