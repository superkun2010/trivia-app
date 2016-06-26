exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('users', function(table) {
    	table.increments();
    	table.string('user_name').notNullable().unique();
      table.string('password');
      table.string('email').notNullable();
      table.string('facebook_oauth');
    }),

    knex.schema.createTable('categories', function(table) {
    	table.increments();
    	table.string('category_name').notNullable();
      table.string('group');
    }),

    knex.schema.createTable('questions', function(table) {
    	table.increments();
    	table.string('question_text').unique();
      table.string('question_type').unique();
    })
  ])

  .then(function() {  
    return knex.schema.createTable('games', function(table) {
      table.increments();
      table.integer('category_id').references('categories.id').notNullable();
    });
  })
  .then(function() {
    return knex.schema.createTable('answers', function(table) {
    	table.increments();
    	table.integer('question_id').references('questions.id').notNullable();
      table.string('answer_text').notNullable();
      table.boolean('answer_bool').notNullable();
    });
  })
  .then(function(){
    return knex.schema.createTable('category_questions', function(table) {
      table.increments();
      table.integer('question_id').references('questions.id').notNullable();
      table.integer('category_id').references('categories.id').notNullable();
    });
  })
  .then(function(){
    return knex.schema.createTable('user_games', function(table) {
      table.increments();
      table.integer('user_id').references('users.id').notNullable();
      table.integer('game_id').references('games.id').notNullable();
    });
  })
  .then(function(){ 
    return knex.schema.createTable('game_questions', function(table) {
      table.increments();
      table.integer('game_id').references('games.id').notNullable();
      table.integer('question_id').references('questions.id').notNullable();
    });
  })
  .then(function(){
    return knex.schema.createTable('user_questions', function(table) {
      table.increments();
      table.integer('game_id').references('games.id').notNullable();
      table.integer('question_id').references('questions.id').notNullable();
      table.integer('user_id').references('users.id').notNullable();
      table.integer('answers_id').references('answers.id').notNullable();
    });
  })
  // .catch()
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

    
  

    
    
  

