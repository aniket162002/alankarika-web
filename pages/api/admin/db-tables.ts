import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Get all table names
  const { data: tables, error: tablesError } = await supabase.rpc('pg_list_tables');
  if (tablesError) return res.status(500).json([]);
  // For each table, get row count
  const result = await Promise.all(
    tables.map(async (table: string) => {
      const { count } = await supabase.from(table).select('*', { count: 'exact', head: true });
      return { name: table, rowCount: count || 0 };
    })
  );
  res.status(200).json(result);
}
