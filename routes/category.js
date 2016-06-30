"use strict";
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

// router.get('/:id', (req, res, next) => {
//   console.log(req.params.id); //figure out said ID
//   knex('categories').select().where('id', "=" ,req.params.id)
//   .then( (categories) => {
//     res.render('category', {categories: categories});
//   });
// });

router.get('/:id/edit', (req, res, next) => {
  console.log(req.params.id); //figure out said ID
  knex('categories').select().where('id', "=" ,req.params.id)
  .then( (categories) => {
    res.render('category', {categories: categories[0]});
  });
});

router.get('/createNewCategory', (req, res, next) => {
  knex('categories').select()
  .then( (categories) => {
    console.log(categories);
    res.render('newCategory', {categories: categories});
  });
});

router.post('/createNewCategory', (req, res, next) => {
  console.log(req.body);
  knex('categories').insert({category_name: req.body['category_name']}).returning(['id'])
  .then( (data) => {
    console.log(data);
    res.redirect('/category');
  })
});

router.delete('/:id', (req, res, next) => {
  console.log('kjhgjhfcjhgxfdfhfh',req.body);
  knex('categories').del().where({"id": req.params.id})
  .then( (data) => {
    console.log(data);
    res.send('SUCCESS');
  })
});

router.put('/:id', (req, res, next) => {
  console.log('!!!!!!' + req.body + " in between body & params " + req.params.id);
  console.dir(req.body);
  knex('categories').update({category_name: req.body.category_name}).where({"id": req.params.id})
  .then( (data) => {
    console.log(data);
    res.send('SUCCESS');
  })
});


// .then( (categories) => {
//   res.render('category', {categories: categories[0]});
// });
// });


module.exports = router;
