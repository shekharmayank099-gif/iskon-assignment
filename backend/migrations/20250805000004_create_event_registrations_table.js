exports.up = function(knex) {
  return knex.schema.createTable('event_registrations', function(table) {
    table.increments('id').primary();
    table.integer('user_id').unsigned().notNullable();
    table.integer('event_id').unsigned().notNullable();
    table.timestamp('registration_date').defaultTo(knex.fn.now());
    table.enum('status', ['registered', 'cancelled']).defaultTo('registered').notNullable();
    
    table.foreign('user_id').references('users.id');
    table.foreign('event_id').references('events.id');
    
    table.unique(['user_id', 'event_id']);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('event_registrations');
};