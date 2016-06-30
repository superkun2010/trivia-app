exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('users', function(table) {
    	table.increments();
    	table.string('user_name').notNullable().unique();
      table.string('password');
      table.string('email').notNullable().unique();
      table.string('facebook_oauth');
    }),

    knex.schema.createTable('categories', function(table) {
    	table.increments();
    	table.string('category_name').notNullable().unique();
    }),

    knex.schema.createTable('questions', function(table) {
    	table.increments();
    	table.string('question_text').unique();
      table.string('question_type');
    })
  ])

  .then(function() {  
    return knex.schema.createTable('games', function(table) {
      table.increments();
      table.integer('category_id').references('categories.id').notNullable().onDelete('CASCADE');
      table.integer('score');
      table.integer('num_questions');
    });
  })
  .then(function() {
    return knex.schema.createTable('answers', function(table) {
    	table.increments();
    	table.integer('question_id').references('questions.id').notNullable().onDelete('CASCADE');
      table.string('answer_text').notNullable();
      table.boolean('answer_bool').notNullable();
    });
  })
  .then(function(){
    return knex.schema.createTable('category_questions', function(table) {
      table.increments();
      table.integer('question_id').references('questions.id').notNullable().onDelete('CASCADE');
      table.integer('category_id').references('categories.id').notNullable().onDelete('CASCADE');
    });
  })
  .then(function(){
    return knex.schema.createTable('user_games', function(table) {
      table.increments();
      table.integer('user_id').references('users.id').notNullable().onDelete('CASCADE');
      table.integer('game_id').references('games.id').notNullable().onDelete('CASCADE');
    });
  })
  .then(function(){ 
    return knex.schema.createTable('game_questions', function(table) {
      table.increments();
      table.integer('game_id').references('games.id').notNullable().onDelete('CASCADE');
      table.integer('question_id').references('questions.id').notNullable().onDelete('CASCADE');
    });
  })
  .then(function(){
    return knex.schema.createTable('user_questions', function(table) {
      table.increments();
      table.integer('game_id').references('games.id').notNullable().onDelete('CASCADE');
      table.integer('question_id').references('questions.id').notNullable().onDelete('CASCADE');
      table.integer('user_id').references('users.id').notNullable().onDelete('CASCADE');
      table.integer('answers_id').references('answers.id').notNullable().onDelete('CASCADE');
    });
  })
  .catch(function(error) {
    console.log(error);
  })
};

exports.down = function(knex, Promise) {

  return knex.schema.dropTable('user_questions')
    .then(function() {
      return Promise.all([
        knex.schema.dropTable('answers'),
        knex.schema.dropTable('category_questions'),
        knex.schema.dropTable('user_games'),
        knex.schema.dropTable('game_questions')
      ])
    })
    .then(function() {
      return knex.schema.dropTable('games')
    })
    .then(function() {
      return Promise.all([
        knex.schema.dropTable('users'),
        knex.schema.dropTable('categories'),
        knex.schema.dropTable('questions')
      ])
    })
};

    
  

    
    
  

