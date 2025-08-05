exports.seed = async function(knex) {
  await knex('locations').del();
  
  await knex('locations').insert([
    {
      name: 'Tech Park',
      address: '123 Main St',
      city: 'San Francisco',
      state: 'CA',
      country: 'USA'
    },
    {
      name: 'Convention Center',
      address: '456 Elm St',
      city: 'New York',
      state: 'NY',
      country: 'USA'
    }
  ]);
};