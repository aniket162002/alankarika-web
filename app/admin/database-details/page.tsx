"use client";
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ShieldCheck } from 'lucide-react';

interface TableInfo {
  name: string;
  rowCount: number;
}

interface BucketInfo {
  name: string;
  folders: string[];
  size: number;
}

interface UsageInfo {
  dbUsed: number;
  dbTotal: number;
  storageUsed: number;
  storageTotal: number;
  plan: string;
}

export default function AdminDatabaseDetails() {
  const [tables, setTables] = useState<TableInfo[]>([]);
  const [buckets, setBuckets] = useState<BucketInfo[]>([]);
  const [usage, setUsage] = useState<UsageInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const [tablesRes, bucketsRes, usageRes] = await Promise.all([
        fetch('/api/admin/db-tables'),
        fetch('/api/admin/storage-buckets'),
        fetch('/api/admin/usage'),
      ]);
      setTables(await tablesRes.json());
      setBuckets(await bucketsRes.json());
      setUsage(await usageRes.json());
      setLoading(false);
    }
    fetchData();
  }, []);

  if (loading) return <div className="p-8 text-center">Loading database details...</div>;

  return (
    <div className="max-w-5xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6 flex items-center gap-2">
        <ShieldCheck className="w-7 h-7 text-amber-500" /> Database & Storage Details
      </h1>
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Plan & Usage</CardTitle>
        </CardHeader>
        <CardContent>
          {usage && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Badge className="bg-amber-100 text-amber-800">{usage.plan || 'Free plan'}</Badge>
                <span className="text-sm text-gray-500">(Plan limits shown below)</span>
              </div>
              <div>
                <div className="mb-1 flex justify-between text-sm">
                  <span>Database Usage</span>
                  <span>
                    Used: <b>{usage.dbUsed != null ? (usage.dbUsed/1024/1024).toFixed(2) : '0.00'} MB</b> /
                    Total: <b>{usage.dbTotal != null ? (usage.dbTotal/1024/1024).toFixed(2) : '0.00'} MB</b> &nbsp;
                    (<b>{usage.dbUsed != null && usage.dbTotal ? (100 * usage.dbUsed/usage.dbTotal).toFixed(1) : '0.0'}%</b> filled, <b>{usage.dbUsed != null && usage.dbTotal != null ? ((usage.dbTotal-usage.dbUsed)/1024/1024).toFixed(2) : '0.00'} MB</b> remaining)
                  </span>
                </div>
                <Progress value={usage.dbUsed != null && usage.dbTotal ? Math.round((usage.dbUsed/usage.dbTotal)*100) : 0} color={usage.dbUsed/usage.dbTotal > 0.8 ? 'red' : usage.dbUsed/usage.dbTotal > 0.6 ? 'yellow' : 'green'} />
              </div>
              <div>
                <div className="mb-1 flex justify-between text-sm">
                  <span>Storage Usage</span>
                  <span>
                    Used: <b>{usage.storageUsed != null ? (usage.storageUsed/1024/1024).toFixed(2) : '0.00'} MB</b> /
                    Total: <b>{usage.storageTotal != null ? (usage.storageTotal/1024/1024).toFixed(2) : '0.00'} MB</b> &nbsp;
                    (<b>{usage.storageUsed != null && usage.storageTotal ? (100 * usage.storageUsed/usage.storageTotal).toFixed(1) : '0.0'}%</b> filled, <b>{usage.storageUsed != null && usage.storageTotal != null ? ((usage.storageTotal-usage.storageUsed)/1024/1024).toFixed(2) : '0.00'} MB</b> remaining)
                  </span>
                </div>
                <Progress value={usage.storageUsed != null && usage.storageTotal ? Math.round((usage.storageUsed/usage.storageTotal)*100) : 0} color={usage.storageUsed/usage.storageTotal > 0.8 ? 'red' : usage.storageUsed/usage.storageTotal > 0.6 ? 'yellow' : 'green'} />
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Database Tables</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {tables.map((table) => (
              <div key={table.name} className="p-4 border rounded-lg bg-white flex flex-col gap-2">
                <span className="font-semibold">{table.name}</span>
                <span className="text-sm text-gray-500">Rows: {table.rowCount}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Storage Buckets</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {buckets.map((bucket) => (
              <div key={bucket.name} className="p-4 border rounded-lg bg-white flex flex-col gap-2">
                <span className="font-semibold">{bucket.name}</span>
                <span className="text-sm text-gray-500">Folders: {bucket.folders ? bucket.folders.length : 0}</span>
                <span className="text-sm text-gray-500">Size: {bucket.size != null ? (bucket.size/1024/1024).toFixed(2) : '0.00'} MB</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
