import { NextResponse } from 'next/server';
import { PRODUCTS_DATA } from '@/models/Product';

export async function GET() {
  return NextResponse.json({
    success: true,
    count: PRODUCTS_DATA.length,
    products: PRODUCTS_DATA,
  });
}

