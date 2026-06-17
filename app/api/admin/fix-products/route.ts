import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// GET /api/admin/fix-products — One-time fix to set in_stock = true for all products with NULL in_stock
export async function GET(req: NextRequest) {
  try {
    // First check current state
    const { data: allProducts, error: fetchError } = await supabase
      .from('products')
      .select('id, name, in_stock');

    if (fetchError) {
      return NextResponse.json({ success: false, error: fetchError.message }, { status: 500 });
    }

    const nullProducts = allProducts?.filter(p => p.in_stock === null) || [];
    const falseProducts = allProducts?.filter(p => p.in_stock === false) || [];
    const trueProducts = allProducts?.filter(p => p.in_stock === true) || [];

    // Update products where in_stock is NULL
    let updatedCount = 0;
    if (nullProducts.length > 0) {
      const { data: updated, error: updateError } = await supabase
        .from('products')
        .update({ in_stock: true })
        .is('in_stock', null)
        .select('id, name');

      if (updateError) {
        return NextResponse.json({ success: false, error: updateError.message }, { status: 500 });
      }
      updatedCount = updated?.length || 0;
    }

    return NextResponse.json({
      success: true,
      summary: {
        total_products: allProducts?.length || 0,
        were_true: trueProducts.length,
        were_false: falseProducts.length,
        were_null: nullProducts.length,
        fixed_count: updatedCount,
      },
      message: updatedCount > 0
        ? `Fixed ${updatedCount} products! They now have in_stock = true.`
        : 'No products needed fixing. All products already have in_stock set.',
      fixed_products: nullProducts.map(p => p.name),
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
