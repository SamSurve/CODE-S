import { NextRequest, NextResponse } from 'next/server';
import { LIBRARY } from '../../../../data/library';
import { LIB_SECRET_HEADER, LIB_SECRET_VALUE, ENABLE_PIN } from '../../../../config';

function isAuthorized(req: NextRequest): boolean {
  const secret = req.headers.get(LIB_SECRET_HEADER);
  if (secret !== LIB_SECRET_VALUE) {
    return false;
  }
  if (ENABLE_PIN) {
    const sessionCookie = req.cookies.get('lib_session')?.value;
    const validSession = process.env.LIB_SESSION_TOKEN || 'verified-lib-session';
    if (!sessionCookie || sessionCookie !== validSession) {
      return false;
    }
  }
  return true;
}

export async function GET(req: NextRequest) {
  if (!isAuthorized(req)) {
    return new NextResponse('Not Found', { status: 404 });
  }

  const { searchParams } = new URL(req.url);
  const itemId = searchParams.get('id');

  if (!itemId) {
    return new NextResponse('Not Found', { status: 404 });
  }

  for (const subject of LIBRARY) {
    const found = subject.items.find((it) => it.id === itemId);
    if (found) {
      return NextResponse.json({ item: found });
    }
  }

  return new NextResponse('Not Found', { status: 404 });
}
