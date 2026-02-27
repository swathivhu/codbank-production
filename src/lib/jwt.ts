
import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';

const SECRET_KEY = new TextEncoder().encode(process.env.JWT_SECRET || 'codbank-ultra-secure-system-key-2024');

export async function createSession(userId: string, username: string, role: string) {
  const token = await new SignJWT({ userId, role })
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject(username)
    .setIssuedAt()
    .setExpirationTime('2h')
    .sign(SECRET_KEY);

  const cookieStore = await cookies();
  cookieStore.set('cod_session', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 2, // 2 hours
    path: '/',
  });

  return token;
}

export async function verifySession() {
  const cookieStore = await cookies();
  const token = cookieStore.get('cod_session')?.value;

  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, SECRET_KEY);
    return payload;
  } catch (error) {
    return null;
  }
}

export async function deleteSession() {
  const cookieStore = await cookies();
  cookieStore.delete('cod_session');
}
