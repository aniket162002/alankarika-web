import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase';

export async function GET() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('countdown_timers')
    .select('*')
    .eq('is_active', true)
    .gt('end_time', new Date().toISOString())
    .order('end_time', { ascending: true })
    .limit(1);
  if (error) return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  return NextResponse.json({ success: true, timer: data?.[0] || null });
} 