const bcrypt = require('bcryptjs');

exports.seed = async function(knex) {
  await knex('users').del();
  
  const hashedPassword1 = await bcrypt.hash('password123', 12);
  const hashedPassword2 = await bcrypt.hash('password123', 12);
  
  await knex('users').insert([
    {
      name: 'Alice Admin',
      email: 'alice.admin@example.com',
      password_hash: hashedPassword1,
      role: 'admin'
    },
    {
      name: 'Bob User',
      email: 'bob.user@example.com',
      password_hash: hashedPassword2,
      role: 'user'
    }
  ]);
};