
exports.seed = function(knex, Promise) {
  return Promise.all([
    knex('users').del()
      .then(function () {
        return Promise.all([
          // Inserts seed entries
          knex('users').insert({user_name: 'Kun', password: '', email: 'abc@abc.com', facebook_oauth: ''}).returning('id'),
          knex('users').insert({user_name: 'Monique', password: '', email: 'blah@blah.com', facebook_oauth: ''}).returning('id'),
          knex('users').insert({user_name: 'Alex', password: '', email: 'yourmama@isfat.com', facebook_oauth: ''}).returning('id')
        ]);
      }),
    knex('categories').del()
      .then(function () {
        return Promise.all([
          // Inserts seed entries
          knex('categories').insert({category_name: 'functions'}).returning('id'),
          knex('categories').insert({category_name: 'javascript'}).returning('id'),
          knex('categories').insert({category_name: 'world capitals'}).returning('id')
        ]);
      }),
    knex('questions').del()
      .then(function () {
        return Promise.all([
          // Inserts seed entries
          knex('questions').insert({question_text: 'Does a boolean mean true or false?', question_type: 'boolean'}).returning('id'),
          knex('questions').insert({question_text: 'What is the capital of Peru?', question_type: 'multiple choice'}).returning('id'),
          knex('questions').insert({question_text: 'Is a callback a higher order function', question_type: 'boolean'}).returning('id')
        ]);
      })
  ]).then(function(data) {
      return Promise.all([
        // Inserts seed entries
        knex('answers').insert({question_id: data[2][1][0], answer_text: 'Lima', answer_bool: true}).returning('id'),
        knex('answers').insert({question_id: data[2][0][0], answer_text: 'true', answer_bool: true}).returning('id'),
        knex('answers').insert({question_id: data[2][2][0], answer_text: 'true', answer_bool: true}).returning('id'),
        knex('answers').insert({question_id: data[2][0][0], answer_text: 'false', answer_bool: false}).returning('id'),
        knex('answers').insert({question_id: data[2][2][0], answer_text: 'false', answer_bool: false}).returning('id'),
        knex('answers').insert({question_id: data[2][1][0], answer_text: 'Ottawa', answer_bool: false}).returning('id'),
        knex('answers').insert({question_id: data[2][1][0], answer_text: 'Kingston', answer_bool: false}).returning('id'),
        knex('answers').insert({question_id: data[2][1][0], answer_text: 'Buenos Aires', answer_bool: false}).returning('id')
      ]).then(function(answers) {
        return Promise.all([
          // Inserts seed entries
          knex('games').insert({category_id: data[1][1][0]}).returning('id'),
          knex('games').insert({category_id: data[1][1][0]}).returning('id'),
          knex('games').insert({category_id: data[1][0][0]}).returning('id')
        ]).then(function(games) {
          console.log(data);
          console.log(answers);
          console.log(games);
          // return Promise.all([
          //   Promise.all([
          //     // Inserts seed entries
          //     knex('category_questions').insert({question_id: data[2][0][0], category_id: data[1][1][0]}),
          //     knex('category_questions').insert({question_id: data[2][1][0], category_id: data[1][2][0]}),
          //     knex('category_questions').insert({question_id: data[2][2][0], category_id: data[1][0][0]})
          //   ]),
          //   Promise.all([
          //     // Inserts seed entries
          //     knex('game_questions').insert({game_id: , question_id: }),
          //     knex('game_questions').insert({game_id: , question_id: }),
          //     knex('game_questions').insert({game_id: , question_id: })
          //   ]),
          //   Promise.all([
          //     // Inserts seed entries
          //     knex('user_games').insert({user_id: , game_id: }),
          //     knex('user_games').insert({user_id: , game_id: }),
          //     knex('user_games').insert({user_id: , game_id: })
          //   ]),
          //   Promise.all([
          //     knex('user_questions').insert({game_id: , question_id: , user_id: , answers_id: }),
          //     knex('user_questions').insert({game_id: , question_id: , user_id: , answers_id: }),
          //     knex('user_questions').insert({game_id: , question_id: , user_id: , answers_id: })
          //   ])
          // ])
        })
      });
    }) 
    

          
   

         
   
  
};
