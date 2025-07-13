import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// USERS
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (body.type === 'user') {
      const { email, full_name, role, mobile, is_active } = body;
      if (!email || !full_name || !role) {
        return NextResponse.json({ success: false, error: 'Missing required user fields' }, { status: 400 });
      }
      const { data, error } = await supabase
        .from('admin_users')
        .insert({ email, full_name, role, mobile, is_active })
        .select()
        .single();
      if (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
      }
      return NextResponse.json({ success: true, user: data });
    }
    if (body.type === 'carousel') {
      const { title, subtitle, image_url, button_text, button_link, display_order, is_active } = body;
      if (!title || !image_url) {
        return NextResponse.json({ success: false, error: 'Missing required carousel fields' }, { status: 400 });
      }
      const { data, error } = await supabase
        .from('carousel_slides')
        .insert({ title, subtitle, image_url, button_text, button_link, display_order, is_active })
        .select()
        .single();
      if (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
      }
      return NextResponse.json({ success: true, carousel: data });
    }
    return NextResponse.json({ success: false, error: 'Invalid type' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    if (body.type === 'user') {
      const { id, ...updates } = body;
      if (!id) {
        return NextResponse.json({ success: false, error: 'User id required' }, { status: 400 });
      }
      const { data, error } = await supabase
        .from('admin_users')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      if (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
      }
      return NextResponse.json({ success: true, user: data });
    }
    if (body.type === 'carousel') {
      const { id, ...updates } = body;
      if (!id) {
        return NextResponse.json({ success: false, error: 'Carousel id required' }, { status: 400 });
      }
      const { data, error } = await supabase
        .from('carousel_slides')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      if (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
      }
      return NextResponse.json({ success: true, carousel: data });
    }
    return NextResponse.json({ success: false, error: 'Invalid type' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const body = await req.json();
    if (body.type === 'user') {
      const { id } = body;
      if (!id) {
        return NextResponse.json({ success: false, error: 'User id required' }, { status: 400 });
      }
      const { error } = await supabase
        .from('admin_users')
        .delete()
        .eq('id', id);
      if (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
      }
      return NextResponse.json({ success: true });
    }
    if (body.type === 'carousel') {
      const { id } = body;
      if (!id) {
        return NextResponse.json({ success: false, error: 'Carousel id required' }, { status: 400 });
      }
      const { error } = await supabase
        .from('carousel_slides')
        .delete()
        .eq('id', id);
      if (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
      }
      return NextResponse.json({ success: true });
    }
    return NextResponse.json({ success: false, error: 'Invalid type' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
} 