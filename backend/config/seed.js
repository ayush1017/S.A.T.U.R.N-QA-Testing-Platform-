import User from '../models/User.js';

export async function seedDefaultUser() {
  const username = process.env.AUTH_USERNAME || 'admin';
  const password = process.env.AUTH_PASSWORD || 'saturn123';
  const name = process.env.AUTH_NAME || 'QA Tester';

  const exists = await User.findOne({ username });
  if (exists) return;

  await User.create({ username, password, name, role: 'admin' });
  console.log(`Default admin user created (${username})`);
}
