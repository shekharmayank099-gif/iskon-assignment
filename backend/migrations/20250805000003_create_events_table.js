exports.up = function(knex) {
  return knex.schema.createTable('events', function(table) {
    table.increments('id').primary();
    table.string('title', 100).notNullable();
    table.text('description').notNullable();
    table.date('date').notNullable();
    table.string('category', 50).notNullable();
    table.integer('location_id').unsigned().notNullable();
    table.integer('created_by').unsigned().notNullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
    
    table.foreign('location_id').references('locations.id');
    table.foreign('created_by').references('users.id');
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('events');
};