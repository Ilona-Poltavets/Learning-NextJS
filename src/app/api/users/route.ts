import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { query } from '../../lib/db';
import { User } from '../../types';

export async function POST(req: Request) {
  try {
    const { username, password }: { username: string; password: string } = await req.json();

    const result = await query('SELECT * FROM users WHERE username = $1', [username]);
    const user: User = result[0];

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 400 });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return NextResponse.json({ error: 'Invalid password' }, { status: 400 });
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET as string, {
      expiresIn: '1h',
    });

    return NextResponse.json(
      { message: 'Login successful', token, user: { id: user.id, username: user.username } },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}