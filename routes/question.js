var express = require('express');
var router = express.Router();
var knex = require('../db/knex');
var bodyParser = require('body-parser');

router.get('/', function(req, res, next) {
    return knex('categories').select()
    .then(function(categories) {
        res.render('question', {categories: categories});
    })
});

//create
router.post('/', function(req, res, next) {
	return knex('questions').insert({
		question_text: req.body.question,
		question_type: req.body.question_type
	}).returning('id')
	.then(function(data) {
        if (req.body.question_type === 'multiple choice') {
    		return knex('answers').insert([
                { question_id: data[0], answer_text: req.body.answer1, answer_bool: true },
                { question_id: data[0], answer_text: req.body.answer2, answer_bool: false },
                { question_id: data[0], answer_text: req.body.answer3, answer_bool: false },
                { question_id: data[0], answer_text: req.body.answer4, answer_bool: false }
            ]).returning("*")
        } else {
            if (req.body.boolean === 'true') {
                return knex('answers').insert([
                    { question_id: data[0], answer_text: 'true', answer_bool: true },
                    { question_id: data[0], answer_text: 'false', answer_bool: false }
                ]).returning("*")
            } else {
                return knex('answers').insert([
                    { question_id: data[0], answer_text: 'false', answer_bool: true },
                    { question_id: data[0], answer_text: 'true', answer_bool: false }
                ]).returning("*")
            }
        }
	})
    .then(function(data){
        console.log(data, 'DATADATADATADATA')
        return knex('category_questions').insert({
            question_id: data[0].question_id,
            category_id: req.body.category_id
        })
    })
    .then(function() {
        res.render("question")
    })
});

//read
router.get('/list', function(req, res, next) {
    console.log('got here', req)
    knex('questions').select().orderBy('id').returning('id')
    .then(function(data) {
        res.render('list', {
            questions: data
        })
    })
})

//get question by id
router.get('/:id/edit', function (req, res, next) {
    knex('questions').select().where('id','=',req.params.id)
    .then(function(data) {
        res.render('question', {questions: data[0]});
    })
});

module.exports = router;
