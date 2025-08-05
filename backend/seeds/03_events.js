exports.seed = async function(knex) {
  await knex('events').del();
  
  await knex('events').insert([
    {
      title: 'React Workshop',
      description: 'Learn React basics',
      date: '2025-02-01',
      category: 'Workshop',
      location_id: 1,
      created_by: 1
    },
    {
      title: 'SQL Mastery',
      description: 'Advanced SQL techniques',
      date: '2025-02-15',
      category: 'Seminar',
      location_id: 2,
      created_by: 1
    }
  ]);
};