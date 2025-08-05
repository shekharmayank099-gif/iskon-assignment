exports.seed = async function(knex) {
  await knex('event_registrations').del();
  
  await knex('event_registrations').insert([
    {
      user_id: 2,
      event_id: 1
    },
    {
      user_id: 2,
      event_id: 2
    }
  ]);
};