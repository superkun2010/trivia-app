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
    res.render('category_name', {categories: categories});
  });
});

router.get('/:id', (req, res, next) => {
  console.log(req.params.id); //figure out said ID
  knex('categories').select().where('id', req.params.id)
  .then( (categories) => {
    res.render('category', {categories: category});
  });
});


router.get('/createNew', function(req, res, next) {
  res.send('new category landing page');
});


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
