/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';

var expect = require('chai').expect;
let mongodb = require('mongodb')
let mongoose = require('mongoose')
const book = require('../models/mySchema.js');
const shortId = require('shortid')
//Example connection: MongoClient.connect(MONGODB_CONNECTION_STRING, function(err, db) {});
const MONGODB_CONNECTION_STRING = process.env.DB;
module.exports = function (app) {


mongoose.connect(MONGODB_CONNECTION_STRING, { useNewUrlParser: true, useUnifiedTopology: true,useFindAndModify: false });

	

  app.route('/api/books')
    .get(function (req, res){
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
     book.find({}).select("-comments")
	     .then(data =>
		   res.send(data)
     ).catch(err=> console.log(err))
    })
    
    .post(function (req, res){
      var title = req.body.title;
     console.log(title)//If empty string run if statement;
     if(!title){//checks whether variable has a value and not the key value.Tests for empty string(""),null,undefined,NaN,false and 0;
		return res.status(200).json('No title in input field')
     }
		
     book.exists({title:title}).then(lib =>{//exists method checks if title is in collection (single document).
      if(!lib){
          let myId,
              myBook;
              myId = shortId.generate();
              myBook = new book({
              _id:myId,
              title:title,
              comments:[],
              commentcount:0
         })
       myBook.save((err,data)=>{
        (err)?res.status(400).redirect(process.cwd() + '/views/404.html'):
        res.status(200).json({
          _id:myId,
          title:title
        })
      })
       }else{
         res.status(200).json("Title exists.Please enter another title")
       }
     }).catch(err => console.log(err))


    
    })
    
    .delete(function(req, res){
      //if successful response will be 'complete delete successful'
		  book.deleteMany({}).then(data => {
        if(data){
        res.status(200).json("completed delete successful")
      }}).catch(err => console.log(err))
    });



  app.route('/api/books/:id')
    .get(function (req, res){
      var bookid = req.params.id;
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
			 book.findById({_id:bookid}).then(data => {
                          (data)?res.status(200).json({
                           _id:data._id,
                           title:data.title,
                           commeny:data.comment
                         }):res.status(200).json('no book exists')
                        }).catch(err=> console.log(err))
    })
    
    .post(function(req, res){
      var bookid = req.params.id;
      var comment = req.body.comment;
      //json res format same as .get
			 book.findByIdAndUpdate({_id:bookid},{$push:{"comments":comment},$inc: {"commentcount":1}},{new : true }).then(lib =>{
      //console.log(data)
      (lib)?res.status(200).json({
        tile:lib.title,
        id:lib._id,
        comments:lib.comments
        }): res.status(200).send("no book exists")
      }).catch(err => console.log(err))
    })
    
    .delete(function(req, res){
      var bookid = req.params.id;
      //if successful response will be 'delete successful'
			book.findByIdAndRemove(
				bookid,
				(error, deletedBook) => {
					if(!error && deletedBook){
					  return res.json('delete successful')
					}else if(!deletedBook){
					  return res.json('no book exists')
					}
				}
			)
    });
  
};
