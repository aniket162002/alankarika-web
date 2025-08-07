import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // List all buckets
  const { data: buckets, error } = await supabase.storage.listBuckets();
  if (error) return res.status(500).json([]);
  // For each bucket, list folders and size
  const result = await Promise.all(
    buckets.map(async (bucket: any) => {
      const { data: objects } = await supabase.storage.from(bucket.id).list('', { limit: 1000, offset: 0 });
      // Folders are the unique first segments of object paths
      const folders = Array.from(new Set(
        (objects || [])
          .filter((obj: any) => obj.name.includes('/'))
          .map((obj: any) => obj.name.split('/')[0])
      ));
      // Calculate size (sum of file sizes)
      const size = (objects || []).reduce((acc: number, f: any) => acc + (f.metadata?.size || f.size || 0), 0);
      return { name: bucket.name, folders, size };
    })
  );
  res.status(200).json(result);
}
