
import { NextResponse } from 'next/server';
import { createSession, deleteSession } from '@/lib/jwt';

export async function POST(request: Request) {
  try {
    const { userId, username, role, action } = await request.json();

    if (action === 'logout') {
      await deleteSession();
      return NextResponse.json({ success: true });
    }

    if (!userId || !username) {
      return NextResponse.json({ error: 'Missing identity data' }, { status: 400 });
    }

    await createSession(userId, username, role || 'CUSTOMER');
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
