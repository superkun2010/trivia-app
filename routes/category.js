"use strict"
const express = require('express');
const pg = require('pg');
const bodyParser = require('body-parser');
const knex = require('../db/knex');

const router = express.Router();


/* GET users listing. */

router.get('/', (req, res, next) => {
  knex('categories').select()
  .then( (categories) => {
    console.log(categories);
    res.render('categories', {categories: categories});
  });
});

router.get('/:id', (req, res, next) => {
  console.log(req.params.id); //figure out said ID
  knex('categories').select().where('id', "=" ,req.params.id)
  .then( (categories) => {
    res.render('category', {categories: categories});
  });
});

router.get('/createNewCategory', (req, res, next) => {
  knex('categories').select()
  .then( (categories) => {
    console.log(categories);
    res.render('categories', {categories: categories});
  });
});

// router.post('/createNewCategory', (req, res, next) => {
//   var categoryName = req.body['category_name'];
//   console.log(categoryName);
//   knex.raw('select id, category_name from categories where category_name ~* ?', [`.*${categoryName}*.`])
//   .then( (categories) => {
//     var matchingCategory = categories.rows;
//     console.log(matchingCategory);
//     res.render('category', {category: matchingCategory});
//   });
// });



// router.put('/:userId/booklists/:booklistId', function(req, res, next) {
//   knex("authors").insert({name: req.body.author}).then(function(authorId) {
//     knex("books").insert({title: req.body.title, year_published: parseInt(req.body.year)}).then(function(bookId) {
//       knex("authors_books").insert({author_id: parseInt(authorId[0]), book_id: parseInt(bookId[0])})
//       knex("books_genres").insert({book_id: parseInt(bookId[0]), genre_id: parseInt(req.body.genre)})
//       knex("booklists_books").insert({
//         read: req.body.read,
//         "read-date": req.body.readDate,
//         booklist_id: parseInt(req.params.booklistId),
//         book_id: bookId[0]
//       })
//       .then(function(data) {
//         res.json(data);
//       })
//     })
//   })
// }); adding to database


// router.post('/search', (req, res, next) => {
//   var categoryName = req.body['category_name'];
//   console.log(categoryName);
//   knex.raw('select id, category_name from categories where category_name ~* ?', [`.*${categoryName}*.`])
//   .then( (books) => {
//     var matchingCategory = categories.rows;
//     console.log(matchingCategory);
//     res.render('bookSearch', {category: matchingCategory});
//   });
// });


module.exports = router;
