/*
 *
 *
 *       Complete the API routing below
 *       
 *       
 */

'use strict';

// var expect = require('chai').expect;
// var MongoClient = require('mongodb').MongoClient;
// var ObjectId = require('mongodb').ObjectId;
var mongoose = require('mongoose');
require('dotenv').config();
var Schema = mongoose.Schema;
const MONGODB_CONNECTION_STRING = process.env.DB;

var bookSchema = new Schema({
  title: String,
  comments: []
})

var Book = mongoose.model('Book', bookSchema);

mongoose.connect(MONGODB_CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log('Database Connected'))
  .catch(err => console.log(err));

module.exports = function (app) {

  app.route('/api/books')
    // TODO - I can get /api/books to retrieve an array of all books containing title, _id, and commentcount.
    // TODO - If I try to request a book that doesn't exist I will be returned 'no book exists'.
    .get(function (req, res) {
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
    })

    .post(async function (req, res) {
      try {
        var title = req.body.title;

        if (!title) return res.json('No title');

        await mongoose.connect(MONGODB_CONNECTION_STRING, {
            useNewUrlParser: true,
            useUnifiedTopology: true
          })
          .then(() => {
            Book.create({
              title: title
            }, (err, book) => {
              if (err) {
                console.log(err);
                return res.json('could not create book');
              }
              res.json(book);
            })
          }).catch(err => {
            console.log(err);
            return res.json('could not create book');
          })
      } catch {
        err => console.log(err)
      };
    })

    // TODO - I can send a delete request to /api/books to delete all books in the database. Returned will be 'complete delete successful' if successful.
    .delete(function (req, res) {
      //if successful response will be 'complete delete successful'
    });



  app.route('/api/books/:id')
    // TODO - I can get /api/books/{id} to retrieve a single object of a book containing _title, _id, & an array of comments (empty array if no comments present).
    .get(function (req, res) {
      var bookid = req.params.id;
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
    })

    // TODO - I can post a comment to /api/books/{id} to add a comment to a book and returned will be the books object similar to get /api/books/{id} including the new comment.
    .post(async function (req, res) {
      try {
        var bookid = req.params.id;
        var comment = req.body.comment;

        await mongoose.connect(MONGODB_CONNECTION_STRING, {
          useNewUrlParser: true,
          useUnifiedTopology: true
        }).then(() => {
          Book.findOneAndUpdate({
            _id: bookid
          }, {
            $push: {
              comments: comment
            }
          }, {
            returnOriginal: false,
            useFindAndModify: false
          }, (err, doc) => {
            if(err) {
              console.log(err);
              return res.json('could not create comment')
            }
            res.json(doc)
          })
        }).catch(err => {
          console.log(err);
          return res.json('could not create comment');
        })
      } catch {
        err => console.log(err)
      }
      //json res format same as .get
    })

    // TODO - I can delete /api/books/{_id} to delete a book from the collection. Returned will be 'delete successful' if successful.
    .delete(function (req, res) {
      var bookid = req.params.id;
      //if successful response will be 'delete successful'
    });

};