import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase';
import { getUserFromRequest } from '@/lib/utils';

export async function POST(req: NextRequest) {
  const supabase = createClient();
  const user = await getUserFromRequest(req);
  if (!user) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  const { ids } = await req.json();
  if (!Array.isArray(ids) || ids.length === 0) {
    return NextResponse.json({ success: true, products: [] });
  }
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .in('id', ids);
  if (error) return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  return NextResponse.json({ success: true, products: data });
} 