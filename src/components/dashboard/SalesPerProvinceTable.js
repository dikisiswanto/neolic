'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';

export function SalesPerProvinceTable({ className, data }) {
  if (!data || data.length === 0) {
    return (
      <Card className={cn('flex flex-col', className)}>
        <CardHeader className="items-center pb-0">
          <CardTitle>Statistik Penjualan per Provinsi (Tabel)</CardTitle>
          <CardDescription>Tidak ada data untuk ditampilkan</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 pb-0">
          <p className="text-center text-muted-foreground">
            Tidak ada data penjualan provinsi untuk ditampilkan.
          </p>
        </CardContent>
      </Card>
    );
  }

  const sortedData = [...data].sort((a, b) => {
    return b.sales_count - a.sales_count;
  });

  return (
    <Card className={cn('flex flex-col', className)}>
      <CardHeader className="items-center pb-0">
        <CardTitle>Statistik Penjualan per Provinsi</CardTitle>
        <CardDescription>Tabel penjualan berdasarkan provinsi</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ScrollArea className="h-[350px]">
          <Table className="relative">
            <TableHeader>
              <TableRow className="sticky top-0 z-10 bg-background">
                <TableHead className="text-left font-bold text-sm text-muted-foreground">
                  Provinsi
                </TableHead>
                <TableHead className="text-right font-bold text-sm text-muted-foreground">
                  Jumlah Penjualan
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedData.map((row, index) => {
                return (
                  <TableRow
                    key={index}
                    className={cn('text-xs', index % 2 === 0 ? 'bg-secondary/50' : '')}
                  >
                    <TableCell>{row.province_name}</TableCell>
                    <TableCell className="text-right">
                      {new Intl.NumberFormat().format(row.sales_count)}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
