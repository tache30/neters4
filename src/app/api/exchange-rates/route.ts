import { NextResponse } from 'next/server';
import { getExchangeRates } from '@/lib/queries';

export async function GET() {
  const rates = await getExchangeRates();
  return NextResponse.json(rates);
}
