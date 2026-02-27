
import { NextResponse } from 'next/server';
import { verifySession } from '@/lib/jwt';
import { initializeFirebase } from '@/firebase/provider';
import { doc, getDoc } from 'firebase/firestore';

export async function GET() {
  console.log('[CodBank API] Synchronization request received');
  
  const session = await verifySession();
  
  if (!session || !session.userId) {
    console.warn('[CodBank API] Unauthorized: Session invalid or expired');
    return NextResponse.json({ error: 'Unauthorized session' }, { status: 401 });
  }

  console.log(`[CodBank API] Decoded Operator: ${session.sub} (Role: ${session.role})`);

  try {
    const { firestore } = initializeFirebase();
    const userDocRef = doc(firestore, 'codusers', session.userId as string);
    const userSnap = await getDoc(userDocRef);

    if (!userSnap.exists()) {
      console.error(`[CodBank API] Critical: Identity ${session.userId} not found in global ledger`);
      return NextResponse.json({ error: 'Identity not found' }, { status: 404 });
    }

    const userData = userSnap.data();
    console.log(`[CodBank API] Fetch success. Liquidity: $${userData.balance}`);

    return NextResponse.json({
      balance: userData.balance,
      username: userData.username,
      lastSync: new Date().toISOString()
    });
  } catch (error: any) {
    console.error('[CodBank API] Sync Error:', error.message);
    return NextResponse.json({ error: 'Internal database error' }, { status: 500 });
  }
}
