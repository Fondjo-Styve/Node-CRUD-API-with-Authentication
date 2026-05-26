import mongoose from 'mongoose';
const blogSchema=mongoose.Schema({
    title:{
        type:String,
        trim:true,
        required:[true,'title is required'],
        minlength:3,
        maxlength:120
    },

    description:{
        type:String,
        trim:true,
        minlength:10
    },

    body:{
        type:String,
        trim:true,
        required:[true,'body is required'],
        minlength:10
    },

    author:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true,
        index:true
    }
}
,{
    timestamps:true
});

export const Blog=mongoose.model('Blog',blogSchema);