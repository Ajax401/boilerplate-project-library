const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const currentSchema = ({
  _id:{
    type:String,
    required:true
    },
  title:{
   type:String,
   min:1,
   max:20,
   required:true
       },
  comments:[String],
  commentcount:Number
 })

const mySchema = mongoose.model('book',currentSchema);

module.exports = mySchema;
