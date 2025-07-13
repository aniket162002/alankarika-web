"use client";
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase'

export function useSupabaseRealtime<T>(
  fetchFunction: () => Promise<T>,
  tableName?: string,
  dependencies: any[] = []
): T | null {
  const [data, setData] = useState<T | null>(null);

  useEffect(() => {
    let isMounted = true;
    fetchFunction().then((result) => {
      if (isMounted) setData(result);
    });
    if (!tableName) return () => { isMounted = false };
    const channel = supabase.channel('realtime:' + tableName)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: tableName },
        () => {
          fetchFunction().then((result) => {
            if (isMounted) setData(result);
          });
        }
      )
      .subscribe();
    return () => {
      isMounted = false;
      supabase.removeChannel(channel);
    };
    // eslint-disable-next-line
  }, dependencies);
  return data;
}

export function useSupabaseQuery<T>(
  tableName: string,
  selectQuery: string = '*',
  filters?: Record<string, any>
): T | null {
  const [data, setData] = useState<T | null>(null);

  useEffect(() => {
    let query = supabase.from(tableName).select(selectQuery);
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        query = query.eq(key, value);
      });
    }
    let isMounted = true;
    query.then(({ data }) => {
      if (isMounted) setData(data as T);
    });
    return () => { isMounted = false };
    // eslint-disable-next-line
  }, [tableName, selectQuery, JSON.stringify(filters)]);
  return data;
}
