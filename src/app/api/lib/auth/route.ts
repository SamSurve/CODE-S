import { NextRequest, NextResponse } from 'next/server';
import { LIB_SECRET_HEADER, LIB_SECRET_VALUE } from '../../../../config';

export async function POST(req: NextRequest) {
  const secret = req.headers.get(LIB_SECRET_HEADER);
  if (secret !== LIB_SECRET_VALUE) {
    return new NextResponse('Not Found', { status: 404 });
  }

  const { pin } = await req.json();
  const serverPin = process.env.LIB_PIN || '1234';

  if (!pin || pin !== serverPin) {
    return NextResponse.json({ success: false, error: 'Invalid PIN' }, { status: 401 });
  }

  const validSession = process.env.LIB_SESSION_TOKEN || 'verified-lib-session';
  const response = NextResponse.json({ success: true });
  response.cookies.set('lib_session', validSession, {
    httpOnly: true,
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 // 24 hours
  });

  return response;
}
