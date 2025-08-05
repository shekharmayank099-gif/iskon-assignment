exports.up = function(knex) {
  return knex.schema.createTable('locations', function(table) {
    table.increments('id').primary();
    table.string('name', 100).notNullable();
    table.text('address').notNullable();
    table.string('city', 50).notNullable();
    table.string('state', 50).notNullable();
    table.string('country', 50).notNullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('locations');
};