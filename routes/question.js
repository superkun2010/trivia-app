var express = require('express');
var router = express.Router();
var knex = require('../db/knex');
var bodyParser = require('body-parser');

router.use('*', function(req,res,next) {
  if (req.session.username) {
    next();
  } else {
    res.redirect('/auth/login');
  }
});

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
    console.log('got here')
    knex('questions').select()
    .then(function (questions) {
      var questionIds = []
      for (var i = 0; i < questions.length; i++) {
        questionIds.push(questions[i].id);
      }
      knex('answers').select()
      .whereIn("question_id", questionIds)
      .then(function(data) {
        console.log(data)
        // put array of answers as a value on each question in the questions array
        // questions = [
        //   {
        //     text : "something",
        //     answers : [
        //       {
        //         text: "an answer",
        //         correct: true
        //       }
        //     ]
        //   }
        // ]
        for (var i = 0; i < questions.length; i++) {
          questions[i].answers = [];
        }
        for (var i = 0; i < questions.length; i++) {
          for (var j = 0; j < data.length; j++) {
            if (data[j].question_id == questions[i].id) {
              questions[i].answers.push(data[j]);
            }
          }
        }
        console.log(questions)
        res.render('list', {
            data: data,
            questions: questions,
        })
      })
    });
});

//get question by id
router.get('/:id/edit', function (req, res, next) {
    console.log('got here')
    knex('questions').select().join('answers','questions.id', 'answers.question_id').where('id','=',req.params.id)
    .then(function(data) {
        console.log("SUCCESS", data)
        res.send(data);
    })
});

module.exports = router;
