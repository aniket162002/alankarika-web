import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { data, error } = await supabase.rpc('project_metrics.get_project_usage');
  if (error) return res.status(500).json({ error: error.message });
  // Supabase RPC returns an array, return the first object for frontend
  if (Array.isArray(data)) {
    res.status(200).json(data[0] || {});
  } else {
    res.status(200).json(data || {});
  }
}
