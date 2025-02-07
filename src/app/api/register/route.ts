import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import { query } from '../../lib/db';

const SALT_ROUNDS = 10;

export async function POST(req: Request) {
  const { username, password } = await req.json();

  const existingUser = await query('SELECT * FROM users WHERE username = $1', [username]);
  if (existingUser.length > 0) {
    return NextResponse.json({ error: 'Username already exists' }, { status: 400 });
  }

  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

  try {
    await query('INSERT INTO users (username, password) VALUES ($1, $2)', [username, hashedPassword]);
    return NextResponse.json({ message: 'User registered successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Registration failed' }, { status: 500 });
  }
}
