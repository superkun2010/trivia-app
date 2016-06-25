exports.up = function(knex, Promise) {
  return Promise.all[knex.schema.createTable('users', function(table) {
  	table.increments();
  	table.string('user_name').notNullable().unique();
    table.string('password');
    table.string('email').notNullable();
    table.string('facebook_oauth');
}).createTable('categories', function(table) {
  	table.increments();
  	table.string('category_name').notNullable();
}).createTable('questions', function(table) {
  	table.increments();
  	table.string('question').unique();
    table.string('question_type').unique();
})].then(function(){  createTable('games', function(table) {
    table.increments();
    table.integer('category_id').references('categories.id').notNullable();
    });
}).then(function(){ createTable('answers', function(table) {
  	table.increments();
  	table.integer('question_id').references('questions.id').notNullable();
    table.string('answers_text').notNullable();
    table.boolean('answers_bool').notNullable();
  });
}).then(function(){ createTable('category_questions', function(table) {
    table.increments();
    table.integer('question_id').references('questions.id').notNullable();
    table.integer('category_id').references('categories.id').notNullable();
  });
}).then(function(){ createTable('user_games', function(table) {
    table.increments();
    table.integer('user_id').references('users.id').notNullable();
    table.integer('game_id').references('games.id').notNullable();
  });
}).then(function(){ createTable('game_questions', function(table) {
    table.increments();
    table.integer('game_id').references('games.id').notNullable();
    table.integer('question_id').references('questions.id').notNullable();
  });
}).then(function(){createTable('user_questions', function(table) {
    table.increments();
    table.integer('game_id').references('games.id').notNullable();
    table.integer('question_id').references('questions.id').notNullable();
    table.integer('user_id').references('users.id').notNullable();
    table.integer('user_id').references('users.id').notNullable();
    });
  });
};

exports.down = function(knex, Promise) {

  return Promise.all([
    knex.schema.dropTable('users'),
    knex.schema.dropTable('categories'),
    knex.schema.dropTable('questions'),
    knex.schema.dropTable('answers'),
    knex.schema.dropTable('games'),
    knex.schema.dropTable('category_questions'),
    knex.schema.dropTable('user_games'),
    knex.schema.dropTable('game_questions'),
    knex.schema.dropTable('user_questions')
  ]);
};
